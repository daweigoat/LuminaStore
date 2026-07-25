describe('LuminaStore Checkout Flow', () => {
  beforeEach(() => {
    // Navigate to the store and mock an authenticated user
    cy.visit('http://localhost:3000')
    cy.setCookie('token', 'mock_jwt_token') // Mock session
  })

  it('Allows a user to add a product to cart and checkout', () => {
    // 1. Find a product and click it
    cy.get('[data-cy="product-card"]').first().click()

    // 2. Add to cart
    cy.get('[data-cy="add-to-cart-btn"]').click()
    
    // 3. Open cart sidebar
    cy.get('[data-cy="cart-trigger"]').click()
    
    // 4. Proceed to checkout
    cy.get('[data-cy="checkout-btn"]').click()

    // 5. Verify checkout URL
    cy.url().should('include', '/checkout')
    
    // 6. Select Address
    cy.get('[data-cy="address-card"]').first().click()
    
    // 7. Place Order
    cy.get('[data-cy="place-order-btn"]').click()
    
    // 8. Verify Order Success
    cy.contains('Order Placed Successfully').should('be.visible')
  })
})
