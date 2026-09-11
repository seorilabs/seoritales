<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { breadcrumbSchema } from '$lib/seo/jsonld';
	import { readAloudMinutes, storyPath, tales } from '$lib/tales/data';
	import { teachingNotes } from '$lib/tales/teaching';

	const path = '/for-parents-and-teachers/';
</script>

<Seo
	title="Korean folktales for kids — a guide for parents and teachers | Seori Tales"
	description="Seven Korean folktales for ages 4–8, sorted by theme and read-aloud length, with discussion questions. Every tale is free to read in full."
	{path}
	jsonLd={[
		breadcrumbSchema([
			{ name: 'Korean folktales', path: '/' },
			{ name: 'For parents and teachers', path }
		])
	]}
/>

<nav class="crumbs"><a href="/">Korean folktales</a> &rsaquo; For parents and teachers</nav>

<h1>Korean folktales for kids: a guide for parents and teachers</h1>
<p class="lede">
	Seven tales for ages 4–8, sorted by what they are actually about — with the questions worth asking
	afterwards.
</p>

<div class="prose">
	<p>
		Korean folktales work well read aloud because that is how they were built. They were told, not
		written, so they move fast, repeat their best lines, and end on a turn a small child can feel
		coming. Most take under ten minutes.
	</p>
	<p>
		Every story below is free to read in full on this site. Nothing is gated, and there is no
		sign-up. If a tale becomes a favourite, there is an illustrated picture book of it too.
	</p>

	<h2>Choosing a story</h2>
</div>

<div class="scroll">
	<table>
		<thead>
			<tr>
				<th scope="col">Story</th>
				<th scope="col">What it is about</th>
				<th scope="col">Read-aloud</th>
			</tr>
		</thead>
		<tbody>
			{#each tales as tale (tale.slug)}
				<tr>
					<th scope="row">
						<a href={storyPath(tale)}>{tale.title}</a>
						<span class="ko">{tale.koreanTitle}</span>
					</th>
					<td>{teachingNotes[tale.slug].theme}</td>
					<td class="num">{readAloudMinutes(tale)} min</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="prose">
	<h2>Reading them aloud</h2>
	<p>
		Give the tiger a voice. These stories were performed, and they reward a bit of ham — a low
		growl, a pause before the rope comes down from the sky. Children who will not sit for a quiet
		book will sit for a loud one.
	</p>
	<p>
		Do not skip the frightening parts. Folktales put danger in on purpose and then resolve it, which
		is the whole point; a tiger that is never scary is not worth escaping. The endings here are
		safe.
	</p>
	<p>
		Say the Korean words out loud. Each story lists the ones inside it — <i>tteok</i>,
		<i>hanbok</i>,
		<i>gotgam</i> — with a short gloss. Getting them slightly wrong together is fine and is usually the
		part children remember.
	</p>

	<h2>Questions worth asking</h2>
	<p>These have no right answer, which is what makes them work.</p>
</div>

<div class="prose">
	{#each tales as tale (tale.slug)}
		<h3><a href={storyPath(tale)}>{tale.title}</a></h3>
		<ul>
			{#each teachingNotes[tale.slug].questions as question}
				<li>{question}</li>
			{/each}
		</ul>
	{/each}
</div>

<div class="prose">
	<h2>A note on where these come from</h2>
	<p>
		Every tale here is a traditional Korean folktale in the public domain, told for centuries before
		anyone wrote it down. There is no single authoritative version of any of them — the one your
		Korean neighbour grew up with may differ from ours in its details. We keep the beats that Korean
		tellers keep and say so on each story page.
	</p>
</div>

<style>
	.crumbs {
		font-size: 0.9rem;
		color: var(--muted);
		margin: 1.5rem 0 1rem;
	}
	.scroll {
		overflow-x: auto;
		margin: 1.5rem 0 2rem;
	}
	table {
		border-collapse: collapse;
		width: 100%;
		min-width: 34rem;
		font-size: 0.98rem;
	}
	th,
	td {
		text-align: left;
		vertical-align: top;
		padding: 0.6rem 0.75rem;
		border-bottom: 1px solid var(--line);
	}
	thead th {
		color: var(--muted);
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	tbody th {
		font-weight: 700;
	}
	.ko {
		display: block;
		font-weight: 400;
		font-size: 0.85rem;
		color: var(--muted);
	}
	.num {
		white-space: nowrap;
	}
</style>
