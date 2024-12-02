describe('Category Page UI', () => {
    beforeEach(() => {
      cy.visit('/category'); 
    });
   
    it('Should display add category page when click add category button', () => {
      cy.get('button').contains('Add Category').click();
      cy.url().should('include', '/add-category');
      cy.contains('Add Category', { timeout: 10000 }).should('be.visible');
    });

    it('Should show validation errors when submitting without data', () => {
        cy.get('button').contains('Add Category').click();
        cy.get('[data-testid="add"]', { timeout: 10000 }).should('be.visible').click(); 
        cy.contains('Category name cannot be empty.').should('be.visible');
        cy.contains('Description cannot be empty.').should('be.visible');
        cy.contains('Main image cannot be empty.').should('be.visible');
    });

    it('Should show validation errors when submitting with invalid data part two', () => {
        cy.get('button').contains('Add Category').click();
        cy.get('input[name="categoryName"]').clear().type('V2'); 
        cy.get('textarea[name="descriptionn"]').clear().type('ww2');
        const filePath = 'images.jpg'; 
        cy.get('input[name="file"]').attachFile(filePath);
        cy.get('[data-testid="add"]', { timeout: 10000 }).should('be.visible').click();
        cy.contains('Category name can only contain letters.').should('be.visible');
        cy.contains('Description can only contain letters.').should('be.visible');
    });

    it('check correct input data create category properly', () => {
        cy.get('button').contains('Add Category').click();
        cy.get('input[name="categoryName"]').clear().type('shorts'); 
        cy.get('textarea[name="descriptionn"]').clear().type('quality denim shorts');
        const filePath = 'images.jpg'; 
        cy.get('input[name="file"]').attachFile(filePath);

        cy.get('[data-testid="add"]', { timeout: 10000 }).should('be.visible').click();
        cy.contains('Category added successfully!').should('be.visible');
    });

    it('Should display add category page when click add category button', () => {
        cy.get('button').contains('Add Category').click();
        cy.url().should('include', '/add-category');
        cy.contains('Add Category', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="back"]', { timeout: 10000 }).should('be.visible').click();
        cy.url().should('include', '/category');
    });
  
});



  