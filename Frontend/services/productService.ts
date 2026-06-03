/**
 * Product Service
 * Handles all product-related API calls
 */

import { apiFetch } from "@lib/api";
import type {
  GetProductsResponse,
  GetHomepageProductsResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
} from "../types/api";
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/models";
import { API_ENDPOINTS } from "@constants/api";

export const productService = {
  /**
   * Get all products
   */
  getList: async (): Promise<GetProductsResponse> => {
    return apiFetch<GetProductsResponse>(API_ENDPOINTS.PRODUCTS_LIST, {
      method: "GET",
    });
  },

  /**
   * Get homepage products
   */
  getHomepage: async (): Promise<GetHomepageProductsResponse> => {
    return apiFetch<GetHomepageProductsResponse>(
      API_ENDPOINTS.PRODUCTS_HOMEPAGE,
      {
        method: "GET",
      },
    );
  },

  /**
   * Get single product by ID
   */
  getById: async (productId: number) => {
    return apiFetch<any>(API_ENDPOINTS.PRODUCT_GET, {
      method: "GET",
      params: { productId },
    });
  },

  /**
   * Create new product (admin only)
   */
  create: async (
    payload: CreateProductPayload,
  ): Promise<CreateProductResponse> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("amount", String(payload.amount));
    if (payload.image) {
      formData.append("image", payload.image);
    }

    return apiFetch<CreateProductResponse>(API_ENDPOINTS.PRODUCT_CREATE, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Update product (admin only)
   */
  update: async (
    payload: UpdateProductPayload,
  ): Promise<UpdateProductResponse> => {
    const formData = new FormData();
    if (payload.name !== undefined)
      formData.append("name", String(payload.name));
    if (payload.description !== undefined)
      formData.append("description", String(payload.description));
    if (payload.amount !== undefined)
      formData.append("amount", String(payload.amount));
    if (payload.image) formData.append("image", payload.image);

    return apiFetch<UpdateProductResponse>(API_ENDPOINTS.PRODUCT_UPDATE, {
      method: "PUT",
      params: { productId: payload.productId },
      body: formData,
    });
  },

  /**
   * Delete product (admin only)
   */
  delete: async (productId: number): Promise<DeleteProductResponse> => {
    return apiFetch<DeleteProductResponse>(API_ENDPOINTS.PRODUCT_DELETE, {
      method: "DELETE",
      params: { productId },
    });
  },

  /**
   * Search products
   */
  search: async (query: string) => {
    return apiFetch<GetProductsResponse>(API_ENDPOINTS.PRODUCTS_LIST, {
      method: "GET",
      params: { search: query },
    });
  },
};
