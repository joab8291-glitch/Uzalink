const API_BASE = (import.meta.env.VITE_UZALINK_API || "https://uzalink-backend.onrender.com").replace(/\/$/, "");

async function request<T>(path:string, init:RequestInit={}) : Promise<T> {
  const response=await fetch(`${API_BASE}${path}`,{...init,credentials:"include",headers:{...(init.body instanceof FormData?{}:{"Content-Type":"application/json"}),...(init.headers||{})}});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error((data as any).error || "Request failed");
  return data as T;
}
export const api={
  me:()=>request<any>("/api/auth/me"),
  requestMagic:(body:any)=>request<any>("/api/auth/magic-link",{method:"POST",body:JSON.stringify(body)}),
  verifyMagic:(token:string)=>request<any>("/api/auth/verify-magic-link",{method:"POST",body:JSON.stringify({token})}),
  logout:()=>request<any>("/api/auth/logout",{method:"POST"}),
  createProduct:(body:FormData)=>request<any>("/api/products",{method:"POST",body}),
  product:(code:string)=>request<any>(`/api/products/${encodeURIComponent(code)}`),
  products:()=>request<any>("/api/products"),
  createOrder:(body:any)=>request<any>("/api/orders",{method:"POST",body:JSON.stringify(body)}),
  payOrder:(id:string)=>request<any>(`/api/orders/${id}/pay`,{method:"POST"}),
  order:(id:string)=>request<any>(`/api/orders/${id}`),
  sellerDashboard:()=>request<any>("/api/seller/dashboard"),
  sellerProfile:(body:any)=>request<any>("/api/seller/profile",{method:"POST",body:JSON.stringify(body)}),
  payout:(amountCents:number)=>request<any>("/api/seller/payout",{method:"POST",body:JSON.stringify({amountCents})}),
  adminDashboard:()=>request<any>("/api/admin/dashboard"),
  adminOrders:()=>request<any>("/api/admin/orders"),
  subscribe:(phone:string)=>request<any>("/api/subscriptions/start",{method:"POST",body:JSON.stringify({phone})}),
};
export { API_BASE };
