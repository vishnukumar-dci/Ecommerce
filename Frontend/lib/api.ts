const BASE_URL = "http://localhost:8088";

export const assetUrl = (path?: string) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
};

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  params?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
  nextOptions?: RequestInit;
};

const buildUrl = (path: string, params?: FetchOptions["params"]) => {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, params, headers }: FetchOptions = {}
): Promise<T> {
  const url = buildUrl(path, params);

  // Extract token from cookie
  let token: string | undefined;
  if (typeof window !== "undefined") {
    try {
      const cookie = document.cookie?.split(";").find(c => c.trim().startsWith("auth="));
      if (cookie) {
        const json = decodeURIComponent(cookie.split("=")[1] || "{}");
        const parsed = JSON.parse(json || "{}");
        token = parsed?.token;
      }
    } catch {}
  }

  console.log(`apiFetch: ${method} ${url} ${token ? '(with token)' : '(no token)'}`);

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {};
  if (!isFormData) finalHeaders["Content-Type"] = "application/json";
  if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  if (headers && !isFormData) Object.assign(finalHeaders, headers);

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `Request failed ${res.status}`;
    try {
      const data = await res.json();
      console.log("apiFetch error response:", data);
      msg = typeof data?.message === "string" ? data.message : JSON.stringify(data);
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

/** Auth + User **/
export const api = {
  register: (body: { name: string; email: string; passwords: string }) =>
    apiFetch<any>("/customer/signup", { method: "POST", body }),

  login: (body: { email: string; passwords: string }) =>
    apiFetch<any>("/customer/login", { method: "POST", body }),

  updateProfile: (body: { name: string; image?: File }) => {
  const formData = new FormData();
  formData.append("name", body.name);
  if (body.image) formData.append("image", body.image);

  return apiFetch<any>("/customer/update", {
    method: "PUT",
    body: formData,
    headers: {}, // token will be injected in apiFetch
  });
},

  /** Products **/
  productList: async () => {
    const res = await apiFetch<any>("/product/list");
    const list = res?.list || res?.data || [];
    return { list, data: list };
  },
  
  /** Homepage - latest products (optional limit param) */
  homepageProducts: async () => {
    const res = await apiFetch<any>("/product/homepage", {method: "GET"});
    const list = res?.products || [];
    return { list, data: list };
  },

  addProduct: (body: { name: string; description: string; amount: number; image?: File }) => {
  const form = new FormData();
  form.append("name", body.name);
  form.append("description", body.description);
  form.append("amount", String(body.amount));
  if (body.image) form.append("image", body.image); // File object

  console.log("Sending form data:", [...form.entries()]); // debug

  return apiFetch<any>("/product/create", { method: "POST", body: form });
},
  updateProduct: (productId: number, body: { name?: string; description?: string; amount?: number; image?: File }) => {
    const form = new FormData();
    if (body.name !== undefined) form.append("name", String(body.name));
    if (body.description !== undefined) form.append("description", String(body.description));
    if (body.amount !== undefined) form.append("amount", String(body.amount));
    if (body.image) form.append("image", body.image);
    return apiFetch<any>("/product/update", { method: "PUT", params: { productId }, body: form, headers: {} });
  },
  deleteProduct: (productId: number) =>
    apiFetch<any>("/product/delete", { method: "DELETE", params: { productId } }),

  /** Cart **/
  cartList: () => 
    apiFetch<{products: any[]}>("/cart/list"),
  cartAdd: (userId: number, productId: number) =>
    apiFetch<any>("/cart/create", { method: "POST", body: { productId } }),
  cartDecrement: (productId: number) =>
    apiFetch<any>("/cart/decrement", { method: "PUT", body: { productId } }),
  cartRemove: (userId: number, productId: number) =>
    apiFetch<any>("/cart/update", { method: "PUT", body: { productId } }),
  cartDeleteAll: () => apiFetch<any>("/cart/delete", { method: "DELETE" }),

  /** Orders **/
  createOrder: (body: { productIds: number[]; qtys: number[] }) => 
    apiFetch<any>("/order/create", { method: "POST", body }),
  createSingle:(body:{productId:number; qty:number}) =>
    apiFetch<any>("order/buynow",{method:"POST",body}),
  // Explicit helper to create a Stripe checkout session
  createCheckout: (body: { productIds: number[]; qtys: number[] }) =>
    apiFetch<any>("/order/create", { method: "POST", body }),
  updateOrder: (orderId: number, sessionId?: string, status?: string) => 
    apiFetch<any>("/order/update", { method: "PUT", params: { orderId, session_Id: sessionId, status } }),
  /**Admin order History **/
  orderHistory: async (page:number ,limit :number) => {
    const res = await apiFetch<{history: any[],totalRecords:any}>("/order/history?page="+page+"&limit="+limit)
    console.log('api.orderHistory: response', res)
    return res
  },
  /**customer order History **/
  customerOrders:(page:number,limit:number) =>
    apiFetch<{history:any[],totalRecords:any}>("/order/userhistory",{method:"GET" , params:{page,limit}}),

  /**Strip logs **/
  stripeLogs: async() =>{
    const res = await apiFetch<{logs: any[],totalLogs:any}>("/order/log")
    console.log(`api.stripeLogs:response`,res)
    return res
  } 
};
