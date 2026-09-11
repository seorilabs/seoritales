import { amazonAttributionTag } from '$lib/site';
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

export function amazonUrl(asin: string): string {
	const base = `https://www.amazon.com/dp/${asin}`;
	return amazonAttributionTag ? `${base}?tag=${amazonAttributionTag}` : base;
}

/** 책의 구매 링크. ASIN이 없으면 null — 호출부가 링크를 숨긴다. */
export function buyUrl(tale: Tale): string | null {
	return tale.asinEbook ? amazonUrl(tale.asinEbook) : null;
}

export const seriesUrl = amazonUrl(series.seriesPageAsin);

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
