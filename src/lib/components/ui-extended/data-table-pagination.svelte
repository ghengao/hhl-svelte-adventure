
<script lang="ts">
	import * as Pagination from "$lib/components/ui/pagination";
	import { type Writable } from "svelte/store";

	export let records: Writable<any[]>;
	export let pageSize: number = 10;
    export let pageIndex: Writable<number>;


</script>

<!-- Pagination Control (Example from https://www.shadcn-svelte.com/docs/components/data-table) -->
<!-- <div class="flex items-center justify-end space-x-2 py-4 mr-2">
    <Button
        variant="outline"
        size="sm"
        on:click={() => ($pageIndex = $pageIndex - 1)}
        disabled={!$hasPreviousPage}>Previous</Button
    >
    <Button
        variant="outline"
        size="sm"
        disabled={!$hasNextPage}
        on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
    >
</div> -->
<!-- Pagination Control (Example from https://www.shadcn-svelte.com/docs/components/pagination) -->
<Pagination.Root count={$records.length} perPage={pageSize} let:pages let:currentPage>
    <Pagination.Content>
        <Pagination.Item>
            <Pagination.PrevButton on:click={() => ($pageIndex = $pageIndex - 1)}>
                <span class="hidden sm:block">Previous</span>
            </Pagination.PrevButton>
        </Pagination.Item>
        {#each pages as page (page.key)}
            {#if page.type === "ellipsis"}
                <Pagination.Item>
                    <Pagination.Ellipsis />
                </Pagination.Item>
            {:else}
                <Pagination.Item>
                    <Pagination.Link {page} isActive={currentPage == page.value} on:click={() => ($pageIndex = page.value)}>
                        {page.value}
                    </Pagination.Link>
                </Pagination.Item>
            {/if}
        {/each}
        <Pagination.Item>
            <Pagination.NextButton on:click={() => ($pageIndex = $pageIndex + 1)}>
                <span class="hidden sm:block">Next</span>
            </Pagination.NextButton>
        </Pagination.Item>
    </Pagination.Content>
</Pagination.Root>