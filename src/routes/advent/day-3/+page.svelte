<script lang="ts">
	import { persistable } from "$lib/helpers";
	import { onMount } from "svelte";
	import { writable, type Writable } from "svelte/store";

	type Weights = {
		name: string;
		weight: number;
	};

	let weights: Writable<Weights[]> = persistable<Weights[]>("sleighWeights", []);

	type Trip = {
		totalWeight: number;
		weights: Weights[];
	};

	// trips maintains the state of computed trips from the weights data.
	let trips = persistable<Trip[]>("sleighTrips", []);

    async function fetchData() {
        if ($weights.length === 0) {
            console.log("fetching weights");
            let res = await fetch("https://advent.sveltesociety.dev/data/2023/day-three.json")
            let data = await res.json()
            $weights = data;
            designTrips(data);
        }
    }

    // function to trigger to fetch and reset the data
    async function reset() {
        $weights = [];
        await fetchData();
    }

	// Adding trip to the trips store
	function addTripWeight(idx: number, weight: Weights): boolean {
		let t = $trips;
		t[idx].weights.push(weight);
		t[idx].totalWeight += weight.weight;
		$trips = t;
		return true;
	}

	// Removing trip from the trips store
	function removeTripWeight(idx: number, name: string) {
		let t = $trips;
		for (let i = 0; i < t[idx].weights.length; i++) {
			if (t[idx].weights[i].name === name) {
				t[idx].totalWeight -= t[idx].weights[i].weight;
				t[idx].weights.splice(i, 1);
				if (t[idx].weights.length === 0) {
					t.splice(idx, 1);
				}
				break;
			}
		}
		$trips = t;
	}

	// Iterating over the weights data and distribute these weights into trips
	function designTrips(weights: Weights[], maxWeights: number = 100) {
		let designedTrips: Trip[] = [];
		let trip: Trip = { totalWeight: 0, weights: [] };
		let weightIndex = 0;
		while (weightIndex < weights.length) {
			if (trip.totalWeight + weights[weightIndex].weight > maxWeights) {
				designedTrips.push(trip);
				trip = { totalWeight: 0, weights: [] };
			}
			trip.weights.push(weights[weightIndex]);
			trip.totalWeight += weights[weightIndex].weight;
			weightIndex++;
		}
		if (trip.weights.length > 0) {
			designedTrips.push(trip);
		}
		$trips = designedTrips;
	}

	// drag over index is dynamic variable to indicate the index of the card that is being dragged over to control the border style of the card that is currently being dragged over.
	let dragOverIndex: number | null = null;

	// store the dragged data into the following store
	type DraggedData = {
		idx: number;
		name: string;
		weights: Weights;
	};

	let draggedData: Writable<DraggedData | null> = writable<DraggedData | null>(null);
</script>

{#await fetchData()}
Loading...
{:then _ }
<div class="flex justify-center items-center min-h-screen">
	<div class="flex flex-col justify-center items-center">
		<div class="prose">
			<h1 class="text-center mb-5">Merry Munch-o-Meter</h1>
		</div>
		<div class="flex justify-evenly">
			{#each $trips as trip, idx}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="flex flex-col card shadow-xl">
					<div
						class="card-body"
						class:border-2={$draggedData !== null}
						class:border-dashed={$draggedData !== null && dragOverIndex !== idx}
						class:border-accent={$draggedData !== null}
						class:opacity-30={$draggedData !== null &&
							$draggedData.weights.weight + trip.totalWeight > 100}
						on:dragover={(ev) => {
							// When drag over, set the drag over index to the current index so that the drag target can be highlighted.
							// Also make sure that it is droppable if the total weight of the dragged data and the current trip is less than 100.
							if ($draggedData !== null && $draggedData.weights.weight + trip.totalWeight <= 100) {
								ev.preventDefault();
								dragOverIndex = idx;
							}
						}}
						on:drop={(ev) => {
							// When start the drag, set the dragged data to the current data.
							ev.preventDefault();
							if ($draggedData !== null) {
								addTripWeight(idx, $draggedData.weights);
								removeTripWeight($draggedData.idx, $draggedData.name);
								$draggedData = null;
							}
						}}
					>
						<figure
							class="card-title center w-full font-extrabold bg-violet-500 text-xl text-stone-100"
						>
							Trip {trip.totalWeight.toFixed(2)}
						</figure>
						{#each trip.weights as weight}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								class="join join-vertical lg:join-horizontal"
								draggable="true"
								on:dragstart={(ev) => {
									$draggedData = { name: weight.name, weights: weight, idx: idx };
									if (ev.dataTransfer) {
										ev.dataTransfer.effectAllowed = "move";
									}
								}}
								on:dragend={() => {
									$draggedData = null;
									dragOverIndex = null;
								}}
							>
								<div class="badge badge-lg badge-accent join-item">{weight.name}</div>
								<div class="badge badge-lg join-item">{weight.weight}</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<button class="btn btn-primary btn-lg mt-5 pl-20 pr-20" on:click={reset}> Reset </button>
	</div>
</div>
{/await}
