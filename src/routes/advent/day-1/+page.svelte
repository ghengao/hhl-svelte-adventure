<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/stores';

    export let data: PageData;
</script>

{#each data.elfTallyRecords as record}
    <div>
        <span>{record.name}</span>
        <span>{record.tally}</span>
    </div>
{/each}