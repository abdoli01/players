"use client";

import { useState } from "react";
import PhoneStep from "./components/PhoneStep";
import VerifyStep from "./components/VerifyStep";
import RegisterStep from "./components/RegisterStep";

export default function LoginPage() {
    const [step, setStep] = useState<"phone" | "verify" | "register">("phone");

    const [phone, setPhone] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-6 border rounded-xl shadow-sm bg-card">
                {step === "phone" && (
                    <PhoneStep
                        phone={phone}
                        setPhone={setPhone}
                        setStep={setStep}
                        setIsRegistered={setIsRegistered}
                    />
                )}

                {step === "verify" && (
                    <VerifyStep
                        phone={phone}
                        token={token}
                        setToken={setToken}
                        isRegistered={isRegistered}
                        setStep={setStep}
                    />
                )}

                {step === "register" && (
                    <RegisterStep phone={phone} />
                )}
            </div>
        </div>
    );
}
