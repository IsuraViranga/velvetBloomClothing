describe('Product Management Page UI', () => {
    beforeEach(() => {
      cy.visit('/project-management');
    });

    it('Should display the page with the overall inventory title and stats section', () => {
      cy.contains('h5', 'Overall Inventory').should('be.visible'); 
      cy.contains('Categories').should('be.visible');
      cy.contains('Total Products').should('be.visible');
      cy.contains('In Stock').should('be.visible');
      cy.contains('Low Stock').should('be.visible');
      cy.contains('Out of Stock').should('be.visible');
    });

    it('Should display correct stats with values', () => {
      cy.get('table').should('exist'); 
      cy.get('table tbody').should('exist');
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });

    it('Should display the Add Product button', () => {
      cy.contains('Add Product').should('be.visible');
    });

    it('Should display search fields and status dropdown', () => {
      cy.contains('label', 'Search by Product Name').should('exist');
      cy.contains('label', 'Search by Category Name').should('exist');
      cy.contains('label', 'Status').should('exist');
      cy.get('input').should('have.length', 4); 
    });

    it('Should display the product table headers correctly', () => {
      cy.contains('table', 'Product Name').should('exist');
      cy.contains('table', 'Available Count').should('exist');
      cy.contains('table', 'Low Stock Count').should('exist');
      cy.contains('table', 'Unit Price').should('exist');
      cy.contains('table', 'Status').should('exist');
      cy.contains('table', 'Actions').should('exist');
    });

    it('Should display products table with rows', () => {
      cy.get('table tbody').should('exist');
      cy.get('table tbody tr').should('have.length.greaterThan', 0); 
    });

    it('Should display product actions with Edit and Delete buttons', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('[data-testid="EditIcon"]').should('exist'); 
        cy.get('[data-testid="DeleteIcon"]').should('exist'); 
      });
    });

    it('Should display the pagination controls', () => {
      cy.get('.MuiTablePagination-root').should('exist'); 
      cy.get('.MuiTablePagination-select').should('exist'); 
      cy.get('.MuiTablePagination-actions .MuiIconButton-root').should('have.length', 2); 
    });

    it('Should display the delete confirmation dialog', () => {
      cy.get('[data-testid="DeleteIcon"]').first().click(); 
      cy.get('.MuiDialog-root').should('exist'); 
      cy.contains('Delete Product').should('be.visible'); 
      cy.contains('Are you sure you want to delete this product?').should('be.visible'); 
      cy.get('.MuiDialogActions-root').should('exist'); 
    });
});

describe('Product Management Page Actions', () => {
    beforeEach(() => {
      // Navigate to the Product Management page
      cy.visit('/project-management');
    });
  
    it('Should display all products when no filters are applied', () => {
      // Ensure the search fields are empty on load
      cy.get('label').contains('Search by Product Name').parent().find('input').should('have.value', '');
      cy.get('label').contains('Search by Category Name').parent().find('input').should('have.value', '');
      cy.get('label').contains('Status').parent().find('input').should('have.value','All');
  
      // Verify that all products are displayed in the table
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });
  
    it('Should filter products by name when typing in the search field', () => {
      // Type a product name to filter
      const searchText = 'j'; // Replace with an actual product name for testing
      cy.get('label').contains('Search by Product Name').parent().find('input').type(searchText);
  
      // Verify the filtered results
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).find('td').first().invoke('text').then((text) => {
          expect(text.trim().toLowerCase()).to.include(searchText.toLowerCase());
        });
      });
    });
  
    it('Should filter products by category name', () => {
      // Type a category name to filter
      const categoryText = 'tsh'; // Replace with an actual category name for testing
      cy.get('label').contains('Search by Category Name').parent().find('input').type(categoryText);
  
      cy.get('[data-testid="product-row"]').then((rows) => {
        // Ensure the number of rows matches the expected count
        const expectedRowCount = 2; // Replace with your actual category count
        expect(rows.length).to.equal(expectedRowCount);
      });

    });
  
    it('Should filter products by status', () => {
        // Open the Status dropdown (target the first combobox)
        cy.get('div[role="combobox"]').first().click();
       
        // Ensure dropdown options are visible
        cy.get('ul[role="listbox"]').should('be.visible');
      
        // Select the "Low Stock" option
        cy.get('ul[role="listbox"]').contains('Low Stock').click();
      
        // Verify that only products with "Low Stock" status are displayed
        cy.get('table tbody tr').each(($row) => {
          cy.wrap($row).find('td:nth-child(5)').invoke('text').then((text) => {
            expect(text.trim()).to.equal('Low Stock');
          });
        });
    });
      
    it('Should navigate to the Add Product page when "Add Product" is clicked', () => {
      // Click the Add Product button
      cy.get('button').contains('Add Product').click();
  
      // Verify navigation to the Add Product page
      cy.url().should('include', '/add-product');
    });
  
    it('Should open the delete confirmation dialog when the delete icon is clicked and close it when canceled', () => {
      // Click the delete icon for the first product
      cy.get('[data-testid="DeleteIcon"]').first().click();
  
      // Verify that the delete dialog is open
      cy.get('[role="dialog"]').should('be.visible');
  
      // Click the cancel button
      cy.get('button').contains('Cancel').click();
  
      // Verify that the dialog is closed
      cy.get('[role="dialog"]').should('not.be.visible');
    });
  
    it('Should delete a product when confirmed in the delete dialog', () => {
      // Click the delete icon for the first product
      cy.get('[data-testid="DeleteIcon"]').first().click();
  
      // Confirm the delete action
      //cy.get('button').contains('Delete').click();
  
      // Verify the product is removed from the table
      //cy.get('table tbody tr').should('have.length.lessThan', 6); // Replace `initialProductCount` with the number before deletion
    });
  
    it('Should navigate to the Edit Product page when the edit icon is clicked', () => {
      // Click the edit icon for the first product
      cy.get('[data-testid="EditIcon"]').first().click();
  
      // Verify navigation to the Edit Product page
      cy.url().should('include', '/edit-product/');
    });
  
    // it('Should paginate through the product table', () => {
    //   // Verify that the initial page displays the correct number of rows
    //   cy.get('table tbody tr').should('have.length', 5);
  
    //   // Go to the next page
    //   cy.get('button[aria-label="Go to next page"]').click();
  
    //   // Verify that new rows are displayed
    //   cy.get('table tbody tr').should('have.length.greaterThan', 0);
    // });
});
  
//pagination
//delete action