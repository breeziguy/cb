'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { session, loading } = useUserRole();
    const router = useRouter();

    useEffect(() => {
        // Only redirect if we're done loading and have no session
        if (!loading && !session) {
            router.push('/auth/login');
        }
    }, [session, loading, router]);

    // Show skeleton loading state while loading or redirecting
    if (loading || !session) {
        return (
            <div className="min-h-screen bg-b-surface1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-b-surface1 dark:bg-shade-07/20 rounded-full mx-auto animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-32 mx-auto animate-pulse"></div>
                        <div className="h-3 bg-b-surface1 dark:bg-shade-07/20 rounded w-24 mx-auto animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Return the children directly - no extra wrapper divs to maintain existing designs
    return <>{children}</>;
} 