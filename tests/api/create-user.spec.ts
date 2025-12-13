import { test, expect } from '@playwright/test';

test('POST create user returns created user data', async ({ request }) => {
    // 1️⃣ Define request payload (this is the data we send)
    const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        email: 'john.doe@test.com'
    };

    // 2️⃣ Send POST request
    const response = await request.post('https://dummyjson.com/users/add', {
        data: newUser
    });

    // 3️⃣ Assert status code
    expect(response.status()).toBe(201);

    // 4️⃣ Parse response body
    const body = await response.json();

    // 5️⃣ Log response (learning/debugging)
    console.log('CREATE USER RESPONSE:', body);

    // 6️⃣ Assert response contains expected data
    expect(body).toHaveProperty('id');
    expect(body.firstName).toBe(newUser.firstName);
    expect(body.lastName).toBe(newUser.lastName);
    expect(body.email).toBe(newUser.email);
});
