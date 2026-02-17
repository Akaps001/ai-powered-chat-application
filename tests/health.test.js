import request from 'supertest';
import express from 'express';
// We need to import the app app setup. 
// However, the current index.js starts the server immediately. 
// We should probably refactor index.js to export the app, but for now let's try to import it.
// If index.js starts the server on import, that might be an issue for testing.
// Let's create a test enabling us to check the codebase's health.

// Since index.js starts the server, we might need a different approach or refactor.
// For now, let's assume we can hit the running server or that we'll refactor later.
// Actually, a better approach for a "readiness" check without refactoring is to separate app.js and index.js
// But I should avoid big refactors if possible.

// Let's look at index.js again.
// It does `const server = app.listen(...)`.
// If I import it, it will start the server. This is annoying for tests but manageable if I can close it.
// But index.js doesn't export `app` or `server`.

// REQUIRED: Refactoring index.js is necessary to test `app` properly with supertest.
// I will split index.js into app.js (exports app) and index.js (starts server).

// For THIS step, I'll create the test file assuming I'll refactor app.js next.
// Wait, I can't write the test file importing './app.js' if it doesn't exist.
// So I must refactor first or write the test to hit the URL if running? No, unit/integration tests should normally use supertest on the express instance.

// Plan:
// 1. Rename index.js to src/app.js (and export app).
// 2. Create new index.js that imports app and starts it.
// 3. Write test importing app from src/app.js.

// Let's stick to the plan of creating the test file first, but I'll point it to `../src/app.js`.
// I will perform the refactor in the next step.

import { app } from '../src/app.js'; 

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
