<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { breadcrumbSchema, storySchema } from '$lib/seo/jsonld';
	import { metaDescription, ogImage } from '$lib/seo/urls';
	import {
		bookPath,
		isPublished,
		isPreview,
		ogPath,
		readAloudMinutes,
		showsBookExtras,
		spreadPath,
		storyPath,
		taleBySlug,
		tales,
		visibleStory
	} from '$lib/tales/data';
	import { teachingNotes } from '$lib/tales/teaching';

	let { data } = $props();
	const tale = $derived(data.tale);

	const path = $derived(storyPath(tale));
	const note = $derived(teachingNotes[tale.slug]);
	const preview = $derived(isPreview(tale));
	const spreads = $derived(visibleStory(tale));
	const previews = $derived(new Set(tale.previewSpreads));
	const others = $derived(note.related.map((slug) => taleBySlug.get(slug)!));

	const description = $derived(
		metaDescription(
			preview
				? `${tale.title} (${tale.koreanTitle}) — a classic Korean folktale for ages ${tale.ageRange}, preview the opening scene and find the complete illustrated edition.`
				: `Read ${tale.title} (${tale.koreanTitle}) in full, free. A classic Korean folktale retold for ages ${tale.ageRange} — about ${readAloudMinutes(tale)} minutes to read aloud.`
		)
	);
</script>

<Seo
	title="{note.searchName ?? tale.title} — {preview
		? 'Opening Preview'
		: 'Read Aloud'} | Seori Tales"
	{description}
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
{#if note.searchName}
	<p class="meta">Also known as {note.searchName}.</p>
{/if}
<p class="meta">
	Original Korean title: {tale.koreanTitle} · Ages {tale.ageRange} · about
	{readAloudMinutes(tale)} minutes to read aloud
</p>

<div class="prose">
	<p>{note.pick}</p>
</div>

<article class="prose story">
	{#each spreads as spread (spread.id)}
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

{#if preview}
	<div class="panel prose">
		<h2>The rest of this story</h2>
		<p>
			This is the opening scene of {tale.title}. The complete story is available in the illustrated
			edition.
		</p>
		{#if isPublished(tale)}
			<p><a class="buy" href={bookPath(tale)}>Choose a store</a></p>
		{/if}
		<p class="meta">
			Full colour, ages {tale.ageRange}.
			{#if isPublished(tale)}See the <a href={bookPath(tale)}>book page</a>.{/if}
			Explore more stories —
			<a href="/">see all {tales.length} stories</a>.
		</p>
	</div>
{:else if isPublished(tale)}
	<div class="panel prose">
		<h2>Read it as a picture book</h2>
		<p>{tale.backBlurb}</p>
		<p><a class="buy" href={bookPath(tale)}>Choose a store</a></p>
		<p class="meta">
			{tale.interiorPages} pages, full colour, ages {tale.ageRange}. Also on the
			<a href={bookPath(tale)}>book page</a>.
		</p>
	</div>
{/if}

{#if showsBookExtras(tale)}
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
{/if}

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
