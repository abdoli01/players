"use client";

import { useEffect, useState } from "react";
import { Step } from "./types";

import PhoneStep from "./components/PhoneStep";
import LoginStep from "./components/LoginStep";
import VerifyStep from "./components/VerifyStep";
import RegisterStep from "./components/RegisterStep";
import ResetPasswordStep from "./components/ResetPasswordStep";
import AssignPlayerStep from "./components/AssignPlayerStep";

const AUTH_WIZARD_KEY = "auth_wizard_state";

interface WizardState {
    step: Step;
    phone: string;
    userMeta: {
        exists?: boolean;
        hasPlayerAssignment?: boolean;
    } | null;
}

export default function LoginPage() {
    // 🔹 wizard state
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [userMeta, setUserMeta] = useState<WizardState["userMeta"]>(null);

    // 🔹 hydration gate (برای جلوگیری از flicker)
    const [hydrated, setHydrated] = useState(false);

    // ======================================
    // 1️⃣ Restore wizard state after refresh
    // ======================================
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(AUTH_WIZARD_KEY);

            if (saved) {
                const parsed: WizardState = JSON.parse(saved);

                setStep(parsed.step ?? "phone");
                setPhone(parsed.phone ?? "");
                setUserMeta(parsed.userMeta ?? null);
            }
        } catch (e) {
            console.error("Failed to restore auth wizard state", e);
            sessionStorage.removeItem(AUTH_WIZARD_KEY);
        } finally {
            setHydrated(true); // ✅ restore finished
        }
    }, []);

    // ======================================
    // 2️⃣ Persist wizard state on change
    // ======================================
    useEffect(() => {
        if (!hydrated) return;

        const state: WizardState = {
            step,
            phone,
            userMeta,
        };

        sessionStorage.setItem(AUTH_WIZARD_KEY, JSON.stringify(state));
    }, [step, phone, userMeta, hydrated]);

    // const handleEdit = () => {
    //     // setPhone("");
    //     setUserMeta(null);
    //     setStep("phone");
    // };

    // ======================================
    // 3️⃣ Prevent UI flicker before restore
    // ======================================
    if (!hydrated) {
        return null;
        // یا اگر خواستی:
        // return <FullPageLoader />
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-6 border rounded-xl shadow bg-card">

                {step === "phone" && (
                    <PhoneStep
                        phone={phone}
                        setPhone={setPhone}
                        setUserMeta={setUserMeta}
                        setStep={setStep}
                    />
                )}

                {step === "login" && userMeta && (
                    <LoginStep
                        userMeta={userMeta}
                        phone={phone}
                        setStep={setStep}
                    />
                )}

                {step === "verify" && userMeta && (
                    <VerifyStep
                        userMeta={userMeta}
                        setStep={setStep}
                    />
                )}

                {step === "register" && (
                    <RegisterStep
                        phone={phone}
                        setStep={setStep}
                    />
                )}

                {step === "reset-password" && userMeta && (
                    <ResetPasswordStep
                        userMeta={userMeta}
                        phone={phone}
                        setStep={setStep}
                    />
                )}

                {step === "assign-player" && (
                    <AssignPlayerStep />
                )}

            </div>
        </div>
    );
}
