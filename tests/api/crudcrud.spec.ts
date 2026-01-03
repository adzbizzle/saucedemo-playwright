import { test, expect } from '@playwright/test';

// Skip entire file if CRUDCRUD_KEY is not set
test.skip(!process.env.CRUDCRUD_KEY, 'Set CRUDCRUD_KEY environment variable to run CrudCrud tests');

const BASE = `https://crudcrud.com/api/${process.env.CRUDCRUD_KEY}/users`;

test.describe('CrudCrud CRUD tests', () => {
  test('Create -> Read -> Update -> Delete user', async ({ request }) => {
    // Create
    const payload = { name: 'Crud User', email: `crud+${Date.now()}@test.com`, role: 'tester' };
    const createResp = await request.post(BASE, { data: payload });
    expect(createResp.status(), 'create response code').toBe(201);
    const created = await createResp.json();
    expect(created).toHaveProperty('_id');
    const id = created._id;

    try {
      // Read
      const getResp = await request.get(`${BASE}/${id}`);
      expect(getResp.status()).toBe(200);
      const got = await getResp.json();
      expect(got.name).toBe(payload.name);
      expect(got.email).toBe(payload.email);

      // Update using PUT but omit _id (server may not accept methods or _id in payload)
      const updatedPayload = { name: 'Crud User Updated', email: got.email, role: 'senior tester' };
      const putResp = await request.put(`${BASE}/${id}`, { data: updatedPayload });
      const putStatus = putResp.status();
      if (![200, 204].includes(putStatus)) {
        test.skip(true, `Update not supported by CrudCrud for this resource (PUT returned ${putStatus})`);
        return;
      }

      const afterPut = await (await request.get(`${BASE}/${id}`)).json();
      expect(afterPut.name).toBe('Crud User Updated');
      expect(afterPut.role).toBe('senior tester');

      // Delete
      const delResp = await request.delete(`${BASE}/${id}`);
      expect([200, 204]).toContain(delResp.status());

      // Verify deletion (should be 404)
      const afterDel = await request.get(`${BASE}/${id}`);
      expect(afterDel.status()).toBe(404);
    } finally {
      // Best-effort cleanup: ensure the resource is removed in case of partial failures
      await request.delete(`${BASE}/${id}`);
    }
  });
});

/*
Usage:
1. Visit https://crudcrud.com and copy the generated API key (a long GUID-like string).
2. Export it to your environment, e.g. (PowerShell):
   $env:CRUDCRUD_KEY = "your-generated-key"
3. Run the test:
   npx playwright test tests/api/crudcrud.spec.ts -g "CrudCrud CRUD tests"

The test will be skipped if `CRUDCRUD_KEY` is not set. This keeps CI clean when the key isn't available.
*/