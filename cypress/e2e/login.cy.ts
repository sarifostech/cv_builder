/// <reference types="cypress" />

describe('Login Flow', () => {
  let testUser: { email: string; password: string; token: string };

  beforeEach(() => {
    cy.request('POST', 'http://localhost:3001/api/auth/register', {
      email: `login${Date.now()}@example.com`,
      password: 'Password123',
    }).then((resp) => {
      testUser = {
        email: resp.body.user.email,
        password: 'Password123',
        token: resp.body.token,
      };
    });
  });

  it('should log in with correct credentials', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/api/auth/login',
      body: { email: testUser.email, password: testUser.password },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.user.email).to.eq(testUser.email);
      expect(resp.body.token).to.exist;
    });
  });

  it('should reject invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/api/auth/login',
      body: { email: testUser.email, password: 'WrongPass' },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
    });
  });
});
