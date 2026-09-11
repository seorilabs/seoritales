/** 사이트 전역 상수. canonical/OG/JSON-LD가 전부 여기서 파생된다. */
export const site = {
	url: 'https://seoritales.com',
	name: 'Seori Tales',
	/** 발행처. Seori Tales 는 Seori Books 의 아동 임프린트다. */
	publisher: 'Seori Books',
	email: 'cs@seorilabs.com',
	locale: 'en_US',
	/** 기본 공유 이미지. 시리즈 1권 표지 아트를 쓴다. */
	image: '/images/the-sun-and-the-moon/og.jpg'
} as const;

/**
 * Amazon Attribution 태그. 발급받으면 여기에 넣는다.
 * 태그가 있어야 외부 유입 추적과 Brand Referral Bonus가 적용된다.
 * 값이 비어 있으면 일반 상품 링크로 떨어진다 — 링크는 살아 있고 집계만 빠진다.
 */
export const amazonAttributionTag = '';
