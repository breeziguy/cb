"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RoutePrefetcher = () => {
    const router = useRouter();

    useEffect(() => {
        // Prefetch core routes that users frequently visit
        const coreroutes = [
            '/dashboard',
            '/brief',
            '/creators',
            '/discover',
            '/collab-brief/new',
            '/settings'
        ];

        // Prefetch routes after a small delay to not block initial render
        const timer = setTimeout(() => {
            coreroutes.forEach(route => {
                router.prefetch(route);
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    return null; // This component doesn't render anything
};

export default RoutePrefetcher; 