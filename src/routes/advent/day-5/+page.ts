import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch(`https://advent.sveltesociety.dev/data/2023/day-five.json`);
    const records = await response.json();

    return {
        records: records,
    };
}