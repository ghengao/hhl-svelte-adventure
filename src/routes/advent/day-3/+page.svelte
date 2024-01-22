<script lang="ts">
	import { persistable } from "$lib/helpers";
	import { onMount } from "svelte";
	import { writable, type Writable } from "svelte/store";

	type Weights = {
		name: string;
		weight: number;
	};

	let weights: Writable<Weights[]> = persistable<Weights[]>("sleighWeights", []);
	onMount(() => {
		if ($weights.length === 0) {
			console.log("fetching weights");
			fetch("https://advent.sveltesociety.dev/data/2023/day-three.json")
				.then((res) => res.json())
				.then((data) => {
					$weights = data;
				});
		}
	});

	type Trip = {
		totalWeight: number;
		weights: Weights[];
	};

    // trips maintains the state of computed trips from the weights data.
    // TODO: Need a button to reset the trips data to restore the state.
    // TODO: Need a way to remove the trip if the trip is empty.
	// TODO: Add a button to trigger this, otherwise it will be called on every refresh and load the data from original data store.
	let trips = persistable<Trip[]>("sleighTrips", []);

	designTrips($weights);

    // Adding trip to the trips store
	function addTripWeight(idx: number, weight: Weights) {
		let t = $trips;
		t[idx].weights.push(weight);
		t[idx].totalWeight += weight.weight;
		$trips = t;
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

    // drag start is dynamic variable to indicate if the drag event is started to control the border style of all the card.
	let dragStart = false;

    // drag over index is dynamic variable to indicate the index of the card that is being dragged over to control the border style of the card that is currently being dragged over.
    let dragOverIndex = -1;
</script>

<div class="flex justify-evenly">
	{#each $trips as trip, idx}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="flex flex-col card bg-base-100 shadow-xl">
			<div
				class="card-body"
				class:border-2={dragStart}
				class:border-dashed={dragStart && dragOverIndex !== idx}
				class:border-accent={dragStart}
                class:border-opacity-20={dragStart}
				on:dragover={(ev) => {
					ev.preventDefault();
                    dragStart = true;
                    dragOverIndex = idx;
				}}
				on:drop={(ev) => {
					ev.preventDefault();
					if (ev.dataTransfer) {
						let data = JSON.parse(ev.dataTransfer.getData("text/json"));
						if (data) {
							removeTripWeight(data.idx, data.name);
							addTripWeight(idx, { name: data.name, weight: data.weight });
						}
					}
                    dragStart = false;
                    dragOverIndex = -1;
				}}
			>
				<h5 class="card-title">Trip {idx}, {trip.totalWeight.toFixed(2)}</h5>
				{#each trip.weights as weight}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="join join-vertical lg:join-horizontal"
						draggable="true"
						on:dragstart={(ev) => {
                            dragStart = true;
							if (ev.dataTransfer) {
								ev.dataTransfer.setData(
									"text/json",
									JSON.stringify({ name: weight.name, weight: weight.weight, idx: idx })
								);
							}
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
