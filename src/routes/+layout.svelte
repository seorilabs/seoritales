<script lang="ts">
	import '../app.css';
	import SiteFooter from '$lib/ui/SiteFooter.svelte';
	import SiteHeader from '$lib/ui/SiteHeader.svelte';

	let { children } = $props();
</script>

<SiteHeader />
<main class="wrap">{@render children()}</main>
<SiteFooter />
