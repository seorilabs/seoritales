import { error } from '@sveltejs/kit';
import { taleBySlug, tales } from '$lib/tales/data';

export const entries = () => tales.map((tale) => ({ slug: tale.slug }));

export function load({ params }) {
	const tale = taleBySlug.get(params.slug);
	if (!tale) error(404, 'Book not found');
	return { tale };
}
