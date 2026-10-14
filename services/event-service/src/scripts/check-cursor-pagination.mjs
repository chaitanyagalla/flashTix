const baseUrl = "http://localhost:4002/events";
let totalEvents = 0;
let cursor = null;
let pageCount = 0;

const seenIds = new Set();

while(true) {
    const url = new URL(baseUrl);
    url.searchParams.set("limit", 50);

    if (cursor) {
        url.searchParams.set("cursor", cursor);
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`http ${response.status}`)
    }
    const result = await response.json()
    pageCount++;

    for (const event of result.data) {
        if (seenIds.has(event.id)) {
            throw new Error(`Duplicate event found: ${event.id}`)
        }
        seenIds.add(event.id);
        totalEvents++
    }

    console.log(`page ${pageCount}: ${result.data.length} events`);

    if (!result.pagination.hasNextPage) {
        break;
    }

    const nextCursor = result.pagination.nextCursor;
    if (!nextCursor || nextCursor === cursor) {
        throw new Error("Invalid or repeated cursor")
    }
    cursor = nextCursor;
}

console.log("-------- RESULTS --------");
console.log("Total pages:", pageCount);
console.log("Unique events:", seenIds.size);
console.log("Total events:", totalEvents);
console.log("No duplicates found!");