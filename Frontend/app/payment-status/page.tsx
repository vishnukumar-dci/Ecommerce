// "use client";
// import * as React from "react";
// import { useSearchParams } from "next/navigation";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/lib/store/cart";

// export default function PaymentResultPage() {
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get("session_Id");
//   const {removeMany} = useCart();

//   const [open, setOpen] = React.useState(true);
//   const [status, setStatus] = React.useState<"paid" | "failed" | null>(null);

//   React.useEffect(() => {
//     async function fetchStatus() {
//       if (!sessionIdId) return;
//       try {
//         const url = sessionId ? `http://localhost:8088/order/payment-status?&session_Id=${sessionId}:`
//         const res = await fetch(url,{credentials:"include"});
//         const data = await res.json();
//         setStatus(data.status);
//         setOpen(true);

//         if(data.status === "paid" && data.items){
//             const productIds = data.items.map((item:any) => item.product_id)
//             removeMany(productIds)
//         }
//       } catch (err) {
//         console.error("Payment check failed", err);
//         setStatus("failed");
//         setOpen(true);
//       }
//     }
//     fetchStatus();
//   }, [orderId, sessionId]);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {status === "paid" ? "✅ Payment Successful" : "❌ Payment Failed"}
//           </DialogTitle>
//         </DialogHeader>
//         <p className="mt-2">
//           {status === "paid"
//             ? "Your payment was successful. Thank you for your order!"
//             : "Your payment failed. Please try again."}
//         </p>
//         <DialogFooter>
//           {status === "failed" && (
//             <Button
//               onClick={() => {
//                 window.location.href = "/cart";
//               }}
//             >
//               Try Again
//             </Button>
//           )}
//           <Button
//             onClick={() => {
//               window.location.href = "/orders";
//             }}
//           >
//             View Orders
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { api } from "@/lib/api";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const cancel = searchParams.get("status");
  const { removeMany } = useCart();

  const [status, setStatus] = React.useState<"paid" | "failed" | "pending" | "cancelled" | null>(null);
  const [amount, setAmount] = React.useState<number | null>(null);
  const [dateTime, setDateTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!orderId) return;

    let interval: number;

    const fetchStatus = async () => {
      try {
        // Handle cancel redirect immediately
        if (cancel === "cancelled") {
          setStatus("cancelled");
          clearInterval(interval);
          const data = await api.updateStatus(Number(orderId))
          return;
        }

        const data = await api.updateOrder(Number(orderId));

        if (data.payment_status) {

          setStatus(data.payment_status as "paid" | "failed" | "pending");

          setAmount(data.amount ? parseFloat(data.amount) : null);

          setDateTime(data.created_at || new Date().toISOString());

          if (data.payment_status === "paid" && data.items) {
            const productIds = data.items.map((item: any) => item.product_id);
            removeMany(productIds);
          }

          if (data.payment_status !== "pending") clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching order status:", err);
        setStatus("failed");
        clearInterval(interval);
      }
    };

    interval = window.setInterval(fetchStatus, 2000);
    fetchStatus(); 

    return () => clearInterval(interval);
  }, [orderId, cancel, removeMany]);

  const handleRedirect = (path: string) => {
    window.location.href = path;
  };

  if (status === null || status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Checking payment status…
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        {/* Status Icon */}
        {status === "paid" ? (
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100">
            <span className="text-3xl text-green-600">✔</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100">
            <span className="text-3xl text-red-600">✖</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold mt-4">
          {status === "paid"
            ? "Payment Successful"
            : status === "cancelled"
            ? "Payment Cancelled"
            : "Payment Failed"}
        </h1>

        {/* Message */}
        <p className="mt-2 text-gray-600">
          {status === "paid" &&
            "Thank you for your payment. Your order is being processed."}
          {status === "cancelled" &&
            "Your payment was cancelled. No amount has been deducted."}
          {status === "failed" &&
            "Your payment could not be completed. Please try again with a different payment method."}
        </p>

        {/* Details (only for paid) */}
        {status === "paid" && (
          <div className="mt-6 border-t pt-4 text-left space-y-3">
            {amount !== null && (
              <p>
                <span className="font-semibold">Amount Paid:</span>{" "}
                <span className="text-gray-800">₹{amount}</span>
              </p>
            )}
            {dateTime && (
              <p>
                <span className="font-semibold">Date & Time:</span>{" "}
                <span className="text-gray-800">
                  {new Date(dateTime).toLocaleString()}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
          {status === "paid" ? (
            <button
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900"
              onClick={() => handleRedirect("/orders")}
            >
              View Order History
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => handleRedirect("/products")}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
