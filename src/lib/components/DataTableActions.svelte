<script lang="ts">
	import { MoreHorizontal } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
	export let name = "";
    let hidden = true;

	function deleteRecord(evh: MouseEvent) {
		dispatch("deleteRecord", { name: name });
        hidden = true;
	}

	function editRecord(evh: MouseEvent) {
		dispatch("editRecord", { name: name });
        hidden = true;
	}

    function onClick(evh: MouseEvent) {
        hidden = false;
    }
</script>

<div class="dropdown dropdown-end">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div tabindex="0" role="button" class="m-1" on:click={onClick}>
        <MoreHorizontal class="w-4 h-4" />
    </div>
	<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52" class:hidden={hidden}>
		<li><button on:click={editRecord}>Edit</li>
		<li><button on:click={deleteRecord}>Delete</li>
	</ul>
</div>
