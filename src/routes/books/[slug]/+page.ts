import { error } from '@sveltejs/kit';
import { liveTales, taleBySlug } from '$lib/tales/data';

// 아마존에 실제로 올라간 책만 상품 페이지를 만든다. 살 수 없는 상품 페이지는
// 얇을 뿐 아니라 방문자를 속인다.
export const entries = () => liveTales.map((tale) => ({ slug: tale.slug }));

export function load({ params }) {
	const tale = taleBySlug.get(params.slug);
	if (!tale || tale.asinEbook === null) error(404, 'Book not found');
	return { tale };
}
