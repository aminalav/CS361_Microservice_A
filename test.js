import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:2824';

// First Test: Total hours for assignment ai
async function testTotalHours() {
    const url = `${BASE_URL}/hours/ai`;
    console.log(`\n[Test] Sending request to ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('[Test] Response:', data);
    } catch (error) {
        console.error('[Test] Error fetching total hours:', error);
    }
}

// Second Test: Total hours for assignment ai between 2024-04-01 and 2024-04-03
async function testHoursInRange() {
    const url = `${BASE_URL}/hours/ai/range?start=2024-04-01&end=2024-04-03`;
    console.log(`\n[Test] Sending request to ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('[Test] Response:', data);
    } catch (error) {
        console.error('[Test] Error fetching ranged hours:', error);
    }
}

// Run both tests
async function runTests() {
    console.log('[Test] Starting test program...');
    await testTotalHours();
    await testHoursInRange();
    console.log('[Test] Test program finished.');
}

runTests();