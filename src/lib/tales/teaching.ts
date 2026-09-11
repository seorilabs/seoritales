/**
 * 교사·보호자용 편집 콘텐츠. 그림책 본문에서 파생되지 않는 유일한 원고이므로
 * 이야기 데이터(tales.json)와 섞지 않고 여기에 둔다.
 * 키는 tale.slug 와 1:1로 맞춘다.
 */
export type TeachingNote = {
	/** 한 줄 주제. 목록에서 고를 때 쓰는 기준이다. */
	theme: string;
	/**
	 * 홈의 큐레이션 목록에 붙는 주석. 줄거리 요약이 아니라 "왜 이걸 고르는가"를
	 * 쓴다 — 뒷표지 문구는 이미 책 페이지에 있고, 여기서 반복하면 둘 다 약해진다.
	 */
	pick: string;
	/** 읽고 나서 묻기 좋은 질문. 정답이 없는 것만 고른다. */
	questions: string[];
};

export const teachingNotes: Record<string, TeachingNote> = {
	'the-sun-and-the-moon': {
		pick: "The one to start with. A tiger in a mother's clothes knocks at the door, and two children have to see through him — which is the oldest lesson in the book and still the most useful. It ends by putting them in the sky, so the fright resolves into something a child can point at the next evening.",
		theme: 'Courage, looking after each other, and a "why" story about the sky',
		questions: [
			'The sister keeps her voice steady when she is frightened. When have you had to do that?',
			'Why do you think the story explains the sun and the moon this way?'
		]
	},
	'the-rabbit-and-the-dragon-king': {
		pick: 'The funniest of the seven, and the best for a child who likes being cleverer than the grown-ups. A turtle talks a rabbit into visiting an undersea palace without mentioning what the Dragon King wants with him. The rabbit gets out by lying beautifully, which children find deeply satisfying and adults may want to discuss afterwards.',
		theme: 'Quick thinking — talking your way out of trouble',
		questions: [
			'The rabbit tells a story to save himself. Was he right to?',
			'What would you have said to the Dragon King?'
		]
	},
	'heungbu-and-nolbu': {
		pick: "Korea's great story about two brothers, and the one most likely to start an argument at bedtime. Heungbu mends a swallow's broken leg and is repaid; Nolbu breaks one on purpose to get the same reward. Children work out on their own why it does not go well for him.",
		theme: 'Kindness and greed, and what each one grows into',
		questions: [
			'Heungbu helps the swallow when no one is watching. Does that matter?',
			'Nolbu copies his brother but gets a different result. Why?'
		]
	},
	'the-fairy-and-the-woodcutter': {
		pick: 'The longest and the saddest, better at six than at four. A lonely woodcutter hides a heavenly robe so its owner cannot leave, and years later has to decide whether to give it back. There is no villain in it, which is precisely what makes it stay with people.',
		theme: 'Promises, longing, and choices that cannot be taken back',
		questions: [
			'The woodcutter breaks a promise because he is lonely. Can you understand it?',
			'What do you think happens after the story ends?'
		]
	},
	'kongjwi-and-the-flower-shoe': {
		pick: "Korea's Cinderella, and the easiest entry point for a child who already knows the European one. The stepmother and the impossible chores are familiar; the black ox, the flock of sparrows and the kind toad who plugs a leaking jar are not. Good for asking how two countries told the same story differently.",
		theme: "Korea's Cinderella — kindness returned by unlikely friends",
		questions: [
			'An ox and a toad help Kongjwi. Who has helped you when you did not expect it?',
			'How is this story like Cinderella? How is it different?'
		]
	},
	'the-golden-axe': {
		pick: 'The shortest and the most direct — an honest woodcutter, a lost axe, and a mountain spirit offering him a better one. It works on very young children because the choice is visible and the consequence is immediate. A greedy neighbour tries the same trick, which is where the real ending lives.',
		theme: 'Honesty when lying would be easier',
		questions: [
			'The woodcutter tells the truth and loses nothing. Is that how it usually works?',
			'What makes telling the truth hard?'
		]
	},
	'the-tiger-and-the-dried-persimmon': {
		pick: 'Pure comedy, and the best read-aloud of the lot. A tiger listens at a window while a mother fails to quiet her crying baby, then succeeds instantly by mentioning a dried persimmon — and the tiger concludes that a gotgam must be the most terrifying creature in Korea. Give the tiger a voice and this one runs itself.',
		theme: 'A comic misunderstanding — and what fear is actually made of',
		questions: [
			'The tiger is frightened of a sweet. What made him so sure it was a monster?',
			'Have you ever been scared of something that turned out to be small?'
		]
	}
};
