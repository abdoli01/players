"use client"

import { Loader } from "lucide-react"

interface FullPageSpinnerProps {
    size?: number
}

export function Spinner({ size = 30 }: FullPageSpinnerProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader
                className="animate-spin text-primary"
                style={{ width: size, height: size }}
            />
        </div>
    )
}
