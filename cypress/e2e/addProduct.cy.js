describe('Add Product Page', () => {
    beforeEach(() => {
      cy.visit('/project-management');
    });
  
    it('Should navigate to the add Product page when the add button is clicked', () => {
      cy.wait(6000);
      cy.get('button').contains('Add Product').click();
      cy.url().should('include', '/add-product');
      cy.contains('Add Product', { timeout: 10000 }).should('be.visible');
    });
  
    it('Should show validation errors when submitting with invalid data', () => {
      cy.get('button').contains('Add Product').click();
      cy.get('[data-testid="add"]', { timeout: 10000 }).should('be.visible').click();
      cy.contains('Product name cannot be empty.').should('be.visible');
      cy.contains('Brand name cannot be empty.').should('be.visible');
      cy.contains('Size cannot be empty for variation 1.').should('be.visible');
      cy.contains('Color cannot be empty in variation 1, color 1.').should('be.visible');
      cy.contains('Count must be greater than 0 in variation 1, color 1.').should('be.visible');
    });
  
    it('Should show validation errors when submitting with invalid data part two', () => {
      cy.get('button').contains('Add Product').click();
      cy.get('input[name="productName"]').clear().type('Valid Product 2'); 
      cy.get('input[name="brand"]').clear().type('Valid brand 2');
  
      cy.get('[data-testid="add"]', { timeout: 10000 }).should('be.visible').click();
      cy.contains('Product name can only contain letters.need atleast 3').should('be.visible');
      cy.contains('Brand name can only contain letters.').should('be.visible');
    });

    it('Should allow saving changes when valid data is entered', () => {
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert');
      });
      cy.get('button').contains('Add Product').click();
      cy.get('input[name="productName"]').clear().type('Valid Product Name');
      cy.get('input[name="brand"]').clear().type('Valid Brand');
      cy.get('input[name="low-count"]').clear().type(4);
      cy.get('input[name="productCount"]').clear().type(10);
      cy.get('input[name ="unitPrice"]').clear().type(300);
      cy.get('input[name="discount"]').clear().type(2);
      const filePath = 'images.jpg'; 
      cy.get('input[name="file"]').attachFile(filePath); 
      cy.get('[data-testid="variations-section"]').each((variationSection, index) => {
        cy.get('div[role="combobox"]').first().click();
        cy.get('ul[role="listbox"]').should('be.visible');
        cy.get('ul[role="listbox"]').contains('Medium').click();
    
        cy.get(variationSection)
          .find('[data-testid="color-input"]')
          .first()
          .clear()
          .type('Red')
    
        cy.get(variationSection)
          .find('[data-testid="count-input"]')
          .first()
          .clear()
          .type('10')
      });
      cy.get('[data-testid="add"]', { timeout: 10000 }).should('be.visible').click();
      cy.get('@alert').should('have.been.calledWith', 'Product added successfully!');
      cy.contains('Product added successfully!').should('be.visible');
    });    
});  
    