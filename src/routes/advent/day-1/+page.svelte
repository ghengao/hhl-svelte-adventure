<script lang="ts">
	import type { PageData } from "./$types";
	import DataTable from "$lib/components/ui-extended/data-table.svelte";
	import { persistable } from "$lib/helpers";
	import type { ElfTallyRecord } from "$lib/types";

	// Received data from the `+page.ts` universal load function
	export let data: PageData;

	// Create a persistent store to store the data into the localStorage.
	let elfTallyRecords = persistable<ElfTallyRecord[]>("elfTallyRecords", []);

	if ($elfTallyRecords.length === 0 ) {
		$elfTallyRecords = data.elfTallyRecords;
	}
</script>

<div class="container mx-auto py-10">
	<!-- Generating the table using the data table component from data-table.svelte -->
	<!-- Passing the records to the data table component -->
	<DataTable records={elfTallyRecords} form={data.form} />
</div>
