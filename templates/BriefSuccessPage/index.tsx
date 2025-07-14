"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

const BriefSuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const creatorName = searchParams.get('creatorName') || 'Creator';
    const briefId = searchParams.get('briefId') || 'BR-' + Date.now();

    useEffect(() => {
        // Auto redirect to dashboard after 10 seconds
        const timer = setTimeout(() => {
            router.push('/');
        }, 10000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Layout title="Brief Submitted Successfully" hideSidebar>
            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
                <div className="max-w-md w-full">
                    {/* Success Card */}
                    <div className="card p-8 text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon name="check" className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>

                        {/* Success Message */}
                        <h1 className="h3 mb-3">Brief Submitted Successfully!</h1>
                        <p className="body1 text-t-secondary mb-6">
                            Your collaboration brief has been sent to <strong>{creatorName}</strong>. 
                            You'll receive a notification once they respond.
                        </p>

                        {/* Brief Details */}
                        <div className="bg-b-surface2 rounded-xl p-4 mb-6 text-left">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-t-secondary">Brief ID</span>
                                <span className="text-sm font-medium">{briefId}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-t-secondary">Creator</span>
                                <span className="text-sm font-medium">{creatorName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-t-secondary">Status</span>
                                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Review</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button 
                                className="w-full"
                                isBlack
                                onClick={() => router.push('/')}
                            >
                                View Brief History
                            </Button>
                            <Button 
                                className="w-full"
                                isWhite
                                                            onClick={() => router.push('/creators')}
                        >
                            View More Creators
                            </Button>
                        </div>

                        {/* Auto redirect notice */}
                        <p className="text-xs text-t-tertiary mt-4">
                            You'll be redirected to your dashboard in 10 seconds
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BriefSuccessPage; 