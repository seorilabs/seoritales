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
