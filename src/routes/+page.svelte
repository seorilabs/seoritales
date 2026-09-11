<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { organizationSchema, seriesListSchema, webSiteSchema } from '$lib/seo/jsonld';
	import { bookPath, coverPath, readAloudMinutes, series, storyPath, tales } from '$lib/tales/data';

	const description =
		'Seven classic Korean folktales retold in warm, read-aloud English for children ages 4–8. ' +
		'Read every story free, then find the illustrated picture book.';
</script>

<Seo
	title="Korean Folktales for Children — Read Free | Seori Tales"
	{description}
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
		Every story on this site is free to read in full. Each one comes with a note on where the tale
		comes from, the Korean words inside it, and how long it takes to read aloud. If your child asks
		for it again — and they will — each story is also an illustrated picture book.
	</p>
</div>

<h2>The stories</h2>
<ul class="grid">
	{#each tales as tale (tale.slug)}
		<li class="card">
			<a href={storyPath(tale)}>
				<img
					src={coverPath(tale)}
					alt="Cover of {tale.title}, {tale.subtitle}"
					width="800"
					height="1280"
					loading={tale.number > 3 ? 'lazy' : 'eager'}
				/>
				<h3>{tale.title}</h3>
				<p>{tale.koreanTitle} · {readAloudMinutes(tale)} min read-aloud</p>
			</a>
		</li>
	{/each}
</ul>

<div class="prose">
	<h2>Where these stories come from</h2>
	<p>
		Korean folktales were carried by grandparents, not books. They were told at bedtime, on long
		walks, and over rice cakes — which is why they are short, funny, and a little frightening in
		exactly the right places.
	</p>
	<p>
		We keep the bones of each tale intact and tell it in plain, warm English a four-year-old can
		follow and a grown-up will not mind reading for the twentieth time. Nothing is sanitised into
		mush, and nothing is made scarier than a bedtime allows.
	</p>
	<p>
		New to these stories? <a href="/for-parents-and-teachers/"
			>Start with the parents and teachers guide</a
		> — it lists every tale by age, length, and theme.
	</p>
</div>

<h2>The picture books</h2>
<div class="prose">
	<p>
		Each story is also a square, full-colour picture book for ages {tales[0].ageRange}. Browse them
		on the <a href={bookPath(tales[0])}>book pages</a>.
	</p>
</div>
