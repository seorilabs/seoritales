import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const { books } = JSON.parse(readFileSync('src/lib/tales/tales.json', 'utf8'));
test('파일럿 공개 번들은 첫 장면과 허용 이미지 한 장만 제공한다', () => {
	const tale = books.find((b) => b.number === 1);
	assert.equal(tale.webPublication?.mode, 'preview');
	assert.equal(tale.kdpSelect.enrolled, false);
	assert.equal(tale.story.length, 1);
	assert.deepEqual(tale.previewSpreads, ['spread-01']);
	assert.deepEqual(tale.cultureNote, { heading: null, body: [] });
	assert.deepEqual(tale.glossary, []);
	assert.deepEqual(readdirSync(`build/images/${tale.slug}`).sort(), [
		'cover.webp',
		'og.jpg',
		'spread-01.webp'
	]);
	const html = readFileSync(`build/stories/${tale.slug}/index.html`, 'utf8');
	assert.match(html, /opening scene/);
	assert.doesNotMatch(
		html,
		/currently exclusive to Kindle|full text.*returns|read.*in full, free/i
	);
});
test('양쪽 파일럿 완료 전에는 후속 9권 공개 정책을 유지한다', () => {
	assert.equal(books.filter((b) => b.webPublication?.mode === 'full').length, 9);
	assert.ok(books.slice(1).every((b) => b.story.length === 14));
	const home = readFileSync('build/index.html', 'utf8');
	assert.match(home, /9 complete stories/);
	assert.match(home, /opening previews/);
});
test('공개된 새 서점 링크는 그림책 페이지에 연결한다', () => {
	for (const b of books) {
		for (const store of b.storeLinks) {
			const url = new URL(store.url);
			assert.equal(url.protocol, 'https:');
			assert.equal(
				url.hostname,
				store.store === 'apple_books' ? 'books.apple.com' : 'play.google.com'
			);
			const html = readFileSync(`build/books/${b.slug}/index.html`, 'utf8');
			assert.ok(html.includes(store.url.replaceAll('&', '&amp;')));
			assert.ok(html.includes(`eBook on ${store.label}`));
		}
	}
});
