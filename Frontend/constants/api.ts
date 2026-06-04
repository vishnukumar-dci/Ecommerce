/**
 * Constants configuration
 * API URLs, timeouts, and app settings
 */

export const API_CONFIG = {
  BASE_URL: "http://localhost:8000",
  TIMEOUT: 30000,
};

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: number) => `/products/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  PAYMENT_STATUS: "/payment-status",
  ORDERS: "/orders",
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin",
  ADMIN_ORDERS: "/admin/orders",
  PROFILE: "/profile",
  LOGS: "/logs",
};

export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNUP: "/customer/signup",
  AUTH_LOGIN: "/customer/login",
  AUTH_UPDATE: "/customer/update",
  AUTH_LOGOUT: "/customer/logout",

  // Products
  PRODUCTS_LIST: "/product/list",
  PRODUCTS_HOMEPAGE: "/product/homepage",
  PRODUCT_GET: "/product/get",
  PRODUCT_CREATE: "/product/create",
  PRODUCT_UPDATE: "/product/update",
  PRODUCT_DELETE: "/product/delete",

  // Cart
  CART_LIST: "/cart/list",
  CART_ADD: "/cart/create",
  CART_REMOVE: "/cart/update",
  CART_DECREMENT: "/cart/decrement",
  CART_DELETE_ALL: "/cart/delete",

  // Orders
  ORDER_CREATE: "/order/create",
  ORDER_BUY_NOW: "/order/buynow",
  ORDER_STATUS: "/order/status",
  ORDER_HISTORY: "/order/history",
  ORDER_USER_HISTORY: "/order/userhistory",
  ORDER_UPDATE: "/order/update",
  ORDER_VERIFY_PAYMENT: "/order/payment-verify",
  ORDER_STRIPE_LOGS: "/order/log",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authenticated. Please login.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Something went wrong on the server. Please try again.",
  GENERIC_ERROR: "An unexpected error occurred.",
};

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
  MAX_LIMIT: 100,
};

export const POLLING = {
  PAYMENT_STATUS_INTERVAL: 5000, // 5 seconds
  PAYMENT_STATUS_MAX_ATTEMPTS: 120, // 10 minutes max
  EXPONENTIAL_BACKOFF: true,
};

export const CACHE_TIMES = {
  SHORT: 1000 * 60 * 1, // 1 minute
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
};
