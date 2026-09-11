<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { organizationSchema, seriesListSchema, webSiteSchema } from '$lib/seo/jsonld';
	import { bookPath, coverPath, readAloudMinutes, storyPath, tales } from '$lib/tales/data';
	import { teachingNotes } from '$lib/tales/teaching';
</script>

<Seo
	title="Korean Folktales for Children — Read All Seven Free | Seori Tales"
	description="Seven classic Korean folktales retold in read-aloud English for ages 4–8. Read every story free, with notes on where each tale comes from."
	path="/"
	jsonLd={[organizationSchema(), webSiteSchema(), seriesListSchema(tales)]}
/>

<h1>Korean folktales for children</h1>
<p class="lede">
	Tales of brave sisters, clever rabbits and very silly tigers — told in Korea for hundreds of
	years, retold here in read-aloud English for ages 4–8.
</p>

<div class="prose">
	<p>
		There are seven stories below and every one of them is free to read in full. No sign-up, nothing
		held back for a newsletter. Each comes with a note on where the tale comes from, the Korean
		words inside it, and roughly how long it takes to read out loud.
	</p>
	<p>
		A child in Ohio can name three European fairy tales before breakfast and has probably never met
		a tiger who is frightened of a dried persimmon. These stories are as old and as strange as any
		in the world, and outside Korea almost nobody knows them. That is the gap this site exists to
		close.
	</p>
	<p>
		If you are choosing for a classroom or a specific age, the
		<a href="/for-parents-and-teachers/">parents and teachers guide</a> sorts all seven by theme and length,
		with discussion questions.
	</p>
</div>

<h2>All seven stories</h2>

<ol class="list">
	{#each tales as tale (tale.slug)}
		<li>
			<a class="thumb" href={storyPath(tale)} aria-hidden="true" tabindex="-1">
				<img
					src={coverPath(tale)}
					alt=""
					width="800"
					height="1280"
					loading={tale.number > 2 ? 'lazy' : 'eager'}
				/>
			</a>
			<div>
				<h3><a href={storyPath(tale)}>{tale.title}</a></h3>
				<p class="sub">
					{tale.koreanTitle} · ages {tale.ageRange} · about {readAloudMinutes(tale)} minutes to read aloud
				</p>
				<p>{teachingNotes[tale.slug].pick}</p>
				<p class="links">
					<a href={storyPath(tale)}>Read it free</a> ·
					<a href={bookPath(tale)}>The picture book</a>
				</p>
			</div>
		</li>
	{/each}
</ol>

<div class="prose">
	<h2>What makes a Korean folktale different</h2>
	<p>
		They were carried by grandparents, not by books. That shows: they move fast, they repeat their
		best lines so a listener can join in, and they end on a turn a small child can feel coming. Most
		take under ten minutes to read aloud, which is not an accident — it is roughly how long a child
		will sit still after dinner.
	</p>
	<p>
		They are also less tidy than the fairy tales most English-speaking children grow up with. Nobody
		is purely wicked, rewards are odd and specific — a gourd full of treasure, a rope let down from
		the sky — and several of them end without anyone getting married. The tiger is usually the
		villain, and he is usually a bit of an idiot.
	</p>
	<p>
		Several will feel familiar anyway. <a href={storyPath(tales[4])}>Kongjwi and the Flower Shoe</a>
		is Cinderella with a black ox and a helpful toad.
		<a href={storyPath(tales[5])}>The Golden Axe</a> tests an honest man the way Aesop does. That overlap
		is the best part to talk about: two countries, the same worry, a different animal.
	</p>

	<h2>How these retellings are made</h2>
	<p>
		Every tale here is public domain, told for centuries before anyone wrote it down. There is no
		single correct version of any of them — the one your Korean neighbour grew up with may differ
		from ours in its details. We keep the beats Korean tellers keep, cut what a four-year-old cannot
		hold, and never flatten a story into a lesson.
	</p>
	<p>
		Nothing is sanitised into mush, and nothing is made scarier than a bedtime allows. Folktales put
		danger in on purpose and then resolve it; a tiger that is never frightening is not worth
		escaping. More on how the books are put together is on the <a href="/about/">about page</a>.
	</p>
</div>

<style>
	.list {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 0;
	}
	.list li {
		display: grid;
		grid-template-columns: 9rem minmax(0, 1fr);
		gap: 1.5rem;
		padding: 1.75rem 0;
		border-top: 1px solid var(--line);
		align-items: start;
	}
	.thumb img {
		border-radius: 0.4rem;
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.18);
		width: 100%;
	}
	.list h3 {
		margin: 0 0 0.2rem;
		font-size: 1.3rem;
	}
	.list h3 a {
		text-decoration: none;
	}
	.list p {
		margin: 0 0 0.6rem;
		max-width: var(--measure);
	}
	.sub {
		font-size: 0.92rem;
		color: var(--muted);
		font-style: italic;
	}
	.links {
		font-size: 0.95rem;
		margin-bottom: 0;
	}
	@media (max-width: 34rem) {
		.list li {
			grid-template-columns: 5.5rem minmax(0, 1fr);
			gap: 1rem;
		}
	}
</style>
