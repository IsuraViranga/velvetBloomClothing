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
        cy.get('table tbody').should('exist');
        cy.get('table tbody tr').should('have.length.greaterThan', 0); 
        
        cy.get('table tbody tr').first().within(() => {
            cy.get('[data-testid="DeleteIcon"]').should('exist'); 
            cy.get('[data-testid="DeleteIcon"]').find('svg').should('have.class', 'MuiSvgIcon-root');
            cy.get('[data-testid="EditIcon"]').should('exist');
            cy.get('[data-testid="EditIcon"]').find('svg').should('have.class', 'MuiSvgIcon-root');
        });
      });
      it('Should display the pagination controls', () => {
        cy.get('.MuiTablePagination-root').should('exist');
        cy.get('.MuiTablePagination-select').should('exist');
        cy.get('.MuiTablePagination-select').click(); 
        cy.get('.MuiTablePagination-menuItem').contains('5'); 
        cy.get('.MuiTablePagination-menuItem').contains('10'); 
        cy.get('.MuiTablePagination-menuItem').contains('20'); 
        cy.get('.MuiTablePagination-actions .MuiIconButton-root').should('have.length', 2); 
      });  
});

describe('Category Page Action', () => {
  beforeEach(() => {
    cy.visit('/category'); 
  });

  // it('Should display all categories when the search field is empty', () => {
  //   // Verify the search input is empty on load
  //   cy.get('.MuiTextField-root').find('input').should('have.value', '');

  //   cy.get('[data-testid="category-row"]').then((rows) => {
  //     // Ensure the number of rows matches the expected count
  //     const expectedCategoryCount = 5; // Replace with your actual category count
  //     expect(rows.length).to.equal(expectedCategoryCount);
  //   });
    
  // });

  it('Should display the correct number of categories based on pagination', () => {
    cy.request('GET', 'http://localhost:8080/categories/with-product-count').then((response) => {
        const categoriesFromAPI = response.body; 
        const categoriesCount = categoriesFromAPI.length;
        cy.get('.MuiTextField-root').find('input').should('have.value', '');
        const expectedRowCount = categoriesCount > 5 ? 5 : categoriesCount;
        cy.get('[data-testid="category-row"]').should('have.length', expectedRowCount);
    });
  });

  it('Should filter the categories when typing matching text', () => {
    cy.get('label').contains('Search by Category Name').parent().find('input').type('wes');
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('td').first().invoke('text').then((text) => {
        expect(text.trim().toLowerCase().startsWith('wes')).to.be.true;
      });
    });
  });

  it('Should navigate to the add category page when "Add Category" is clicked', () => {
    cy.get('button').contains('Add Category').click();
    cy.url().should('eq', 'http://localhost:3000/add-category');
  });

  it('Should open the edit dialog when the edit icon is clicked and close it when cancel is clicked', () => {
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[data-testid="CancelButton"]').click();
    cy.get('[role="dialog"]').should('not.be.visible');
  });

  it('Should open the edit dialog, edit category details, save changes, and close the dialog', () => {
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('label').contains('Category Name').parent().find('input').clear({ force: true }).type('Updated category name', { force: true });
    cy.get('label').contains('Description').parent().find('input').clear({ force: true }).type('Updated category description', { force: true });
    cy.get('[data-testid="SaveButton"]').click();
    // Step 5: Verify that the dialog is closed after saving
    //cy.get('[role="dialog"]').should('not.be.visible');
    
  });
  
  it('Should navigate between pages and verify page changes', () => {
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).should('be.visible'); 
    cy.get('.MuiTablePagination-toolbar').should('contain', '1–'); 
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).click(); 
    cy.get('.MuiTablePagination-toolbar').should('contain', '6–');
    cy.get('table tbody tr').should('exist'); 
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(0).click(); 
    cy.get('.MuiTablePagination-toolbar').should('contain', '1–'); 
    cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).should('be.visible'); 
  });

  it('Should change the number of rows per page when selected', () => {
      cy.get('.MuiTablePagination-select').click();
      cy.get('.MuiMenuItem-root').contains('10').click();
      cy.get('.MuiTablePagination-select').should('contain', '10');
      cy.get('.MuiMenuItem-root').contains('20').click();
      cy.get('.MuiTablePagination-select').should('contain', '20');
      cy.get('.MuiTablePagination-select').click();
      cy.get('.MuiMenuItem-root').contains('5').click();
      cy.get('.MuiTablePagination-select').should('contain', '5');
  });
  
});



  