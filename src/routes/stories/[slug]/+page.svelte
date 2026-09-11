<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { breadcrumbSchema, storySchema } from '$lib/seo/jsonld';
	import { ogImage } from '$lib/seo/urls';
	import {
		bookPath,
		buyUrl,
		ogPath,
		readAloudMinutes,
		spreadPath,
		storyPath,
		tales
	} from '$lib/tales/data';

	let { data } = $props();
	const tale = $derived(data.tale);

	const path = $derived(storyPath(tale));
	const buy = $derived(buyUrl(tale));
	const previews = $derived(new Set(tale.previewSpreads));
	const others = $derived(tales.filter((other) => other.slug !== tale.slug).slice(0, 3));
</script>

<Seo
	title="{tale.title} — a Korean folktale to read aloud | Seori Tales"
	description="Read {tale.title} ({tale.koreanTitle}) in full, free. A classic Korean folktale retold for ages {tale.ageRange} — about {readAloudMinutes(
		tale
	)} minutes to read aloud."
	{path}
	type="article"
	image={ogImage(ogPath(tale), `Illustration from ${tale.title}`)}
	jsonLd={[
		breadcrumbSchema([
			{ name: 'Korean folktales', path: '/' },
			{ name: tale.title, path }
		]),
		storySchema(tale, path)
	]}
/>

<nav class="crumbs"><a href="/">Korean folktales</a> &rsaquo; {tale.title}</nav>

<h1>{tale.title}</h1>
<p class="lede">{tale.subtitle}</p>
<p class="meta">
	Original Korean title: {tale.koreanTitle} · Ages {tale.ageRange} · about
	{readAloudMinutes(tale)} minutes to read aloud
</p>

<article class="prose story">
	{#each tale.story as spread (spread.id)}
		{#if previews.has(spread.spread)}
			<figure>
				<img
					src={spreadPath(tale, spread.spread)}
					alt={spread.alt}
					width="900"
					height="900"
					loading={spread.spread === tale.previewSpreads[0] ? 'eager' : 'lazy'}
				/>
			</figure>
		{/if}
		{#each spread.text as line}
			<p>{line}</p>
		{/each}
	{/each}
</article>

{#if buy}
	<div class="panel prose">
		<h2>Read it as a picture book</h2>
		<p>
			{tale.backBlurb}
		</p>
		<p>
			<a class="buy" href={buy} rel="noopener">Get the illustrated edition</a>
		</p>
		<p class="meta">
			{tale.interiorPages} pages, full colour, ages {tale.ageRange}. Also on the
			<a href={bookPath(tale)}>book page</a>.
		</p>
	</div>
{/if}

<div class="prose">
	<h2>{tale.cultureNote.heading}</h2>
	{#each tale.cultureNote.body as line}
		<p>{line}</p>
	{/each}

	<h2>{tale.glossaryHeading}</h2>
	<ul>
		{#each tale.glossary as entry}
			<li>{entry}</li>
		{/each}
	</ul>
	<p class="meta">Say them out loud together.</p>
</div>

<h2>More Korean folktales</h2>
<ul class="grid">
	{#each others as other (other.slug)}
		<li class="card">
			<a href={storyPath(other)}>
				<h3>{other.title}</h3>
				<p>{other.koreanTitle} · {readAloudMinutes(other)} min</p>
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
	.story p {
		margin: 0 0 1.15rem;
	}
	.story figure {
		margin: 2rem 0;
	}
	.story img {
		border-radius: 0.75rem;
		box-shadow: 0 6px 24px rgb(0 0 0 / 0.18);
	}
</style>
