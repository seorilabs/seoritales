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
test('확대 대상 10권은 첫 장면과 허용 이미지 한 장만 공개한다', () => {
	assert.equal(books.length, 10);
	for (const tale of books) {
		assert.equal(tale.webPublication?.mode, 'preview', tale.title);
		assert.equal(tale.story.length, 1, tale.title);
		assert.deepEqual(tale.cultureNote, { heading: null, body: [] });
		assert.deepEqual(tale.glossary, []);
		assert.deepEqual(readdirSync(`build/images/${tale.slug}`).sort(), [
			'cover.webp',
			'og.jpg',
			'spread-01.webp'
		]);
	}
	const home = readFileSync('build/index.html', 'utf8');
	assert.doesNotMatch(home, /0 complete stories|9 complete stories/);
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

test('교사용 안내는 미리보기에서 제거한 용어 풀이를 찾도록 안내하지 않는다', () => {
	const guide = readFileSync('build/for-parents-and-teachers/index.html', 'utf8');
	assert.doesNotMatch(guide, /Complete story pages list the words/);
	assert.match(guide, /The paperbacks introduce words/);
});

test('공개 유료 상품이 확인된 1권의 Apple과 Google 링크만 제공한다', () => {
	const first = books.find((book) => book.number === 1);
	assert.deepEqual(first.storeLinks.map((store) => store.store).sort(), [
		'apple_books',
		'google_play_books'
	]);
	assert.equal(
		first.storeLinks.find((store) => store.store === 'apple_books').url,
		'https://books.apple.com/us/book/id6834414435'
	);
	for (const book of books.filter((book) => book.number !== 1)) {
		assert.deepEqual(book.storeLinks, [], book.title);
	}
});

test('미리보기의 구매 안내는 모든 서점을 고를 수 있는 책 페이지를 연다', () => {
	for (const book of books) {
		const html = readFileSync(`build/stories/${book.slug}/index.html`, 'utf8');
		assert.match(html, new RegExp(`class="buy" href="/books/${book.slug}/"`), book.title);
		assert.doesNotMatch(html, /Questions worth asking/, book.title);
	}
});
