<script lang="ts">
	// Components
	import DataTableActions from "./DataTableActions.svelte";
	import DataTableForm from "./DataTableForm.svelte";
	import Modal from "./Modal.svelte";
	import PlusButton from "./PlusButton.svelte";
	import DataTable from "./DataTable.svelte";
	import Pagination from "./Pagination.svelte";

	// Headless Table
	import { createTable, createRender } from "svelte-headless-table";
	import { addPagination } from "svelte-headless-table/plugins";

	// Super Forms
	import {superForm} from "sveltekit-superforms/client";
	import type { SuperValidated } from "sveltekit-superforms";

	// Svelte
	import { type Writable } from "svelte/store";

	// libs
	import { formSchema } from "$lib/schema";
	import type { ElfTallyRecord } from "$lib/types";


	// Exports
	export let records: Writable<ElfTallyRecord[]>;
	export let form: SuperValidated<typeof formSchema>;

	// Variables
	// https://svelte-headless-table.bryanmylee.com/docs/api/create-table
	// https://learn.svelte.dev/tutorial/writable-stores
	const pageSize: number = 10;
	// controls to show the modal or not
	let showModal = false;

	// Create the table instance from the records.
	const table = createTable(records, {
		page: addPagination({ initialPageSize: pageSize })
	});
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
							}
						}
					});
			}
		})
	]);
	// The table view model is a reactive object that contains all the information needed to render the table.
	// It returns 4 readable stores
	const tableView = table.createViewModel(columns);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = tableView;
	// state stores that are used in the pagination control
	// const { pageCount, hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { pageIndex } = pluginStates.page;

	// Create the form instance to render the form inside the modal.
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

</script>

<Modal bind:showModal>
	<DataTableForm form={myForm} />
</Modal>
<div class="rounded-md border">
	<div class="overflow-x-auto">
		<DataTable {tableView}></DataTable>
	</div>
	<div class="flex items-center justify-center space-x-2 py-4 m-2">
		<Pagination {records} {pageIndex} {pageSize} />
	</div>
</div>
