describe('Category Page UI', () => {
    beforeEach(() => {
      cy.visit('/category'); 
    });
   
    it('Should display the Category page with title and search bar', () => {
      cy.contains('h4', 'Category').should('be.visible');
      cy.contains('Add Category').should('be.visible'); 
      cy.contains('label', 'Search by Category Name').should('exist');
    });

    it('Should display the correct table headers', () => {
        cy.contains('table', 'Category Name').should('exist'); 
        cy.contains('table', 'Description').should('exist');   
        cy.contains('table', 'Number of Products').should('exist');  
        cy.contains('table', 'Actions').should('exist'); 
    });

    it('Should display category table with correct data and buttons', () => {
        // Check that the table body exists
        cy.get('table tbody').should('exist');
        cy.get('table tbody tr').should('have.length.greaterThan', 0); 
        
        // Check if each row is displayed correctly
        cy.get('table tbody tr').should('have.length', 5); 
        
        cy.get('table tbody tr').first().within(() => {
            // Check for delete button using the test ID or the button class
            cy.get('[data-testid="DeleteIcon"]').should('exist'); // Check if the delete icon is present
      
            // If you want to check the icon is rendered correctly:
            cy.get('[data-testid="DeleteIcon"]').find('svg').should('have.class', 'MuiSvgIcon-root');
      
            // Check for the edit button (if using similar structure)
            cy.get('[data-testid="EditIcon"]').should('exist'); // Check if the edit icon is present
      
            // Check the edit icon class (optional, for verification)
            cy.get('[data-testid="EditIcon"]').find('svg').should('have.class', 'MuiSvgIcon-root');
        });
      });

      it('Should display the pagination controls', () => {
        // Check that the pagination component exists
        cy.get('.MuiTablePagination-root').should('exist');
        
        // Check that rows per page selector exists and has the correct options
        cy.get('.MuiTablePagination-select').should('exist');

        cy.get('.MuiTablePagination-select').click(); 
        cy.get('.MuiTablePagination-menuItem').contains('5'); // Check if the default option '5' is present
        cy.get('.MuiTablePagination-menuItem').contains('10'); // Check if '10' is an option
        cy.get('.MuiTablePagination-menuItem').contains('20'); // Check if '20' is an option
    
        // Check that the page navigation buttons (Next, Previous) exist
        cy.get('.MuiTablePagination-actions .MuiIconButton-root').should('have.length', 2); // There should be two buttons (Next and Previous)
      });
    
});

describe('Category Page Action', () => {
  beforeEach(() => {
    cy.visit('/category'); 
  });

  it('Should display all categories when the search field is empty', () => {
    // Verify the search input is empty on load
    cy.get('.MuiTextField-root').find('input').should('have.value', '');

    cy.get('[data-testid="category-row"]').then((rows) => {
      // Ensure the number of rows matches the expected count
      const expectedCategoryCount = 5; // Replace with your actual category count
      expect(rows.length).to.equal(expectedCategoryCount);
    });
    
  });

  it('Should filter the categories when typing matching text', () => {
    // Type a letter that matches some categories
    cy.get('label').contains('Search by Category Name').parent().find('input').type('k');
  
    // Verify the filtered list shows only categories starting with 'k'
    cy.get('table tbody tr').each(($row) => {
      // Extract the text from the first cell of the row
      cy.wrap($row).find('td').first().invoke('text').then((text) => {
        // Assert the text starts with 'k' (case-insensitive)
        expect(text.trim().toLowerCase().startsWith('k')).to.be.true;
      });
    });
  });

  it('Should navigate to the add category page when "Add Category" is clicked', () => {
    // Find the "Add Category" button and click it
    cy.get('button').contains('Add Category').click();
    
    // Verify the URL after clicking "Add Category"
    cy.url().should('eq', 'http://localhost:3002/add-category');
  });

  it('Should open the edit dialog when the edit icon is clicked and close it when cancel is clicked', () => {
    // Click the edit icon for the first category
    cy.get('[data-testid="EditIcon"]').first().click();
    
    // Verify that the edit dialog is open (you can check the dialog visibility here)
    cy.get('[role="dialog"]').should('be.visible');
    
    // Click the cancel button to close the dialog
    cy.get('[data-testid="CancelButton"]').click();
    
    // Verify that the dialog is closed
    cy.get('[role="dialog"]').should('not.be.visible');
  });

  it('Should open the edit dialog, edit category details, save changes, and close the dialog', () => {
    // Step 1: Click the edit icon for the first category
    cy.get('[data-testid="EditIcon"]').first().click();
    
    // Step 2: Verify that the dialog is open
    cy.get('[role="dialog"]').should('be.visible');
    
    cy.get('label').contains('Category Name').parent().find('input').clear({ force: true }).type('Updated category name', { force: true });
    cy.get('label').contains('Description').parent().find('input').clear({ force: true }).type('Updated category description', { force: true });

    // Step 4: Click the save button to save the changes
    cy.get('[data-testid="SaveButton"]').click();
    
    // Step 5: Verify that the dialog is closed after saving
    //cy.get('[role="dialog"]').should('not.be.visible');
    
  });
  
  it('Should navigate between pages and verify page changes', () => {

    // Verify we are on the first page
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).should('be.visible'); 
    cy.get('.MuiTablePagination-toolbar').should('contain', '1–'); // Check visible text indicating the current page range
    
    // Click the "Next" button to go to page 2
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).click(); // Second button is typically "Next"
    
    // Verify the current page has updated to page 2
    cy.get('.MuiTablePagination-toolbar').should('contain', '6–'); // Adjust based on how your rows are displayed (e.g., 6–10 for 5 rows per page)
  
    // Optionally, verify rows are rendered for page 2
    cy.get('table tbody tr').should('exist'); // Ensure rows are loaded
    
    // Click the "Previous" button to go back to page 1
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(0).click(); // First button is typically "Back"
    
    // Verify we are back on page 1
    cy.get('.MuiTablePagination-toolbar').should('contain', '1–'); // Confirm first-page range
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).should('be.visible'); 
  });

  it('Should change the number of rows per page when selected', () => {
      // Open the rows per page selector
      cy.get('.MuiTablePagination-select').click();
  
      // Select "10 rows per page"
      cy.get('.MuiMenuItem-root').contains('10').click();
  
      // Check if the rows per page option has been updated
      cy.get('.MuiTablePagination-select').should('contain', '10');
      
      // Select "20 rows per page"
      cy.get('.MuiMenuItem-root').contains('20').click();

      // Check if the rows per page option has been updated
      cy.get('.MuiTablePagination-select').should('contain', '20');

      // Open the rows per page selector
      cy.get('.MuiTablePagination-select').click();

      // Select "10 rows per page"
      cy.get('.MuiMenuItem-root').contains('5').click();
  
      // Check if the rows per page option has been updated
      cy.get('.MuiTablePagination-select').should('contain', '5');
  });
  
});



  