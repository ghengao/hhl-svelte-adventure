<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-table-actions.svelte";
	import DataTablePagination from "./data-table-pagination.svelte";
	import DataTableForm from "./data-table-form.svelte";
	import { addPagination } from "svelte-headless-table/plugins";

	// import { Button } from "$lib/components/ui/button";
	import * as Pagination from "$lib/components/ui/pagination";

	import type { ElfTallyRecord } from "$lib/types";
	import { writable, type Writable } from "svelte/store";
	import { formSchema } from "$lib/schema";
	import {
		superForm,
		superValidate,
		superValidateSync,
		stringProxy
	} from "sveltekit-superforms/client";
	import type { MaybePromise, SuperValidated } from "sveltekit-superforms";
	import Modal from "./Modal.svelte";
	import PlusButton from "./PlusButton.svelte";

	export let records: Writable<ElfTallyRecord[]>;
	export let form: SuperValidated<typeof formSchema>;

	let showModal = false;

	// https://svelte-headless-table.bryanmylee.com/docs/api/create-table
	// https://learn.svelte.dev/tutorial/writable-stores
	const pageSize: number = 10;
	const table = createTable(records, {
		page: addPagination({ initialPageSize: pageSize })
	});

	let myForm = superForm(form, {
		resetForm: true,
		// https://superforms.rocks/concepts/events#onupdate
		// onUpdated is triggered after form is updated.
		// Here we only need to validate the form from the client side as we are not really using a database
		// to store the data, no need for server side validation or handling.
		// https://superforms.rocks/get-started/#displaying-the-form
		onUpdated: ({ form }) => {
			if (form.valid) {
				let add = true;
				let newRecords: ElfTallyRecord[] = [];
				for (const record of $records) {
					if (record.name === form.data.name) {
						record.tally = form.data.tally;
						add = false;
					}
					newRecords.push(record);
				}
				if (add) {
					newRecords.unshift(form.data);
				}
				// Reset the form after the form is submitted.
				$records = newRecords;

				// Close the modal if the everything works fine.
				showModal = false;
			}
		}
	});

	let { form: formData } = myForm;

	const columns = table.createColumns([
		table.column({ accessor: "name", header: "Name" }),
		table.column({ accessor: "tally", header: "Tally" }),
		table.column({ accessor: ({ tally }) => (tally > 0 ? "Nice" : "Naughty"), header: "Tag" }),
		table.column({
			accessor: ({ name }) => name,
			header: (cell, state) => {
				return createRender(PlusButton, {
					"class": "btn btn-sm"
				}).on("click", (ev) => {
					// Reset the form before opening the modal.
					myForm.reset();
					// Open the modal to add a new record.
					showModal = true;
				});
				// return "";
			},
			cell: ({ value, state }) => {
				// Catch the custom event from the DataTableActions component to delete the record.
				return createRender(DataTableActions, { name: value })
					.on("deleteRecord", (ev) => {
						// Deleting the record from the records store.
						$records = $records.filter((record) => record.name !== ev.detail.name);
					})
					.on("editRecord", (ev) => {
						for (const record of $records) {
							if (record.name === ev.detail.name) {
								// form = superValidateSync(record, formSchema);
								// console.log(ev)
								$formData = record;
								// Open the modal to edit the record.
								showModal = true;
								console.log(showModal);
							}
						}
					});
			}
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
</script>

<div class="rounded-md border">
	<Modal bind:showModal>
		<DataTableForm form={myForm} />
	</Modal>
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
	<div class="flex items-center justify-end space-x-2 py-4 m-2">
		<DataTablePagination {records} {pageIndex} {pageSize} />
	</div>
</div>
