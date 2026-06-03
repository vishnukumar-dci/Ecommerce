/**
 * Mock data factory for tests
 * Generates realistic test data
 */

export const mockProduct = (overrides = {}) => ({
  id: 1,
  name: "Test Product",
  description: "A test product",
  price: 99.99,
  image: "/test-image.jpg",
  category: "electronics",
  stock: 10,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const mockOrder = (overrides = {}) => ({
  id: "1",
  customerId: "1",
  items: [{ productId: 1, quantity: 1, price: 99.99 }],
  status: "pending",
  total: 99.99,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const mockUser = (overrides = {}) => ({
  id: "1",
  email: "test@example.com",
  name: "Test User",
  phone: "1234567890",
  role: "customer",
  ...overrides,
});

export const mockCartItem = (overrides = {}) => ({
  productId: 1,
  quantity: 1,
  price: 99.99,
  product: mockProduct(),
  ...overrides,
});

export const mockCart = (overrides = {}) => ({
  items: [mockCartItem()],
  total: 99.99,
  itemCount: 1,
  ...overrides,
});
