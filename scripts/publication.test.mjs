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
test('확인되지 않은 새 서점 구매 링크를 생성하지 않는다', () => {
	for (const b of books) {
		assert.deepEqual(b.storeLinks, []);
		const html = readFileSync(`build/stories/${b.slug}/index.html`, 'utf8');
		assert.doesNotMatch(
			html,
			/href="https:\/\/(?:books\.apple\.com|play\.google\.com\/store\/books)/
		);
	}
});
