/**
 * 교사·보호자용 편집 콘텐츠. 그림책 본문에서 파생되지 않는 유일한 원고이므로
 * 이야기 데이터(tales.json)와 섞지 않고 여기에 둔다.
 * 키는 tale.slug 와 1:1로 맞춘다.
 */
export type TeachingNote = {
	/** 한 줄 주제. 목록에서 고를 때 쓰는 기준이다. */
	theme: string;
	/** 읽고 나서 묻기 좋은 질문. 정답이 없는 것만 고른다. */
	questions: string[];
};

export const teachingNotes: Record<string, TeachingNote> = {
	'the-sun-and-the-moon': {
		theme: 'Courage, looking after each other, and a "why" story about the sky',
		questions: [
			'The sister keeps her voice steady when she is frightened. When have you had to do that?',
			'Why do you think the story explains the sun and the moon this way?'
		]
	},
	'the-rabbit-and-the-dragon-king': {
		theme: 'Quick thinking — talking your way out of trouble',
		questions: [
			'The rabbit tells a story to save himself. Was he right to?',
			'What would you have said to the Dragon King?'
		]
	},
	'heungbu-and-nolbu': {
		theme: 'Kindness and greed, and what each one grows into',
		questions: [
			'Heungbu helps the swallow when no one is watching. Does that matter?',
			'Nolbu copies his brother but gets a different result. Why?'
		]
	},
	'the-fairy-and-the-woodcutter': {
		theme: 'Promises, longing, and choices that cannot be taken back',
		questions: [
			'The woodcutter breaks a promise because he is lonely. Can you understand it?',
			'What do you think happens after the story ends?'
		]
	},
	'kongjwi-and-the-flower-shoe': {
		theme: "Korea's Cinderella — kindness returned by unlikely friends",
		questions: [
			'An ox and a toad help Kongjwi. Who has helped you when you did not expect it?',
			'How is this story like Cinderella? How is it different?'
		]
	},
	'the-golden-axe': {
		theme: 'Honesty when lying would be easier',
		questions: [
			'The woodcutter tells the truth and loses nothing. Is that how it usually works?',
			'What makes telling the truth hard?'
		]
	},
	'the-tiger-and-the-dried-persimmon': {
		theme: 'A comic misunderstanding — and what fear is actually made of',
		questions: [
			'The tiger is frightened of a sweet. What made him so sure it was a monster?',
			'Have you ever been scared of something that turned out to be small?'
		]
	}
};
