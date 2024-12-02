describe('Edit Product Page', () => {
  beforeEach(() => {
    cy.visit('/project-management');
  });

  it('Should navigate to the Edit Product page when the edit icon is clicked', () => {
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.url().should('include', '/edit-product/');
    cy.contains('Edit Product', { timeout: 10000 }).should('be.visible');
  });

  it('Should show validation errors when submitting invalid data', () => {
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.get('input[name="productName"]').clear(); 
    cy.get('input[name="brand"]').clear(); 
    cy.get('[data-testid="SaveChangesButton"]').click(); 
    cy.contains('Product name cannot be empty.').should('be.visible');
    cy.contains('Brand name cannot be empty.').should('be.visible');
  });

  it('Should show validation errors when submitting invalid data part two', () => {
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.get('input[name="productName"]').clear().type('Valid Product 2'); 
    cy.get('input[name="brand"]').clear().type('Valid bran 2'); 
    cy.get('[data-testid="SaveChangesButton"]').click(); 
    cy.contains('Product name can only contain letters.need atleast 3').should('be.visible');
    cy.contains('Brand name can only contain letters.').should('be.visible');
  });
  
  it('Should allow saving changes when valid data is entered', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.get('input[name="productName"]').clear().type('Valid Product Name');
    cy.get('input[name="brand"]').clear().type('Valid Brand');
    cy.get('[data-testid="SaveChangesButton"]').click(); // Click "Save Changes"
    cy.get('@alert').should('have.been.calledWith', 'Product updated successfully!');
    cy.contains('Product updated successfully!').should('be.visible');
  });
 
});  
  