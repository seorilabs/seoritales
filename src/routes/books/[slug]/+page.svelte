<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { bookSchema, breadcrumbSchema } from '$lib/seo/jsonld';
	import { metaDescription, ogImage } from '$lib/seo/urls';
	import {
		bookPath,
		buyUrl,
		coverPath,
		liveTales,
		ogPath,
		series,
		spreadPath,
		storyPath,
		tales
	} from '$lib/tales/data';

	let { data } = $props();
	const tale = $derived(data.tale);

	const path = $derived(bookPath(tale));
	const buy = $derived(buyUrl(tale));
	const spreads = $derived(
		tale.story.filter((spread) => tale.previewSpreads.includes(spread.spread))
	);
</script>

<Seo
	title="{tale.title} — Korean folktale picture book for ages {tale.ageRange} | Seori Tales"
	description={metaDescription(tale.backBlurb)}
	{path}
	type="book"
	image={ogImage(ogPath(tale), `Cover of ${tale.title}`)}
	jsonLd={[
		breadcrumbSchema([
			{ name: 'Korean folktales', path: '/' },
			{ name: tale.title, path }
		]),
		bookSchema(tale, buy)
	]}
/>

<nav class="crumbs"><a href="/">Korean folktales</a> &rsaquo; {tale.title}</nav>

<div class="hero">
	<img
		class="cover"
		src={coverPath(tale)}
		alt="Cover of {tale.title}, {tale.subtitle}"
		width="800"
		height="1280"
	/>
	<div>
		<h1>{tale.title}</h1>
		<p class="lede">{tale.subtitle}</p>
		<p>{tale.backBlurb}</p>
		{#if buy}
			<p><a class="buy" href={buy} rel="noopener">Get it on Amazon</a></p>
		{/if}
		<p class="meta">
			{#if tale.kdpSelect.enrolled}
				Or <a href={storyPath(tale)}>read the opening</a> first.
			{:else}
				Or <a href={storyPath(tale)}>read the whole story free</a> first.
			{/if}
		</p>
	</div>
</div>

<div class="prose">
	<h2>About this book</h2>
	<!-- KDP 상품 설명 원문. 심사를 통과한 문구라 사이트에서 새로 쓰지 않는다. -->
	{@html tale.descriptionHtml}

	<h2>Details</h2>
	<dl>
		<dt>Series</dt>
		<dd>{series.name}, Book {tale.number}</dd>
		<dt>Original tale</dt>
		<dd>{tale.koreanTitle}</dd>
		<dt>Reading age</dt>
		<dd>{tale.ageRange} ({tale.gradeRange})</dd>
		<dt>Pages</dt>
		<dd>{tale.interiorPages}, full colour</dd>
		<dt>Publisher</dt>
		<dd>{series.publisher}</dd>
		{#if tale.isbn13Paperback}
			<dt>ISBN-13</dt>
			<dd>{tale.isbn13Paperback}</dd>
		{/if}
	</dl>
</div>

<h2>Inside the book</h2>
<div class="spreads">
	{#each spreads as spread (spread.id)}
		<figure>
			<img
				src={spreadPath(tale, spread.spread)}
				alt={spread.alt}
				width="900"
				height="900"
				loading="lazy"
			/>
		</figure>
	{/each}
</div>

<div class="prose">
	<h2>{tale.glossaryHeading}</h2>
	<ul>
		{#each tale.glossary as entry}
			<li>{entry}</li>
		{/each}
	</ul>
</div>

<h2>More in the series</h2>
<ul class="grid">
	{#each liveTales.filter((other) => other.slug !== tale.slug) as other (other.slug)}
		<li class="card">
			<a href={bookPath(other)}>
				<img
					src={coverPath(other)}
					alt="Cover of {other.title}"
					width="800"
					height="1280"
					loading="lazy"
				/>
				<h3>{other.title}</h3>
			</a>
		</li>
	{/each}
</ul>

<style>
	.crumbs {
		font-size: 0.9rem;
		color: var(--muted);
		margin: 1.5rem 0 1rem;
	}
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 15rem) minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
		margin-bottom: 1rem;
	}
	.cover {
		border-radius: 0.5rem;
		box-shadow: 0 6px 24px rgb(0 0 0 / 0.22);
		width: 100%;
	}
	@media (max-width: 34rem) {
		.hero {
			grid-template-columns: 1fr;
		}
		.cover {
			max-width: 13rem;
		}
	}
	.spreads {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1.25rem;
		margin: 1.5rem 0;
	}
	.spreads figure {
		margin: 0;
	}
	.spreads img {
		border-radius: 0.5rem;
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.16);
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.35rem 1.25rem;
		margin: 1rem 0;
	}
	dt {
		font-weight: 700;
		color: var(--muted);
	}
	dd {
		margin: 0;
	}
</style>
