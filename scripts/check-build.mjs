/**
 * 빌드 산출물의 head 태그를 검사한다.
 *
 * prerender 크롤러는 루트 상대 링크만 따라가고 절대 URL은 큐에 넣지 않는다.
 * 따라서 canonical, hreflang, og:image가 404를 가리켜도 빌드는 조용히 통과한다.
 * 이 스크립트가 그 사각지대를 메운다.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const buildDir = process.argv[2] ?? 'build';
const SITE = 'https://seoritales.com';

function htmlFiles(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			if (entry === '_app') continue;
			out.push(...htmlFiles(full));
		} else if (entry.endsWith('.html')) {
			out.push(full);
		}
	}
	return out;
}

/** 사이트 내부 절대 URL이 실제 산출물을 가리키는지 확인한다. */
function resolvesInBuild(url) {
	if (!url.startsWith(SITE)) return true; // 외부 링크는 검사 대상이 아니다
	const path = url.slice(SITE.length) || '/';
	if (path.endsWith('/')) return existsSync(join(buildDir, path, 'index.html'));
	return existsSync(join(buildDir, path));
}

const errors = [];
const pages = htmlFiles(buildDir);

for (const file of pages) {
	const rel = '/' + relative(buildDir, file);
	const html = readFileSync(file, 'utf8');
	// Search Console 소유권 검증 파일처럼 문서가 아닌 정적 파일은 건너뛴다.
	if (!html.includes('<html')) continue;
	// noindex 페이지는 색인 대상이 아니라 canonical과 공유 이미지를 요구하지 않는다.
	const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
	const head = /<head>([\s\S]*?)<\/head>/.exec(html)?.[1] ?? '';

	if (html.includes('%lang%')) {
		errors.push(`${rel}: %lang% 자리표시자가 치환되지 않았습니다 (hooks.server.ts 확인)`);
	}

	const lang = /<html lang="([^"]*)"/.exec(html)?.[1];
	if (!lang) errors.push(`${rel}: <html lang> 이 없습니다`);

	// 검색결과에서 잘리는 설명은 클릭률을 떨어뜨린다. 원장의 긴 블러브를 그대로
	// 흘리는 회귀를 막는다. 한도는 구글 표시 길이보다 넉넉하게 잡았다.
	const description = /<meta[^>]*name="description"[^>]*content="([^"]*)"/.exec(head)?.[1];
	if (!description) {
		if (!noindex) errors.push(`${rel}: meta description이 없습니다`);
	} else if (description.length > 170) {
		errors.push(`${rel}: meta description이 ${description.length}자입니다 (170자 이하)`);
	}

	const canonical = /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/.exec(head)?.[1];
	if (!canonical) {
		if (!noindex) errors.push(`${rel}: canonical 링크가 없습니다`);
	} else if (!resolvesInBuild(canonical)) {
		errors.push(`${rel}: canonical이 빌드에 없는 주소를 가리킵니다 -> ${canonical}`);
	}

	for (const [, href] of head.matchAll(/<link[^>]*rel="alternate"[^>]*href="([^"]*)"/g)) {
		if (!resolvesInBuild(href)) {
			errors.push(`${rel}: hreflang이 빌드에 없는 주소를 가리킵니다 -> ${href}`);
		}
	}

	const ogImage = /<meta[^>]*property="og:image"[^>]*content="([^"]*)"/.exec(head)?.[1];
	if (!ogImage) {
		if (!noindex) errors.push(`${rel}: og:image가 없습니다`);
	} else if (!resolvesInBuild(ogImage)) {
		errors.push(`${rel}: og:image 파일이 없습니다 -> ${ogImage}`);
	}
}

// sitemap의 lastmod가 전부 오늘로 찍히는 회귀를 감지한다.
const sitemapPath = join(buildDir, 'sitemap.xml');
if (existsSync(sitemapPath)) {
	const sitemap = readFileSync(sitemapPath, 'utf8');
	const lastmods = [...sitemap.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
	const today = new Date().toISOString().slice(0, 10);
	const todayCount = lastmods.filter((value) => value.startsWith(today)).length;
	if (lastmods.length > 0 && todayCount === lastmods.length) {
		errors.push(
			`sitemap.xml: lastmod ${lastmods.length}개가 전부 오늘(${today})입니다. ` +
				'빌드 시각을 쓰고 있지 않은지 확인하세요.'
		);
	}
	// lastmod 는 W3C Datetime 이어야 한다. 원장의 미기록 자리표시자("TBD")가
	// 그대로 새어 나오면 색인 자체는 되지만 갱신 신호가 통째로 무시된다.
	for (const value of lastmods) {
		if (!/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) {
			errors.push(`sitemap.xml: lastmod 가 날짜 형식이 아닙니다 -> ${value}`);
		}
	}

	for (const [, loc] of sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)) {
		if (!resolvesInBuild(loc)) errors.push(`sitemap.xml: 없는 주소를 등재했습니다 -> ${loc}`);
	}
}

if (errors.length > 0) {
	console.error(`check-build: 오류 ${errors.length}건`);
	for (const error of errors.slice(0, 40)) console.error(`  ${error}`);
	if (errors.length > 40) console.error(`  ... 외 ${errors.length - 40}건`);
	process.exit(1);
}

console.log(`check-build: 페이지 ${pages.length}개 통과`);
