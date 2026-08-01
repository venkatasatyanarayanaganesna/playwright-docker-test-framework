const { test, expect } = require('@playwright/test');

/**
 * Pure API tests using Playwright's built-in `request` fixture — no browser
 * needed. Runs against JSONPlaceholder, a free, key-free fake REST API
 * (https://jsonplaceholder.typicode.com) that supports GET/POST/PUT/DELETE
 * with realistic status codes. Demonstrates the pattern: in a real project
 * this would hit your product's actual backend/API, and could also be used
 * for fast test-data setup/teardown before UI tests.
 *
 * Note: JSONPlaceholder simulates writes (POST/PUT/DELETE return realistic
 * responses/status codes) but does not persist them — a POST'd resource
 * won't actually appear on a later GET. That's expected and fine for
 * exercising request/response handling and status-code assertions.
 */
test.describe('Posts API @regression', () => {
  test('GET single post returns expected shape', async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('userId');
  });

  test('GET post outside the dataset returns 404', async ({ request }) => {
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(404);
  });

  test('POST creates a new post', async ({ request }) => {
    const response = await request.post('/posts', {
      data: { title: 'Playwright Automation', body: 'API testing example', userId: 1 },
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('Playwright Automation');
    expect(body).toHaveProperty('id');
  });

  test('PUT updates an existing post', async ({ request }) => {
    const response = await request.put('/posts/1', {
      data: { id: 1, title: 'Updated Title', body: 'Updated content', userId: 1 },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe('Updated Title');
  });

  test('DELETE removes a post', async ({ request }) => {
    const response = await request.delete('/posts/1');
    expect(response.status()).toBe(200);
  });

  test('LIST posts supports filtering by userId', async ({ request }) => {
    const response = await request.get('/posts?userId=1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.every((post) => post.userId === 1)).toBeTruthy();
  });
});
