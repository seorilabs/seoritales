<script lang="ts">
	import { site } from '$lib/site';
	import { series } from '$lib/tales/data';
</script>

<footer>
	<div class="wrap">
		<p>
			{series.name}. Published by {site.publisher}.
		</p>
		<p class="fine">
			These stories are retellings of traditional Korean folktales in the public domain. Text and
			illustrations &copy; 2026 {site.publisher}. Questions?
			<a href="mailto:{site.email}">{site.email}</a>
		</p>
		<p class="fine"><a href="https://www.seorilabs.com/">Seori Labs</a></p>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--line);
		margin-top: 4rem;
		padding: 1.5rem 0 3rem;
		font-size: 0.9rem;
		color: var(--muted);
	}
	p {
		margin: 0 0 0.4rem;
	}
	.fine {
		font-size: 0.82rem;
	}
</style>
