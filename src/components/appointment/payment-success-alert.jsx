"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AlertContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("payment_success")) {
            alert("Payment successful! Your appointment has been confirmed. You will receive an email and Google Calendar invite shortly.");

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
