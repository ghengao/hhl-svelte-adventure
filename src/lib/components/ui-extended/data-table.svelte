<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import * as Table from "$lib/components/ui/table";
	import { readable } from "svelte/store";
	import DataTableActions from "./data-table-actions.svelte";

	import type { ElfTallyRecord } from "$lib/types";
	export let records: ElfTallyRecord[] = [];

	// https://svelte-headless-table.bryanmylee.com/docs/api/create-table
	// https://learn.svelte.dev/tutorial/writable-stores
	const table = createTable(readable(records));

	const columns = table.createColumns([
		table.column({ accessor: "name", header: "Name" }),
		table.column({ accessor: "tally", header: "Tally" }),
		table.column({ accessor: ({ tally }) => (tally > 0 ? "Nice" : "Naughty"), header: "Tag" }),
		table.column({
			accessor: ({ name }) => "",
			header: "",
			cell: ({ value }) => createRender(DataTableActions)
		})
	]);

	// The table view model is a reactive object that contains all the information needed to render the table.
	// It returns 4 readable stores
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);

	// Uncomment this to check the console of what cell.render() returns, it just returns the string of the cell value
	// In this case it is ["Name", "Tally", "Tag"]
	// for (const row of $headerRows) {
	// 	for (const cell of row.cells) {
	// 		console.log(cell);
	// 	}
	// }

</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			<!-- The reason that this headerRow adds a dollar sign is because the headerRow is a readable store and use the dollar sign to access its value -->
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell, idx (cell.id)}
							<!-- The let key allows this component to access the Subscribe component `attrs` values used in the Table.Head -->
							<!-- Subscribe is based on  -->
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<!-- Styling the last column to the minimum width -->
								<Table.Head class={idx === headerRow.cells.length - 1 ? "w-10" : ""} {...attrs}>
									<!-- cell is the HeaderCell component calling render will return a RenderConfig instance -->
									<!-- RenderConfig is passing to Render component to render-->
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>