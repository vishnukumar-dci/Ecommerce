/**
 * Checkout flow helpers
 * Extract and reuse checkout logic
 */

export interface CheckoutData {
  productIds: number[];
  quantities: number[];
}

export const handleOrderCheckout = (
  checkoutData: CheckoutData,
  stripeUrl?: string,
) => {
  if (!stripeUrl) {
    throw new Error("Stripe URL not provided");
  }

  // Redirect to Stripe checkout
  if (typeof window !== "undefined") {
    window.location.href = stripeUrl;
  }

  return { success: true, url: stripeUrl };
};

export const extractCheckoutUrlFromResponse = (
  response: any,
): string | undefined => {
  return response?.url || response?.sessionUrl;
};

export const validateCheckoutData = (
  data: CheckoutData,
): { valid: boolean; error?: string } => {
  if (!data.productIds || data.productIds.length === 0) {
    return { valid: false, error: "No products selected" };
  }

  if (!data.quantities || data.quantities.length === 0) {
    return { valid: false, error: "Quantities not specified" };
  }

  if (data.productIds.length !== data.quantities.length) {
    return {
      valid: false,
      error: "Product IDs and quantities mismatch",
    };
  }

  const allPositive = data.quantities.every((q) => q > 0);
  if (!allPositive) {
    return { valid: false, error: "All quantities must be positive" };
  }

  return { valid: true };
};
