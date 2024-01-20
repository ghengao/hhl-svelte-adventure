<script lang="ts">
	import { type TableViewModel } from "svelte-headless-table";
	import { Render, Subscribe } from "svelte-headless-table";

	export let tableView: TableViewModel<any, any>;

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = tableView;

	// https://svelte.dev/docs#bind_element_property
	// https://svelte.dev/docs#bind_this
</script>

<table class="table table-sm" {...$tableAttrs}>
	<!-- head -->
	<thead>
		{#each $headerRows as headerRow (headerRow.id)}
			<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
				<tr {...rowAttrs}>
					{#each headerRow.cells as cell, idx (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
							<th class={idx === headerRow.cells.length - 1 ? "w-20" : ""} {...attrs}>
								<Render of={cell.render()} />
							</th>
						</Subscribe>
					{/each}
				</tr>
			</Subscribe>
		{/each}
	</thead>
	<tbody {...$tableBodyAttrs}>
		{#each $pageRows as row (row.id)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
				<tr {...rowAttrs} class="hover">
					{#each row.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs>
							<td {...attrs}>
								<Render of={cell.render()} />
							</td>
						</Subscribe>
					{/each}
				</tr>
			</Subscribe>
		{/each}
	</tbody>
</table>
