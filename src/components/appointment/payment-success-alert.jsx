"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { handleConfirmedAppointment } from "@/app/actions/book-appointment";

function AlertContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });

    const isSuccess = searchParams.get("payment_success");
    const appointmentId = searchParams.get("appointmentId");

    if (isSuccess === "true" && appointmentId) {
      // Manual trigger for DB update if Webhook isn't used
      handleConfirmedAppointment(appointmentId).then((res) => {
        if (res.success) {
          Toast.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your appointment is now confirmed.",
          });
        } else {
          // If the action returns an error
          Toast.fire({
            icon: "error",
            title: "Update Failed",
            text: res.error || "Could not update payment status.",
          });
        }
      });

      // Clean the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (searchParams.get("payment_canceled")) {
      Toast.fire({
        icon: "error",
        title: "Payment Canceled",
        text: "Please try again.",
      });
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

  return null;
}

export default function PaymentSuccessAlert() {
  return (
    <Suspense fallback={null}>
      <AlertContent />
    </Suspense>
  );
}