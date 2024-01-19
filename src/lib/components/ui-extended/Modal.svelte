<script lang="ts">
	export let showModal = false;
	let dialog: HTMLDialogElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<!-- https://svelte.dev/examples/modal -->
<dialog
    aria-modal="true"
	class="modal"
	open={showModal}
    class:modal-open={showModal}
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div class="modal-box">
		<form method="dialog">
            <!-- svelte-ignore a11y-autofocus -->
			<button autofocus class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<slot />
	</div>
</dialog>