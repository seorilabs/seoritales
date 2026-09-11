<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { breadcrumbSchema, organizationSchema } from '$lib/seo/jsonld';
	import { site } from '$lib/site';
	import { series, tales } from '$lib/tales/data';

	const path = '/about/';
</script>

<Seo
	title="About Seori Tales — how these Korean folktales are made"
	description="Seori Tales retells traditional Korean folktales as picture books for children ages 4–8. How the stories are chosen, how the art is made, and how to get in touch."
	{path}
	jsonLd={[
		breadcrumbSchema([
			{ name: 'Korean folktales', path: '/' },
			{ name: 'About', path }
		]),
		organizationSchema()
	]}
/>

<nav class="crumbs"><a href="/">Korean folktales</a> &rsaquo; About</nav>

<h1>About Seori Tales</h1>
<p class="lede">Korean folktales, retold for children who have never heard them.</p>

<div class="prose">
	<p>
		{series.name} is a picture book series from {site.publisher}. There are {tales.length} books so far,
		each one a single traditional Korean tale told in read-aloud English for ages 4–8.
	</p>

	<h2>Why these stories</h2>
	<p>
		Korean folktales are as old and as strange as any in the world, and outside Korea almost nobody
		knows them. A child in Ohio can name three European fairy tales before breakfast and has
		probably never met a tiger who is frightened of a dried persimmon. That gap is the whole reason
		this series exists.
	</p>
	<p>
		These tales are public domain — carried for centuries by people telling them, not by anyone
		owning them. There is no single correct version of any of them. We keep the beats Korean tellers
		keep, cut what a four-year-old cannot hold, and never flatten a story into a lesson.
	</p>

	<h2>How the books are made</h2>
	<p>
		The text of every story is written and rewritten by hand, read aloud, and revised until it works
		spoken. The illustrations are generated with AI image tools against a fixed style guide and
		character sheets, then selected, corrected, and composed by a person — often across many
		rejected attempts per page. The same disclosure is filed with our retailers.
	</p>
	<p>
		We say this plainly because a parent choosing a children's book deserves to know how it was
		made.
	</p>

	<h2>Reading them free</h2>
	<p>
		Every story on this site is complete and free to read. That is deliberate: a folktale that
		nobody can read is not doing its job. The books exist for the illustrations and for the reading
		experience — the kind of book that ends up on the floor beside a bed.
	</p>

	<h2>Contact</h2>
	<p>
		Questions, corrections, or a Korean version you grew up with that differs from ours — we would
		genuinely like to hear it. <a href="mailto:{site.email}">{site.email}</a>
	</p>
	<p class="meta">
		{site.publisher} is part of <a href="https://www.seorilabs.com/">Seori Labs</a>.
	</p>
</div>

<style>
	.crumbs {
		font-size: 0.9rem;
		color: var(--muted);
		margin: 1.5rem 0 1rem;
	}
</style>
