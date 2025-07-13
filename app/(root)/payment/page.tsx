"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { increaseUserCredits } from "@/lib/actions/general.action";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment() {
  const [amount, setAmount] = useState("0");
  const [currency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/currentUser");
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, []);

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderId = await createOrderId();

      const options = {
        key: "rzp_test_3MVVZ9GiOcZ4Qn",
        amount: parseFloat(amount) * 100,
        currency: currency,
        name: "Your Company Name",
        description: "Payment for credits",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify-payment", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });

          const res = await result.json();
          if (res.isOk) {
            await increaseUserCredits(user?.id, parseFloat(amount));
            alert("Payment successful");
          } else {
            alert(res.message);
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <section className="min-h-[94vh] flex flex-col gap-6 h-14 mx-5 sm:mx-10 2xl:mx-auto 2xl:w-[1400px] items-center pt-36">
        <form
          className="flex flex-col gap-6 w-full sm:w-80"
          onSubmit={processPayment}
        >
          <div className="space-y-1">
            <Label>Amount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="1"
                min={5}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" loading={loading} loadingText="Processing...">
            Pay
          </Button>
        </form>
      </section>
    </>
  );
}
