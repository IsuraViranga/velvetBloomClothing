describe("Dashboard Page", () => {
    beforeEach(() => {
      cy.intercept("GET", "http://localhost:8080/api/inventories/stats", {
        statusCode: 200,
        body: {
          totalSales: "$10,000",
          newOrders: 15,
          pendingOrders: 5,
        },
      }).as("getStats");
  
      cy.intercept("GET", "http://localhost:8080/products/low-stock", {
        statusCode: 200,
        body: [
          { id: "P001", name: "Product A", stock: 2 },
          { id: "P002", name: "Product B", stock: 1 },
        ],
      }).as("getLowStockProducts");
  
      cy.intercept("GET", "http://localhost:8080/orders/recent", {
        statusCode: 200,
        body: [
          {
            id: "O001",
            customer: "John Doe",
            date: "2024-12-01",
            status: "Completed",
            total: "$200",
          },
          {
            id: "O002",
            customer: "Jane Smith",
            date: "2024-12-02",
            status: "Pending",
            total: "$150",
          },
        ],
      }).as("getRecentOrders");
  
      cy.intercept("GET", "http://localhost:8080/orders/count", {
        statusCode: 200,
        body: { count: 50 },
      }).as("getOrderCount");
      
      cy.visit("/dashboard");
    });
  
    it("should display the dashboard title", () => {
      cy.contains("Dashboard").should("be.visible");
    });
  
    it("should display the stats cards with correct data", () => {
      cy.wait("@getStats");
  
      cy.contains("Total Sales").should("be.visible");
      cy.contains("$10,000").should("be.visible");
  
      cy.contains("New Orders").should("be.visible");
      cy.contains("15").should("be.visible");
  
      cy.contains("Pending Orders").should("be.visible");
      cy.contains("5").should("be.visible");
  
      cy.contains("Low Products").should("be.visible");
      cy.contains("2").should("be.visible");
    });
  
    it("should display the low stock products table with correct data", () => {
      cy.wait("@getLowStockProducts");
  
      cy.contains("Low Stock Products").should("be.visible");
      cy.get("table")
        .contains("Product A")
        .should("be.visible")
        .siblings()
        .contains("2");
      cy.get("table")
        .contains("Product B")
        .should("be.visible")
        .siblings()
        .contains("1");
    });
  
    it("should display the recent orders table with correct data", () => {
      cy.wait("@getRecentOrders");
  
      cy.contains("Recent Orders").should("be.visible");
      cy.get("table")
        .contains("O001")
        .should("be.visible")
        .siblings()
        .contains("John Doe")
        .siblings()
        .contains("2024-12-01")
        .siblings()
        .contains("Completed")
        .should("have.css", "color", "rgb(0, 191, 166)");
      cy.get("table")
        .contains("O002")
        .should("be.visible")
        .siblings()
        .contains("Jane Smith")
        .siblings()
        .contains("2024-12-02")
        .siblings()
        .contains("Pending")
        .should("have.css", "color", "rgb(255, 152, 0)");
    });
});
  