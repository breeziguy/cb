"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Immediate redirect to dashboard - no loading UI needed
        router.replace('/dashboard');
    }, [router]);

    // Return null for instant redirect - no loading screen
    return null;
}
