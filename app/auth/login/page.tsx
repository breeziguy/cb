"use client";

import Login from "@/components/Login";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-b-surface1 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <Login />
                </div>
            </div>
        </div>
    );
} 