<script lang="ts">
	import type { PageData } from "./$types";
    import type {Task} from "$lib/types";

    export let data: PageData

    let records: Task[] = data.records;

</script>

<ul>
    {#each records as record}
        <li>{record.date}</li>
    {/each}
</ul>

