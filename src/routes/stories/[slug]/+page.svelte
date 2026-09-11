<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { breadcrumbSchema, storySchema } from '$lib/seo/jsonld';
	import { ogImage } from '$lib/seo/urls';
	import {
		bookPath,
		buyUrl,
		formatDate,
		ogPath,
		readAloudMinutes,
		showsBookExtras,
		spreadPath,
		storyPath,
		tales,
		visibleStory
	} from '$lib/tales/data';
	import { teachingNotes } from '$lib/tales/teaching';

	let { data } = $props();
	const tale = $derived(data.tale);

	const path = $derived(storyPath(tale));
	const buy = $derived(buyUrl(tale));
	const note = $derived(teachingNotes[tale.slug]);
	const inSelect = $derived(tale.kdpSelect.enrolled);
	const spreads = $derived(visibleStory(tale));
	const previews = $derived(new Set(tale.previewSpreads));
	const others = $derived(tales.filter((other) => other.slug !== tale.slug).slice(0, 3));

	// 템플릿에서 {#if} 로 감싸면 줄바꿈이 앞 단어에 붙어 "pageon" 이 된다. 문자열로 만든다.
	const returnsOn = $derived(
		tale.kdpSelect.termEnds ? ` on ${formatDate(tale.kdpSelect.termEnds)}` : ''
	);

	const description = $derived(
		inSelect
			? `${tale.title} (${tale.koreanTitle}) — a classic Korean folktale for ages ${tale.ageRange}, with an opening extract, background and questions to ask.`
			: `Read ${tale.title} (${tale.koreanTitle}) in full, free. A classic Korean folktale retold for ages ${tale.ageRange} — about ${readAloudMinutes(tale)} minutes to read aloud.`
	);
</script>

<Seo
	title="{tale.title} — a Korean folktale to read aloud | Seori Tales"
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

{#if inSelect}
	<!--
		KDP Select 등록 중에는 본문을 전문 공개할 수 없다. 발췌만 싣고, 등록이 끝나면
		book.json 의 kdp_select 가 false 가 되면서 전문이 자동으로 돌아온다.
	-->
	<div class="panel prose">
		<h2>The rest of this story</h2>
		<p>
			{tale.title} is currently exclusive to Kindle, so we can only show the opening here. The full text
			returns to this page{returnsOn}.
		</p>
		<p>{tale.backBlurb}</p>
		{#if buy}
			<p><a class="buy" href={buy} rel="noopener">Read it on Amazon</a></p>
		{/if}
		<p class="meta">
			{tale.interiorPages} pages, full colour, ages {tale.ageRange}. Also on the
			<a href={bookPath(tale)}>book page</a>. Meanwhile, every other story here is free to read in
			full — <a href="/">see all seven</a>.
		</p>
	</div>
{:else if buy}
	<div class="panel prose">
		<h2>Read it as a picture book</h2>
		<p>{tale.backBlurb}</p>
		<p><a class="buy" href={buy} rel="noopener">Get the illustrated edition</a></p>
		<p class="meta">
			{tale.interiorPages} pages, full colour, ages {tale.ageRange}. Also on the
			<a href={bookPath(tale)}>book page</a>.
		</p>
	</div>
{/if}

<div class="prose">
	{#if showsBookExtras(tale)}
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
	{/if}

	<h2>What it is about</h2>
	<p>{note.theme}.</p>

	<h2>Questions worth asking</h2>
	<ul>
		{#each note.questions as question}
			<li>{question}</li>
		{/each}
	</ul>
	<p class="meta">
		More of these, for all seven tales, in the
		<a href="/for-parents-and-teachers/">parents and teachers guide</a>.
	</p>
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
