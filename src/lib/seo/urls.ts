import { site } from '$lib/site';

/** 루트 상대 경로를 canonical/og:url용 절대 URL로 바꾼다. */
export function absoluteUrl(path: string): string {
	return `${site.url}${path}`;
}

export type OgImage = { path: string; width: number; height: number; alt: string };

export const defaultOgImage: OgImage = {
	path: site.image,
	width: 1200,
	height: 630,
	alt: 'Seori Tales — Korean folktales retold for children'
};

/** export_web.py 가 1200x630으로 만든 공유 이미지. */
export const ogImage = (path: string, alt: string): OgImage => ({
	path,
	width: 1200,
	height: 630,
	alt
});

/** 검색결과에서 잘리지 않는 길이. 구글은 대략 이 근처에서 끊는다. */
const META_LIMIT = 155;

/**
 * 뒷표지 문구처럼 긴 원문을 meta description 길이로 줄인다.
 * 문장 끝에서 끊는 것을 우선하고, 그럴 수 없으면 단어 경계에서 말줄임한다.
 */
export function metaDescription(text: string): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= META_LIMIT) return clean;

	const head = clean.slice(0, META_LIMIT + 1);
	const sentenceEnd = Math.max(
		head.lastIndexOf('. '),
		head.lastIndexOf('! '),
		head.lastIndexOf('? ')
	);
	if (sentenceEnd >= 80) return clean.slice(0, sentenceEnd + 1);

	const wordEnd = head.lastIndexOf(' ');
	return clean.slice(0, wordEnd > 0 ? wordEnd : META_LIMIT).trimEnd() + '…';
}
