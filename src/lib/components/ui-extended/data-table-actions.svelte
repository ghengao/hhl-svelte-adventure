<!-- https://www.shadcn-svelte.com/docs/components/data-table#row-actions -->
<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Button } from "$lib/components/ui/button";
	import { MoreHorizontal } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";
	import type { CustomEventHandler } from "bits-ui";

	const dispatch = createEventDispatcher();
	export let name = "";

	function deleteRecord(evh: CustomEventHandler<MouseEvent, HTMLDivElement>) {
		dispatch("deleteRecord", {name: name});
	}

	function editRecord(evh: CustomEventHandler<MouseEvent, HTMLDivElement>) {
		dispatch("editRecord", {name: name});
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative w-8 h-8 p-0">
			<MoreHorizontal class="w-4 h-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
            <DropdownMenu.Item on:click={editRecord}>Edit</DropdownMenu.Item>
            <DropdownMenu.Item on:click={deleteRecord}>Delete</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
