import { test, expect } from '@playwright/test';

test('GET users returns a list of users', async ({ request }) => {
    const response = await request.get('https://dummyjson.com/users');

    // Status code
    expect(response.status()).toBe(200);

    // Parse response
    const body = await response.json();

    console.log('API RESPONSE:', body);

    // Assertions
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBeTruthy();
    expect(body.users.length).toBeGreaterThan(0);

    // Check fields on first user
    expect(body.users[0]).toHaveProperty('id');
    expect(body.users[0]).toHaveProperty('email');
});
