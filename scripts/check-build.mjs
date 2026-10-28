/** 정적 산출물의 검색 정보, 링크, 이미지와 판본 정보를 검사한다. */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const buildDir = process.argv[2] ?? 'build';
const updatesFile = process.argv[3] ?? 'src/lib/seo/updates.json';
const SITE = 'https://seoritales.com';
const errors = [];
const today = new Date().toISOString().slice(0, 10);
const updates = JSON.parse(readFileSync(updatesFile, 'utf8'));
const decode = (text) =>
	text.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
		const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
		if (named[entity]) return named[entity];
		return String.fromCodePoint(
			entity.startsWith('&#x')
				? parseInt(entity.slice(3, -1), 16)
				: parseInt(entity.slice(2, -1), 10)
		);
	});
function attributes(raw) {
	return Object.fromEntries(
		[...raw.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [
			m[1].toLowerCase(),
			decode(m[2] ?? m[3])
		])
	);
}
function htmlFiles(dir) {
	return readdirSync(dir).flatMap((entry) => {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) return entry === '_app' ? [] : htmlFiles(full);
		return entry.endsWith('.html') ? [full] : [];
	});
}
function resolves(url, pagePath = '/') {
	const parsed = new URL(url, SITE + pagePath);
	if (parsed.origin !== SITE) return true;
	const path = decodeURIComponent(parsed.pathname);
	return path.endsWith('/')
		? existsSync(join(buildDir, path, 'index.html'))
		: existsSync(join(buildDir, path));
}
function inspectSchema(node, pagePath) {
	if (!node || typeof node !== 'object') return;
	if (node.bookFormat === 'https://schema.org/EBook' && node.isbn)
		errors.push(`${pagePath}: 전자책에 종이책 ISBN을 붙였습니다`);
	if (node.offers || node['@type'] === 'Offer')
		errors.push(`${pagePath}: 소매 확인 근거 없는 Offer입니다`);
	for (const [key, value] of Object.entries(node)) {
		if (
			['url', 'item', 'image', '@id'].includes(key) &&
			typeof value === 'string' &&
			value.startsWith(SITE + '/') &&
			!resolves(value)
		)
			errors.push(`${pagePath}: JSON-LD 없는 주소 -> ${value}`);
		if (typeof value === 'object') {
			if (Array.isArray(value)) value.forEach((entry) => inspectSchema(entry, pagePath));
			else inspectSchema(value, pagePath);
		}
	}
}
const paths = new Set();
const titles = new Set();
for (const file of htmlFiles(buildDir)) {
	const html = readFileSync(file, 'utf8');
	if (!/<html\b/i.test(html)) continue;
	const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? '';
	const tags = [...head.matchAll(/<(meta|link)\b([^>]*?)>/gi)].map((m) => ({
		tag: m[1].toLowerCase(),
		...attributes(m[2])
	}));
	if (tags.some((t) => t.name === 'robots' && t.content?.includes('noindex'))) continue;
	const rel = relative(buildDir, file).replaceAll('\\', '/');
	const path =
		rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? '/' + rel.slice(0, -10) : '/' + rel;
	paths.add(path);
	const fail = (message) => errors.push(`${path}: ${message}`);
	if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) fail('<html lang>이 없습니다');
	const pageTitles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((m) =>
		decode(m[1]).trim()
	);
	if (pageTitles.length !== 1 || !pageTitles[0]) fail('title은 한 개여야 합니다');
	else if (titles.has(pageTitles[0])) fail('title이 다른 페이지와 중복됩니다');
	else titles.add(pageTitles[0]);
	if ([...html.matchAll(/<h1\b/gi)].length !== 1) fail('h1은 한 개여야 합니다');
	const descriptions = tags.filter((t) => t.name === 'description');
	if (descriptions.length !== 1 || !descriptions[0].content)
		fail('meta description은 한 개여야 합니다');
	else if (descriptions[0].content.length > 170)
		fail(`meta description이 ${descriptions[0].content.length}자입니다 (170자 이하)`);
	const canonicals = tags.filter((t) => t.tag === 'link' && t.rel === 'canonical');
	if (canonicals.length !== 1 || canonicals[0].href !== SITE + path)
		fail(`canonical은 ${SITE + path} 한 개여야 합니다`);
	const og = tags.filter((t) => t.property === 'og:image');
	if (og.length !== 1 || !og[0].content || !resolves(og[0].content))
		fail('og:image 파일이 없습니다');
	for (const [, tag, raw] of html.matchAll(/<(a|img|link)\b([^>]*?)>/gi)) {
		const attrs = attributes(raw);
		const url = tag.toLowerCase() === 'img' ? attrs.src : attrs.href;
		if (!url || url.startsWith('#')) continue;
		if (!resolves(url, path)) fail(`없는 내부 링크 또는 이미지 -> ${url}`);
	}
	for (const [, raw] of html.matchAll(
		/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
	)) {
		try {
			inspectSchema(JSON.parse(raw), path);
		} catch {
			fail('JSON-LD를 해석할 수 없습니다');
		}
	}
	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(updates[path] ?? '') ||
		!Number.isFinite(Date.parse(updates[path])) ||
		new Date(updates[path]).toISOString().slice(0, 10) !== updates[path] ||
		updates[path] > today
	)
		fail('실제 수정일이 없거나 날짜가 잘못됐습니다');
}
const sitemapPath = join(buildDir, 'sitemap.xml');
if (!existsSync(sitemapPath)) errors.push('sitemap.xml이 없습니다');
else {
	const sitemap = readFileSync(sitemapPath, 'utf8');
	const listed = new Set();
	for (const [, entry] of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
		const loc = /<loc>([^<]+)<\/loc>/.exec(entry)?.[1];
		const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(entry)?.[1];
		if (!loc || !loc.startsWith(SITE + '/')) {
			errors.push('sitemap.xml: 잘못된 loc');
			continue;
		}
		const path = loc.slice(SITE.length);
		if (listed.has(path)) errors.push(`sitemap.xml: 중복 주소 -> ${path}`);
		listed.add(path);
		if (!paths.has(path)) errors.push(`sitemap.xml: 색인 가능한 페이지가 없습니다 -> ${path}`);
		if (lastmod !== updates[path])
			errors.push(`sitemap.xml: ${path} lastmod가 실제 수정일과 다릅니다`);
	}
	for (const path of paths) if (!listed.has(path)) errors.push(`sitemap.xml: ${path} 누락`);
}
for (const path of Object.keys(updates))
	if (!paths.has(path)) errors.push(`수정일 원장: 없는 페이지 -> ${path}`);
if (errors.length) {
	console.error(`check-build: 오류 ${errors.length}건`);
	errors.forEach((error) => console.error(`  ${error}`));
	process.exit(1);
}
console.log(`check-build: 페이지 ${paths.size}개 통과`);
