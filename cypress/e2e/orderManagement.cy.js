describe("Order Management Page", () => {
    beforeEach(() => {
      cy.intercept("GET", "http://localhost:8080/orders", {
        fixture: "orders.json", 
      }).as("getOrders");
      cy.visit("/order-management"); 
    });
  
    it("displays the order management page with a list of orders", () => {
      cy.wait("@getOrders");
      cy.contains("Order Management").should("be.visible");
      cy.get("table thead tr").within(() => {
        cy.contains("Order ID").should("be.visible");
        cy.contains("Date").should("be.visible");
        cy.contains("Status").should("be.visible");
        cy.contains("Customer").should("be.visible");
        cy.contains("Total").should("be.visible");
        cy.contains("Actions").should("be.visible");
      });
      cy.get("table tbody tr").should("have.length.at.least", 1);
    });
  
    it("filters orders by status", () => {
      cy.wait("@getOrders");
      cy.get('div[role="combobox"]').first().click();
      cy.get('ul[role="listbox"]').should('be.visible');
      cy.get('ul[role="listbox"]').contains('Shipped').click();
      cy.get("table tbody tr").each(($row) => {
        cy.wrap($row).within(() => {
          cy.get("td").eq(2).should("have.text", "Shipped");
        });
      });
    });
  
    // it("deletes an order", () => {
    //   cy.wait("@getOrders");
   
    //   // Intercept DELETE API call
    //   cy.intercept("DELETE", "http://localhost:8080/orders/*", {
    //     statusCode: 200,
    //   }).as("deleteOrder");
  
    //   //Click delete button for the first order
    //   cy.get("table tbody tr").first().within(() => {
    //     cy.get('[data-testid="deleteIcon"]').first().click();
    //     cy.get('[role="dialog"]').should('be.visible');
    //   });
  
    //   // Confirm the delete dialog
      
  
    //   cy.wait("@deleteOrder");
  
    //   // Verify the order is removed
    //   cy.get("table tbody tr").should("have.length.at.least", 0);
    // });
  
    it("paginates the orders", () => {
      cy.wait("@getOrders");
      cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).click(); 
      cy.get('.MuiTablePagination-toolbar').should('contain', '6–');
      cy.get('table tbody tr').should('exist');
      cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(0).click();
      cy.get('.MuiTablePagination-toolbar').should('contain', '1–'); 
      cy.get('.MuiTablePagination-actions .MuiIconButton-root').eq(1).should('be.visible'); 
  
    });
});
  