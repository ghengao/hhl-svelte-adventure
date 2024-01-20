import type { PageLoad } from "./$types";
import type { ElfTallyRecord } from "$lib/types";

/**
 * Fetch data from https://advent.sveltesociety.dev/data/2023/day-one.json and expose it to the client.
 * @param {any} {fetch}
 * @returns {any}
 */
export const load: PageLoad = async ({ fetch, data }) => {
	// Load the page data from https://advent.sveltesociety.dev/data/2023/day-one.json
	const response = await fetch(`https://advent.sveltesociety.dev/data/2023/day-one.json`);
	const records: ElfTallyRecord[] = await response.json();
    //
	// Exposing the records fetched to the client.
    // 1. If +page.ts is present, the data from `+page.server.ts` is passed to the client via the page load function.
    // 2. If +page.ts is not present, the data is passed directly from `+page.server.ts` to the +page.svelte via data prop.
    // 3. According to https://kit.svelte.dev/docs/load#$page-data, the +page.ts is called universal load function, it runs both on
    //    server and client. However, universal load functions run on the server during SSR when the user first visits your page.
    //    They will then run again during hydration, reusing any responses from fetch requests. All subsequent invocations of universal load functions happen in the browser.
    // 4. When fetch data from database or filesystem data access that need private environment variables use `+page.server.ts`.
    // 5. When fetch data from public API or data cannot be serialized use `+page.ts`.
    // 6. Use both when need to fetch data from server but not want to directly pass the data to the client (e.g: doing some data processing or initialization etc).
    // 7. The exposed the data can also be accessed via `$page.data` however it is usually used when parent component wants to access the data from the child component.
	return {
        elfTallyRecords: records,
        form: data.form,
	};
};