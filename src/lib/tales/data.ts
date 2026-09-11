import { amazonAttributionTag } from '$lib/site';
import bundle from './tales.json';
import type { Tale, TalesBundle } from './types';

const data = bundle as TalesBundle;

export const series = data.series;
export const tales = data.books;

export const taleBySlug = new Map(tales.map((tale) => [tale.slug, tale]));

/** ASIN이 기록된 책만. 구매 링크가 필요한 자리에서 쓴다. */
export const purchasable = tales.filter((tale) => tale.asinEbook !== null);

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
