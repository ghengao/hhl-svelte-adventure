<script lang="ts">
	import { persistable } from "$lib/helpers";
	import type { Writable } from "svelte/store";
	import { onMount } from "svelte";
	import { Chart } from "chart.js/auto";
	import type { ChartItem } from "chart.js/auto";

	type HeartRate = {
		id: number;
		heartRate: number;
	};

	let heartRates: Writable<HeartRate[]> = persistable<HeartRate[]>("heartRates", []);
	// let historySize = 86400; // seconds in a day
	let historySize = 100; // seconds in a day

	let latest = 0;
	let highest = 0;
	let lowest = -1;

	if ($heartRates.length > 0) {
		latest = $heartRates[$heartRates.length - 1].heartRate;
		highest = Math.max(...$heartRates.map((row) => row.heartRate));
		lowest = Math.min(...$heartRates.map((row) => row.heartRate));
	}

	async function fetchData() {
		console.log("fetching data");
		const res = await fetch("https://advent.sveltesociety.dev/data/2023/day-four.json");
		const data = await res.json();
		const hr = data.heartRate as number;
		if (hr > highest) {
			highest = hr;
		}
		if (hr < lowest || lowest === -1) {
			lowest = hr;
		}
		latest = hr;
		let newHearRate = { id: 0, heartRate: hr };

		if ($heartRates.length > 0) {
			newHearRate.id = $heartRates[$heartRates.length - 1].id + 1;
		}
		if ($heartRates.length >= historySize) {
			$heartRates = [...$heartRates.slice(1), newHearRate];
		} else {
			$heartRates = [...$heartRates, newHearRate];
		}
	}

	let started = false;

	// Run a infinite loop to fetch data
	async function loop() {
		if (!started) {
			return;
		}
		await fetchData();
		if (myChart) {
			myChart.data.labels = $heartRates.map((row) => row.id);
			myChart.data.datasets[0].data = $heartRates.map((row) => row.heartRate);
			myChart.update();
			console.log("updated chart");
		}
		setTimeout(loop, 1000);
	}

	// Controls the infinite loop to start
	function start() {
		started = true;
		loop();
	}

	// Controls the infinite loop to stop
	function stop() {
		started = false;
	}

	let myChart: Chart;

	onMount(async (): Promise<any> => {
		const data: HeartRate[] = $heartRates;
		const chartDom = document.getElementById("chart") as ChartItem;
		if (!chartDom) {
			return;
		}
		myChart = new Chart(chartDom, {
			type: "line",
			options: {
				plugins: {
					legend: {
						position: "bottom"
					}
				}
			},
			data: {
				labels: data.map((row) => row.heartRate),
				datasets: [
					{
						label: "Heartbeat",
						data: data.map((row) => row.heartRate)
					}
				]
			}
		});
	});
</script>

<div class="grid grid-rows-3 items-center min-h-screen">
	<div class="grid grid-cols-12">
		<div class="col-start-3 col-end-5 stats shadow">
			<div class="stat">
				<div class="stat-title">Lowest</div>
				<div class="stat-value">{lowest}</div>
				<div class="stat-desc">bpm</div>
			</div>
		</div>

		<div class="col-start-6 col-end-8 stats shadow">
			<div class="stat">
				<div class="stat-title">Latest</div>
				<div class="stat-value">{latest}</div>
				<div class="stat-desc">bpm</div>
			</div>
		</div>

		<div class="col-start-9 col-end-11 stats shadow">
			<div class="stat">
				<div class="stat-title">Highest</div>
				<div class="stat-value">{highest}</div>
				<div class="stat-desc">bpm</div>
			</div>
		</div>
	</div>
	<div class="grid grid-col-12">
		<div class="col-start-6 col-end-11 max-w-screen-sm max-h-screen-sm">
			<canvas id="chart"></canvas>
		</div>
	</div>
	<div class="grid grid-cols-12">
		{#if started}
			<button class="col-start-5 col-end-9 btn" on:click={stop}>Stop</button>
		{:else}
			<button class="col-start-5 col-end-9 btn btn-primary" on:click={start}>Start</button>
		{/if}
	</div>
</div>
