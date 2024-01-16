<script lang="ts">
	import type { PageData } from "./$types";
	import DataTable from "$lib/components/ui-extended/data-table.svelte";

    // Received data from the `+page.ts` universal load function
    export let data: PageData;
</script>

<div class="container mx-auto py-10">
    <!-- Generating the table using the data table component from data-table.svelte -->
    <!-- Passing the records to the data table component -->
	<DataTable bind:records={data.elfTallyRecords} />
</div>
