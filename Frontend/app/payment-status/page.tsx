"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_Id");
  const {removeMany} = useCart();

  const [open, setOpen] = React.useState(true);
  const [status, setStatus] = React.useState<"paid" | "failed" | null>(null);

  React.useEffect(() => {
    async function fetchStatus() {
      if (!orderId) return;
      try {
        const url = sessionId ? `http://localhost:8088/order/payment-status?orderId=${orderId}&session_Id=${sessionId}`:
        `http://localhost:8088/order/payment-status?orderId=${orderId}&status=declined`
        const res = await fetch(url,{credentials:"include"});
        const data = await res.json();
        setStatus(data.status);
        setOpen(true);

        if(data.status === "paid" && data.items){
            const productIds = data.items.map((item:any) => item.product_id)
            removeMany(productIds)
        }
      } catch (err) {
        console.error("Payment check failed", err);
        setStatus("failed");
        setOpen(true);
      }
    }
    fetchStatus();
  }, [orderId, sessionId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {status === "paid" ? "✅ Payment Successful" : "❌ Payment Failed"}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {status === "paid"
            ? "Your payment was successful. Thank you for your order!"
            : "Your payment failed. Please try again."}
        </p>
        <DialogFooter>
          {status === "failed" && (
            <Button
              onClick={() => {
                window.location.href = "/cart";
              }}
            >
              Try Again
            </Button>
          )}
          <Button
            onClick={() => {
              window.location.href = "/orders";
            }}
          >
            View Orders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
