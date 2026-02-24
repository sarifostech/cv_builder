/// <reference types="cypress" />

describe('Export Flow', () => {
  let token: string;
  let cvId: string;

  before(() => {
    cy.request('POST', 'http://localhost:3001/api/auth/register', {
      email: `export${Date.now()}@example.com`,
      password: 'Password123',
    }).then((resp) => {
      token = resp.body.token;
      // Create CV
      return cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/cvs',
        headers: { Authorization: `Bearer ${token}` },
        body: { title: 'Export Test CV', templateId: 'default' },
      });
    }).then((resp) => {
      cvId = resp.body.id;
      // Add some content
      cy.request({
        method: 'POST',
        url: `http://localhost:3001/api/cvs/${cvId}/autosave`,
        headers: { Authorization: `Bearer ${token}` },
        body: {
          content: {
            personalInfo: { fullName: 'Bob', email: 'bob@example.com', phone: '', location: '' },
            summary: { text: 'Summary' },
            experience: [],
            education: [],
            skills: { items: ['Skill'] },
            projects: [],
          },
          version: 1,
        },
      });
    });
  });

  it('should export ATS-safe PDF for free user', () => {
    expect(cvId).to.exist;
    cy.request({
      method: 'GET',
      url: `http://localhost:3001/api/cvs/${cvId}/export-pdf?mode=ats`,
      headers: { Authorization: `Bearer ${token}` },
      encoding: 'binary',
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.headers['content-type']).to.include('application/pdf');
    });
  });

  it('should deny Visual export for free user', () => {
    expect(cvId).to.exist;
    cy.request({
      method: 'GET',
      url: `http://localhost:3001/api/cvs/${cvId}/export-pdf?mode=visual`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(403);
    });
  });
});
