<script>
	import { Plus, Minus, Cookie, Meh, Smile, Frown } from "lucide-svelte";
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import { fly, fade } from "svelte/transition";

	let cookieCount = writable(0);
	let showCookie = false;
	let hideCookie = false;
	let smile = false;
	let sad = false;

	function addCookie() {
		$cookieCount++;
		showCookie = true;
	}

	function removeCookie() {
		if ($cookieCount > 0) {
			$cookieCount--;
			hideCookie = true;
		}
	}
</script>

<div class="flex justify-center items-center min-h-screen">
	<div class="flex flex-col justify-center">
		<div class="prose">
			<h1 class="text-center mb-5">Merry Munch-o-Meter</h1>
		</div>
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title flex items-center">
					<div>
						<Cookie />
					</div>
					{#if showCookie}
						<div
							class="absolute"
							in:fade={{ duration: 50 }}
							on:introstart={() => (smile = true)}
							on:introend={() => (showCookie = false)}
							on:outroend={() => (smile = false)}
							out:fly={{ x: 300, duration: 300 }}
						>
							<Cookie />
						</div>
					{/if}
					{#if hideCookie}
						<div
							class="absolute"
							in:fade={{ duration: 100 }}
							on:introstart={() => (sad = true)}
							on:introend={() => (hideCookie = false)}
							on:outroend={() => (sad = false)}
							out:fly={{ x: -50, duration: 200 }}
						>
							<Cookie />
						</div>
					{/if}
					<div class="ml-auto">
						<div out:fade={{ duration: 50 }}>
							{#if smile}
								<Smile />
							{:else if sad}
								<Frown />
							{:else}
								<Meh />
							{/if}
						</div>
					</div>
				</div>
				<div class="stat-value text-center">
					{$cookieCount}
				</div>
				<div class="flex justify-center space-x-5 stat-actions">
					<button class="btn btn-sm" on:click={removeCookie}>
						<Minus />
					</button>
					<button class="btn btn-sm btn-success" on:click={addCookie}>
						<Plus />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
