/** tales.json 의 형태. 원본은 folktales 저장소이며 pipeline/export_web.py 가 생성한다. */

/** 그림책 한 장면. 14개가 모여 이야기 전문이 된다. */
export type StorySpread = {
	id: string;
	/** 그 장면의 문장들. 그림책 원문 그대로다. */
	text: string[];
	/** 그림 대체 텍스트. EPUB 접근성 텍스트를 그대로 재사용한다. */
	alt: string;
	/** 원본 아트 파일명(spread-01 등). 미리보기로 뽑힌 것만 웹에 존재한다. */
	spread: string;
};

export type Tale = {
	slug: string;
	sourceDir: string;
	number: number;
	title: string;
	subtitle: string;
	/** 원전 한글 제목. */
	koreanTitle: string;
	ageRange: string;
	gradeRange: string;
	language: string;
	copyrightYear: string;
	interiorPages: number;
	status: string;
	liveDate: string | null;
	/** 아직 출간되지 않았으면 null. 이 경우 구매 링크와 상품 페이지를 만들지 않는다. */
	asinEbook: string | null;
	asinPaperback: string | null;
	isbn13Paperback: string | null;
	/**
	 * KDP Select 는 디지털 독점이다. 등록 기간에는 본문을 웹에 전문 공개할 수 없다
	 * — KDP 공식 문구: "you cannot distribute your book digitally anywhere else,
	 * including on your website". 사이트는 이 값을 보고 발췌 모드로 내려간다.
	 */
	kdpSelect: { enrolled: boolean; termEnds: string | null };
	priceEbookUsd: number;
	/** KDP 상품 설명 원문(HTML). 심사를 통과한 문구라 새로 쓰지 않는다. */
	descriptionHtml: string;
	backBlurb: string;
	keywords: string[];
	categories: string[];
	glossaryHeading: string;
	glossary: string[];
	cultureNote: { heading: string; body: string[] };
	story: StorySpread[];
	/** 웹에 실제로 올라간 미리보기 아트만 담긴다. */
	previewSpreads: string[];
};

export type Series = {
	name: string;
	author: string;
	publisher: string;
	descriptionHtml: string;
	seriesPageAsin: string;
};

export type TalesBundle = { series: Series; books: Tale[] };
