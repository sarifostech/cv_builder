/// <reference types="cypress" />

describe('Builder Flow', () => {
  let token: string;
  let cvId: string;

  before(() => {
    cy.request('POST', 'http://localhost:3001/api/auth/register', {
      email: `builder${Date.now()}@example.com`,
      password: 'Password123',
    }).then((resp) => {
      token = resp.body.token;
    });
  });

  it('should create a CV', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/api/cvs',
      headers: { Authorization: `Bearer ${token}` },
      body: { title: 'My CV', templateId: 'default' },
    }).then((resp) => {
      expect(resp.status).to.eq(201);
      cvId = resp.body.id;
    });
  });

  it('should update CV content via autosave', () => {
    expect(cvId).to.exist;
    cy.request({
      method: 'POST',
      url: `http://localhost:3001/api/cvs/${cvId}/autosave`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        content: {
          personalInfo: { fullName: 'Alice', email: 'alice@example.com', phone: '123', location: 'NY' },
          summary: { text: 'Summary text' },
          experience: [],
          education: [],
          skills: { items: ['TS', 'React'] },
          projects: [],
        },
        version: 1,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.version).to.eq(2);
    });
  });

  it('should fetch the CV and verify content', () => {
    expect(cvId).to.exist;
    cy.request({
      method: 'GET',
      url: `http://localhost:3001/api/cvs/${cvId}`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.content.personalInfo.fullName).to.eq('Alice');
    });
  });
});
