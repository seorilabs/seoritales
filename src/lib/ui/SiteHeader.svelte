<script lang="ts">
	import { series } from '$lib/tales/data';
</script>

<header>
	<div class="wrap bar">
		<a class="brand" href="/">Seori Tales</a>
		<nav>
			<a href="/for-parents-and-teachers/">For Parents &amp; Teachers</a>
			<a href="/about/">About</a>
		</nav>
	</div>
	<p class="wrap tag">{series.name}</p>
</header>

<style>
	header {
		border-bottom: 1px solid var(--line);
		padding: 1rem 0 0.75rem;
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		align-items: baseline;
		justify-content: space-between;
	}
	.brand {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--brown);
		text-decoration: none;
	}
	nav {
		display: flex;
		gap: 1.25rem;
		font-size: 0.95rem;
	}
	.tag {
		margin: 0.35rem auto 0;
		font-size: 0.85rem;
		color: var(--muted);
		font-style: italic;
	}
</style>
