"use client";


import { useState } from "react";
import { Step } from "./types";
import PhoneStep from "./components/PhoneStep";
import LoginStep from "./components/LoginStep";
import VerifyStep from "./components/VerifyStep";
import RegisterStep from "./components/RegisterStep";
import ResetPasswordStep from "./components/ResetPasswordStep";
import AssignPlayerStep from "./components/AssignPlayerStep";


export default function LoginPage() {
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [userMeta, setUserMeta] = useState<{
        exists?: boolean;
        hasPlayerAssignment?: boolean;
    } | null>(null);


    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-6 border rounded-xl shadow bg-card">
                {step === "phone" && (
                    <PhoneStep setPhone={setPhone} setUserMeta={setUserMeta} setStep={setStep} />
                )}


                {step === "login" && userMeta && (
                    <LoginStep userMeta={userMeta} setStep={setStep} />
                )}


                {step === "verify" && userMeta && (
                    <VerifyStep userMeta={userMeta} setStep={setStep} />
                )}


                {step === "register" && (
                    <RegisterStep phone={phone} setStep={setStep} />
                )}


                {step === "reset-password" && userMeta && (
                    <ResetPasswordStep userMeta={userMeta} setStep={setStep} />
                )}


                {step === "assign-player" && <AssignPlayerStep />}
            </div>
        </div>
    );
}