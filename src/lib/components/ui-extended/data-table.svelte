<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-table-actions.svelte";
	import { addPagination } from "svelte-headless-table/plugins";

	// import { Button } from "$lib/components/ui/button";
	import * as Pagination from "$lib/components/ui/pagination";

	import type { ElfTallyRecord } from "$lib/types";
	import { persistable } from "$lib/helpers";

	export let records: ElfTallyRecord[] = [];

	// Create a persistent store to store the data into the localStorage.
	let elfTallyRecords = persistable<ElfTallyRecord[]>("elfTallyRecords", []);

	if ($elfTallyRecords.length === 0) {
		$elfTallyRecords = records;
	}

	// https://svelte-headless-table.bryanmylee.com/docs/api/create-table
	// https://learn.svelte.dev/tutorial/writable-stores
	const pageSize: number = 10;
	const table = createTable(elfTallyRecords, {
		page: addPagination({ initialPageSize: pageSize })
	});

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
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	// state stores that are used in the pagination control
	// const { pageCount, hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { pageIndex } = pluginStates.page;

	// Uncomment this to check the console of what cell.render() returns, it just returns the string of the cell value
	// In this case it is ["Name", "Tally", "Tag"]
	// for (const row of $headerRows) {
	// 	for (const cell of row.cells) {
	// 		console.log(cell);
	// 	}
	// }

	/**
	 * Add a elf tally record to the table.
	 */
	function addRecord(name: string, tally: number) {
		// check if the name already exists in the table.
		if ($elfTallyRecords.some((record) => record.name === name)) {
			alert(`The name ${name} already exists in the table.`);
			return;
		}

		// Add the new record to the head of the table so that it is displayed first.
		$elfTallyRecords = [{ name, tally }, ...$elfTallyRecords];
	}

	// Here we only need to validate the form from the client side as we are not really using a database
	// to store the data, no need for server side validation or handling.
	// https://superforms.rocks/get-started/#displaying-the-form
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
								<Table.Head class={idx === headerRow.cells.length - 1 ? "w-20" : ""} {...attrs}>
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
	<!-- Pagination Control (Example from https://www.shadcn-svelte.com/docs/components/data-table) -->
	<!-- <div class="flex items-center justify-end space-x-2 py-4 mr-2">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div> -->
	<!-- Pagination Control (Example from https://www.shadcn-svelte.com/docs/components/pagination) -->
	<div class="flex items-center justify-end space-x-2 py-4 m-2">
		<Pagination.Root count={$elfTallyRecords.length} perPage={pageSize} let:pages let:currentPage>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton on:click={() => ($pageIndex = $pageIndex - 1)}>
						<span class="hidden sm:block">Previous</span>
					</Pagination.PrevButton>
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === "ellipsis"}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage == page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton on:click={() => ($pageIndex = $pageIndex + 1)}>
						<span class="hidden sm:block">Next</span>
					</Pagination.NextButton>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</div>
</div>
