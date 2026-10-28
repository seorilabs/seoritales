import { site } from '$lib/site';
import { bookPath, liveTales, storyPath, tales } from '$lib/tales/data';
import updates from '$lib/seo/updates.json';

export const prerender = true;
const updatedAt: Record<string, string> = updates;
const paths = [
	'/',
	'/for-parents-and-teachers/',
	'/about/',
	...tales.map(storyPath),
	...liveTales.map(bookPath)
];

export function GET() {
	const urls = paths
		.map((path) => {
			const lastmod = updatedAt[path];
			if (!lastmod) throw new Error(`sitemap: ${path} 실제 수정일이 없습니다`);
			return `<url><loc>${site.url}${path}</loc><lastmod>${lastmod}</lastmod></url>`;
		})
		.join('');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
}
