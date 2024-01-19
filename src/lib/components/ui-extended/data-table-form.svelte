<script lang="ts">
	import { formSchema } from "$lib/schema";
	import { enhance } from "$app/forms";
	import { type SuperForm } from "sveltekit-superforms/client";

	export let form: SuperForm<typeof formSchema>;

	let { form: formData, errors, constraints } = form;
</script>

<form method="POST" use:enhance>
	<!-- Name Label -->
	<div class="label">
		<span class="label-text">Name:</span>
	</div>
	<!-- Name Input -->
	<input
		class="input input-bordered input-sm w-full max-w-sm"
		type="text"
		name="name"
		placeholder="Name"
		aria-invalid={$errors.name ? "true" : undefined}
		{...$constraints.name}
		bind:value={$formData.name}
	/>
	<!-- Name Error -->
	{#if $errors.name}
		<div role="alert" class="alert alert-error max-w-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{$errors.tally}</span>
		</div>
	{/if}
	<!-- Tally Label -->
	<div class="label">
		<span class="label-text">Tally:</span>
	</div>
	<!-- Tally Input -->
	<input
		class="input input-bordered input-sm w-full max-w-sm"
		type="number"
		name="tally"
		bind:value={$formData.tally}
	/>
	<!-- Tally Error -->
	{#if $errors.tally}
		<div role="alert" class="alert alert-error mt-2 max-w-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{$errors.tally}</span>
		</div>
	{/if}
	<div class="mt-2">
		<button class="btn" type="submit">Submit</button>
	</div>
</form>
