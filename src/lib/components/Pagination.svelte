<script lang="ts">
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	export let records;
	export let pageSize: number;
	export let pageIndex;
</script>

<div class="join">
	<button
		class="join-item btn btn-sm"
		on:click={() => {
			if ($pageIndex >= 1) {
				$pageIndex = $pageIndex - 1;
			}
		}}
		disabled={$pageIndex === 0}
	>
		<ChevronLeft />
	</button>
	{#each Array(Math.ceil($records.length / pageSize)).keys() as idx (idx)}
		<button
			class="join-item btn btn-sm"
			on:click={() => {
				$pageIndex = idx;
			}}
			class:btn-active={$pageIndex === idx}>{idx + 1}</button
		>
	{/each}
	<button
		class="join-item btn btn-sm"
		on:click={() => {
			if (($pageIndex + 1) * pageSize < $records.length) {
				$pageIndex = $pageIndex + 1;
			}
		}}
		disabled={($pageIndex + 1) * pageSize >= $records.length}
	>
		<ChevronRight />
	</button>
</div>
