/// <reference types="cypress" />

describe('Signup Flow', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3001/api/auth/register', {
      email: `test${Date.now()}@example.com`,
      password: 'Password123',
      name: 'Test User',
    }).then((resp) => {
      expect(resp.status).to.eq(201);
      expect(resp.body.user.email).to.contain('@');
      expect(resp.body.token).to.exist;
    });
  });

  it('should register a new user', () => {
    // Already tested in beforeEach via API
  });

  it('should reject duplicate email', () => {
    const email = `duplicate${Date.now()}@example.com`;
    cy.request('POST', 'http://localhost:3001/api/auth/register', {
      email,
      password: 'Password123',
    }).then(() => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/auth/register',
        body: { email, password: 'Password123' },
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.eq(409);
      });
    });
  });
});
