import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const site = 'https://seoritales.com';
function fixture(change = {}) {
	const root = mkdtempSync(join(tmpdir(), 'seoritales-seo-'));
	const date = change.today ? new Date().toISOString().slice(0, 10) : '2026-09-11';
	const html = (path) =>
		`<!doctype html><html lang="en"><head><title>Page ${path}</title><meta name="description" content="Korean folktales for children."><link rel="canonical" href="${site}${path}"><meta property="og:image" content="${site}/cover.jpg">${path === '/' ? (change.head ?? '') : ''}</head><body><h1>Story</h1><a href="/about/">About</a>${path === '/' ? (change.body ?? '') : ''}</body></html>`;
	mkdirSync(join(root, 'about'));
	writeFileSync(join(root, 'index.html'), html('/'));
	writeFileSync(join(root, 'about/index.html'), html('/about/'));
	writeFileSync(join(root, 'cover.jpg'), 'fixture');
	writeFileSync(join(root, 'updates.json'), JSON.stringify({ '/': date, '/about/': date }));
	writeFileSync(
		join(root, 'sitemap.xml'),
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...(change.omitAbout ? [] : ['/about/'])].map((path) => `<url><loc>${site}${path}</loc><lastmod>${change.lastmod ?? date}</lastmod></url>`).join('')}</urlset>`
	);
	return root;
}
function check(change, expected, pattern) {
	const root = fixture(change);
	try {
		const result = spawnSync(
			process.execPath,
			['scripts/check-build.mjs', root, join(root, 'updates.json')],
			{ encoding: 'utf8' }
		);
		assert.equal(result.status, expected, result.stdout + result.stderr);
		if (pattern) assert.match(result.stdout + result.stderr, pattern);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
}
test('정상 페이지와 같은 날 수정된 사이트맵을 허용한다', () => {
	check({}, 0);
	check({ today: true }, 0);
});
test('없는 내부 링크와 본문 이미지를 차단한다', () => {
	check({ body: '<a href="/missing/">Missing</a>' }, 1, /missing/);
	check({ body: '<img src="/missing.webp" alt="Missing">' }, 1, /missing/);
});
test('canonical 중복과 다른 출처를 차단한다', () => {
	check({ head: `<link rel="canonical" href="${site}/about/">` }, 1, /canonical/);
	check({ head: '<link rel="canonical" href="https://example.com/">' }, 1, /canonical/);
});
test('전자책에 종이책 ISBN과 검증되지 않은 Offer를 넣을 수 없다', () => {
	check(
		{
			head: '<script type="application/ld+json">{"@type":"Book","bookFormat":"https://schema.org/EBook","isbn":"9798185514122"}</script>'
		},
		1,
		/ISBN|isbn/
	);
	check(
		{
			head: '<script type="application/ld+json">{"@type":"Book","offers":{"@type":"Offer","availability":"https://schema.org/InStock"}}</script>'
		},
		1,
		/Offer/
	);
});
test('사이트맵 누락과 페이지 수정일 불일치를 차단한다', () => {
	check({ omitAbout: true }, 1, /about/);
	check({ lastmod: '2026-08-01' }, 1, /lastmod/);
});
test('9권 데이터와 새 이야기 경로를 제공한다', () => {
	const bundle = JSON.parse(readFileSync('src/lib/tales/tales.json', 'utf8'));
	for (const n of [8, 9])
		assert.ok(
			bundle.books.some((b) => b.number === n),
			`${n}권 누락`
		);
	for (const b of bundle.books)
		assert.ok(readFileSync(`build/stories/${b.slug}/index.html`, 'utf8').includes(b.title));
});

test('원본 전문과 판형별 출간 상태가 정적 페이지에 반영된다', () => {
	const bundle = JSON.parse(readFileSync('src/lib/tales/tales.json', 'utf8'));
	const normalize = (s) =>
		s
			.replace(/<[^>]*>/g, ' ')
			.replaceAll('&amp;', '&')
			.replaceAll('&lt;', '<')
			.replaceAll('&gt;', '>')
			.replace(/\s+/g, ' ')
			.trim();
	for (const tale of bundle.books) {
		const html = readFileSync(`build/stories/${tale.slug}/index.html`, 'utf8');
		const article = /<article\b[^>]*>([\s\S]*?)<\/article>/.exec(html)?.[1];
		assert.ok(article, tale.slug);
		for (const spread of tale.kdpSelect.enrolled ? tale.story.slice(0, 1) : tale.story) {
			for (const text of spread.text)
				assert.ok(normalize(article).includes(normalize(text)), `${tale.slug}: ${spread.id} 누락`);
		}
		const ebook = tale.statusEbook === 'live' && Boolean(tale.asinEbook);
		const paperback = tale.statusPaperback === 'live' && Boolean(tale.asinPaperback);
		const path = `build/books/${tale.slug}/index.html`;
		assert.equal(existsSync(path), ebook || paperback, tale.slug);
		if (!ebook && !paperback) continue;
		const bookHtml = readFileSync(path, 'utf8');
		const book = [
			...bookHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
		]
			.map((m) => JSON.parse(m[1]))
			.find((n) => n['@type'] === 'Book');
		assert.ok(book?.workExample, tale.slug);
		assert.equal(
			book.workExample.some((e) => e.bookFormat === 'https://schema.org/EBook'),
			ebook,
			tale.slug
		);
		assert.equal(
			book.workExample.some((e) => e.bookFormat === 'https://schema.org/Paperback'),
			paperback,
			tale.slug
		);
		for (const edition of book.workExample) {
			assert.ok(
				bookHtml.includes(edition.url.replaceAll('&', '&amp;')),
				`${tale.slug}: 판본 링크 누락`
			);
			assert.equal(
				edition.isbn,
				edition.bookFormat.endsWith('Paperback') ? (tale.isbn13Paperback ?? undefined) : undefined
			);
		}
	}
});
