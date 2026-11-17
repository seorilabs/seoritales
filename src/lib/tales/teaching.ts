/**
 * 교사·보호자용 편집 콘텐츠. 그림책 본문에서 파생되지 않는 유일한 원고이므로
 * 이야기 데이터(tales.json)와 섞지 않고 여기에 둔다.
 * 키는 tale.slug 와 1:1로 맞춘다.
 */
export type TeachingNote = {
	/** 한 줄 주제. 목록에서 고를 때 쓰는 기준이다. */
	theme: string;
	/** 책을 고르는 데 필요한 짧은 소개. 결말과 후반 사건은 공개하지 않는다. */
	pick: string;
	related: string[];
	searchName?: string;
};

export const teachingNotes: Record<string, TeachingNote> = {
	'the-sun-and-the-moon': {
		related: [
			'granny-and-the-tiger',
			'the-tiger-and-the-dried-persimmon',
			'the-rabbit-and-the-dragon-king'
		],
		pick: 'A tiger knocks at the door while two children wait for Mother. A suspenseful read-aloud for children who enjoy a little bravery at bedtime.',
		theme: 'Courage, looking after each other, and a "why" story about the sky'
	},
	'the-rabbit-and-the-dragon-king': {
		related: ['the-tiger-and-the-dried-persimmon', 'the-sun-and-the-moon', 'granny-and-the-tiger'],
		pick: 'A rabbit receives an invitation to an undersea palace. For children who love clever heroes and a story full of surprises.',
		theme: 'Quick thinking — talking your way out of trouble'
	},
	'heungbu-and-nolbu': {
		related: ['the-goblins-and-the-hazelnut', 'the-golden-axe', 'kongjwi-and-the-flower-shoe'],
		pick: 'Two brothers see the world very differently. A lively tale for talking about kindness and greed.',
		theme: 'Kindness and greed, and what each one grows into'
	},
	'the-fairy-and-the-woodcutter': {
		related: ['the-sun-and-the-moon', 'kongjwi-and-the-flower-shoe', 'the-golden-axe'],
		pick: 'A woodcutter meets a fairy beside a forest pool. A longer, wistful story for readers ready to think about promises.',
		theme: 'Promises, longing, and choices that cannot be taken back'
	},
	'kongjwi-and-the-flower-shoe': {
		searchName: 'Kongjwi and Patjwi: Korean Cinderella',
		related: ['heungbu-and-nolbu', 'granny-and-the-tiger', 'the-goblins-and-the-hazelnut'],
		pick: 'Impossible chores stand between Kongjwi and a village celebration. A Korean Cinderella tale with unexpected helpers.',
		theme: "Korea's Cinderella — kindness returned by unlikely friends"
	},
	'the-golden-axe': {
		related: ['the-goblins-and-the-hazelnut', 'heungbu-and-nolbu', 'kongjwi-and-the-flower-shoe'],
		pick: 'A woodcutter loses the axe he needs for his work. A short, clear story about choosing to tell the truth.',
		theme: 'Honesty when lying would be easier'
	},
	'the-tiger-and-the-dried-persimmon': {
		related: [
			'granny-and-the-tiger',
			'the-rabbit-and-the-dragon-king',
			'the-goblins-and-the-hazelnut'
		],
		pick: 'A hungry tiger approaches a village house on a winter night. A comic read-aloud that invites a very dramatic tiger voice.',
		theme: 'A comic misunderstanding — and what fear is actually made of'
	},
	'the-goblins-and-the-hazelnut': {
		searchName: 'The Goblins and the Hazelnut: Dokkaebi Bangmangi',
		related: ['heungbu-and-nolbu', 'the-golden-axe', 'granny-and-the-tiger'],
		pick: 'A boy gathering wood discovers a hazelnut in the forest. A rhythmic tale for children who like joining in with sounds.',
		theme: 'Sharing, greed, and thinking of others first'
	},
	'granny-and-the-tiger': {
		searchName: 'Granny and the Tiger: The Red-Bean Porridge Granny',
		related: [
			'the-sun-and-the-moon',
			'the-tiger-and-the-dried-persimmon',
			'kongjwi-and-the-flower-shoe'
		],
		pick: 'A tiger visits Granny while her red-bean porridge bubbles. A cosy winter tale for children who enjoy an unlikely team.',
		theme: 'Small friends, sharing, and standing together'
	},
	'the-red-fan-and-the-blue-fan': {
		searchName: 'The Red Fan and the Blue Fan: Ppalgan Buchae, Paran Buchae',
		related: ['the-golden-axe', 'heungbu-and-nolbu', 'the-goblins-and-the-hazelnut'],
		pick: 'Min finds two mysterious fans beside the path. A playful story for children who enjoy magic and mischief.',
		theme: 'Greed, consequences, and making amends'
	}
};
