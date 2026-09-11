import { attributionUrls } from './attribution';
import bundle from './tales.json';
import type { Tale, TalesBundle } from './types';

const data = bundle as TalesBundle;

export const series = data.series;
export const tales = data.books;

export const taleBySlug = new Map(tales.map((tale) => [tale.slug, tale]));

/** 실제로 아마존에 올라간 책만. 상품 페이지는 이것만 만든다. */
export const liveTales = tales.filter((tale) => tale.asinEbook !== null);

/**
 * KDP Select 등록 중에 공개할 수 있는 스프레드 수.
 * eBook 은 19쪽이고 허용치는 샘플 10%(약 1.9쪽)다. 1스프레드면 확실히 그 안이다.
 * 등록이 끝나 book.json 의 kdp_select 가 false 가 되면 자동으로 전문이 돌아온다.
 */
const EXCERPT_SPREADS = 1;

/** Select 등록 중이면 발췌만 내보낸다. 아니면 14스프레드 전문. */
export function visibleStory(tale: Tale) {
	return tale.kdpSelect.enrolled ? tale.story.slice(0, EXCERPT_SPREADS) : tale.story;
}

/**
 * 본문 외에 책에서 가져온 것(문화 노트, 용어 풀이)도 Select 중에는 싣지 않는다.
 * 이것들도 eBook 안에 든 페이지이기 때문이다.
 */
export const showsBookExtras = (tale: Tale) => !tale.kdpSelect.enrolled;

/** 'October 4, 2026' 처럼 읽히는 형태로. */
export function formatDate(iso: string): string {
	return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

/**
 * Attribution 링크와 원장이 어긋나면 조용히 엉뚱한 책의 매출로 집계된다.
 * 빌드 때 한 번 확인하고, 틀리면 prerender 를 실패시킨다.
 */
for (const [slug, url] of Object.entries(attributionUrls)) {
	const tale = taleBySlug.get(slug);
	if (!tale) throw new Error(`attribution: 알 수 없는 slug "${slug}"`);
	if (!tale.asinEbook || !url.includes(`/dp/${tale.asinEbook}`)) {
		throw new Error(`attribution: "${slug}" 링크가 ASIN ${tale.asinEbook} 과 다릅니다 -> ${url}`);
	}
}

/**
 * 책의 구매 링크. Attribution 링크가 있으면 그것을 쓴다 — 외부 유입 추적과
 * Brand Referral Bonus 가 거기에 달려 있다. 없으면 일반 상품 링크로 떨어진다.
 * ASIN 자체가 없으면 null 이고, 호출부가 링크를 숨긴다.
 */
export function buyUrl(tale: Tale): string | null {
	if (!tale.asinEbook) return null;
	return attributionUrls[tale.slug] ?? `https://www.amazon.com/dp/${tale.asinEbook}`;
}

export const storyPath = (tale: Tale) => `/stories/${tale.slug}/`;
export const bookPath = (tale: Tale) => `/books/${tale.slug}/`;
export const coverPath = (tale: Tale) => `/images/${tale.slug}/cover.webp`;
export const ogPath = (tale: Tale) => `/images/${tale.slug}/og.jpg`;
export const spreadPath = (tale: Tale, spread: string) => `/images/${tale.slug}/${spread}.webp`;

/** 소리 내어 읽는 속도(분당 약 130단어)로 계산한 읽기 시간. */
export function readAloudMinutes(tale: Tale): number {
	const words = tale.story.reduce((sum, s) => sum + s.text.join(' ').split(/\s+/).length, 0);
	return Math.max(2, Math.round(words / 130));
}
