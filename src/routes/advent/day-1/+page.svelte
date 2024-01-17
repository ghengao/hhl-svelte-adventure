<script lang="ts">
	import type { PageData } from "./$types";
	import DataTable from "$lib/components/ui-extended/data-table.svelte";
	import { formSchema } from "$lib/schema";
	import type { MaybePromise } from "sveltekit-superforms";
	import * as Form from "$lib/components/ui/form";
	import { type FormOptions } from "formsnap";

	// Received data from the `+page.ts` universal load function
	export let data: PageData;
	const options: FormOptions<typeof formSchema> = {
		// Form some reason this is required when the schema defined a number field.
		// If this is not defined, the form will have an error: 'Expected number, received string'
		// related to https://github.com/ciscoheat/sveltekit-superforms/discussions/82
		validators: {
			tally: (value: number): MaybePromise<string | string[] | null | undefined> => {
				return;
			}
		}
	};
</script>

<!-- <SuperDebug data={form} /> -->
<div class="rounded-md border">
	<Form.Root {options} form={data.form} schema={formSchema} let:config>
		<Form.Field {config} name="name">
			<Form.Label>Name</Form.Label>
			<Form.Input></Form.Input>
			<Form.Validation />
		</Form.Field>
		<Form.Field {config} name="tally">
			<Form.Label>Tally</Form.Label>
			<Form.Input type="number"></Form.Input>
			<Form.Validation />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</Form.Root>
</div>

<div class="container mx-auto py-10">
	<!-- Generating the table using the data table component from data-table.svelte -->
	<!-- Passing the records to the data table component -->
	<DataTable records={data.elfTallyRecords} />
</div>
