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

test('확인된 Apple 도서 10권과 Google 도서 1권만 연결한다', () => {
	const appleIds = [
		'6834414435',
		'6835827216',
		'6835833444',
		'6835834776',
		'6835833434',
		'6835837398',
		'6835837336',
		'6835837339',
		'6835837953',
		'6835839262'
	];
	for (const [index, book] of books.entries()) {
		assert.equal(book.number, index + 1);
		assert.deepEqual(
			book.storeLinks.map((link) => link.store).sort(),
			index === 0 ? ['apple_books', 'google_play_books'] : ['apple_books'],
			book.title
		);
		const apple = book.storeLinks.find((link) => link.store === 'apple_books');
		const appleUrl = new URL(apple.url);
		assert.equal(appleUrl.origin, 'https://books.apple.com', book.title);
		assert.match(appleUrl.pathname, new RegExp(`^/us/book/(?:[^/]+/)?id${appleIds[index]}$`));
		assert.equal(appleUrl.search, '', book.title);
		const google = book.storeLinks.find((link) => link.store === 'google_play_books');
		if (google) assert.equal(new URL(google.url).searchParams.get('id'), 'l6UsEgAAQBAJ');
	}
});

test('미리보기의 구매 안내는 모든 서점을 고를 수 있는 책 페이지를 연다', () => {
	for (const book of books) {
		const html = readFileSync(`build/stories/${book.slug}/index.html`, 'utf8');
		assert.match(html, new RegExp(`class="buy" href="/books/${book.slug}/"`), book.title);
		assert.doesNotMatch(html, /Questions worth asking/, book.title);
	}
});

test('공개 미리보기 번들은 결말을 설명하는 기존 판매 소개를 담지 않는다', () => {
	for (const book of books) {
		assert.equal(book.backBlurb, null, book.title);
		assert.equal(book.descriptionHtml, null, book.title);
	}
});

test('홈의 구조화 목록은 화면의 기본 책 링크와 일치한다', () => {
	const html = readFileSync('build/index.html', 'utf8');
	const list = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
		.map((match) => JSON.parse(match[1]))
		.find((schema) => schema['@type'] === 'ItemList');
	assert.ok(list);
	for (const book of books) {
		assert.ok(
			list.itemListElement.some(
				(item) => item.url === `https://seoritales.com/books/${book.slug}/`
			),
			book.title
		);
	}
});
