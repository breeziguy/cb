"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import { useUserRole } from "@/hooks/useUserRole";
import { getDashboardStats } from "@/lib/dashboard-data";
import { formatNaira } from "@/lib/utils";
import { useNotifications } from '@/contexts/NotificationContext';
import { notificationHelpers } from '@/utils/notifications';

const topUpOptions = [
    {
        id: 1,
        amount: 2000,
        title: "₦2k",
        description: "Quick top-up for small collaborations",
        popular: false,
        features: [
            "Pay for micro-influencer collaborations",
            "Test campaigns with small budgets",
            "Perfect for single posts",
            "Instant wallet credit"
        ]
    },
    {
        id: 2,
        amount: 4000,
        title: "₦4k",
        description: "Most popular amount for mid-tier campaigns",
        popular: true,
        features: [
            "Fund multiple collaborations",
            "Work with mid-tier creators",
            "Perfect for story + post campaigns",
            "Instant wallet credit",
            "Most chosen amount"
        ]
    }
];

const TopUpOptions = () => {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [customAmount, setCustomAmount] = useState("");
    const { session } = useUserRole();
    const { addNotification } = useNotifications();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const stats = await getDashboardStats(session?.user || null);
                setCurrentBalance(stats?.currentBalance || 0);
            } catch (error) {
                console.error("Error fetching balance:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchBalance();
        }
    }, [session]);

    const handleTopUp = (amount: number) => {
        // TODO: Implement Paystack integration
        console.log(`Top up ₦${amount.toLocaleString()}`);
        
        // Add wallet top-up notification
        addNotification(notificationHelpers.walletTopUp(amount));
        
        // TODO: Update wallet balance in database
        // For now, just simulate success
        alert(`Successfully topped up ₦${amount.toLocaleString()}!`);
    };

    return (
        <div className="mb-22 max-md:mb-14">
            <div className="mb-16 text-center max-lg:mb-12 max-md:mb-10 max-md:text-left">
                <div className="max-w-160 mx-auto mb-4 text-h3 max-lg:max-w-120 max-lg:text-h4">
                    Top up your wallet to start collaborating
                </div>
                <div className="max-w-142 mx-auto mb-4 text-[1.125rem] font-medium tracking-[-0.01em] text-t-secondary">
                    Choose an amount to add to your wallet and start sending briefs to creators.
                    All payments are secure and processed instantly.
                </div>
            </div>

            <div className="flex max-md:flex-col max-md:space-y-6">
                {/* Balance Section - Shows first on mobile */}
                <div className="flex-1 pt-15 px-4 pb-10 max-lg:pt-8 max-lg:pb-7 max-md:order-1 max-md:pt-6 max-md:pb-6 relative border border-s-stroke2 rounded-[2.5rem] max-md:rounded-2xl">
                    <div className="absolute top-6 right-6 flex items-center justify-center size-16 pb-0.5 border border-s-stroke2 rounded-full max-lg:top-4 max-lg:right-4 max-lg:size-11 max-md:top-3 max-md:right-3 max-md:size-8">
                        <Icon
                            className="fill-t-secondary max-md:!size-4"
                            name="star-stroke-think"
                        />
                    </div>
                    <div className="mb-8 pl-10 text-h4 max-lg:mb-5 max-lg:pl-5 max-md:text-h5 max-md:pl-6 max-md:mb-4">
                        Balance
                    </div>
                    <div className="mb-8 px-10 py-4 border rounded-xl max-lg:mb-3 max-lg:p-3 max-md:px-6 max-md:py-3 max-md:mb-4 border-s-stroke2 shadow-depth">
                        <div className="flex items-center mb-5 max-md:mb-3">
                            <div className="shrink-0 text-h2 max-md:text-h3">
                                {loading ? "..." : formatNaira(currentBalance, true)}
                            </div>
                            <div className="grow pl-3 text-body-2 text-t-secondary max-md:text-body-3">
                                Available for collaborations
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 px-10 max-lg:pl-5 max-lg:pr-0">
                        <div className="flex items-center gap-4 max-lg:gap-2 max-lg:text-body-2">
                            <Icon
                                className="fill-t-primary"
                                name="check-circle-fill"
                            />
                            <div>Current wallet balance</div>
                        </div>
                        <div className="flex items-center gap-4 max-lg:gap-2 max-lg:text-body-2">
                            <Icon
                                className="fill-t-primary"
                                name="check-circle-fill"
                            />
                            <div>Ready for instant use</div>
                        </div>
                    </div>
                </div>

                {/* Add Credits Section with Different Amounts */}
                <div className="flex-1 pt-15 px-4 pb-10 max-lg:pt-8 max-lg:pb-7 max-md:order-2 max-md:pt-6 max-md:pb-6">
                    <div className="mb-8 pl-10 text-h4 max-lg:mb-5 max-lg:pl-5 max-md:text-h5 max-md:pl-8 max-md:mb-4">
                        Add Credits
                    </div>
                    
                    {/* ₦2k Card */}
                    <div className="mb-4 px-10 py-4 border rounded-xl max-lg:mb-3 max-lg:p-3 max-md:px-8 max-md:py-4 border-s-subtle">
                        <div className="flex items-center mb-3 max-md:mb-2">
                            <div className="shrink-0 text-h2 max-md:text-h3">
                                ₦2K
                            </div>
                            <div className="grow pl-3 text-body-2 text-t-secondary max-md:text-body-3">
                                Small collaborations
                            </div>
                        </div>
                        <Button 
                            className="w-full"
                            isBlack
                            onClick={() => handleTopUp(2000)}
                        >
                            Top Up ₦2,000
                        </Button>
                    </div>

                    {/* ₦4k Card */}
                    <div className="mb-4 px-10 py-4 border rounded-xl max-lg:mb-3 max-lg:p-3 max-md:px-8 max-md:py-4 border-s-subtle">
                        <div className="flex items-center mb-3 max-md:mb-2">
                            <div className="shrink-0 text-h2 max-md:text-h3">
                                ₦4K
                            </div>
                            <div className="grow pl-3 text-body-2 text-t-secondary max-md:text-body-3">
                                Mid-tier campaigns
                            </div>
                        </div>
                        <Button 
                            className="w-full"
                            isBlack
                            onClick={() => handleTopUp(4000)}
                        >
                            Top Up ₦4,000
                        </Button>
                    </div>

                    {/* ₦6k Card */}
                    <div className="mb-4 px-10 py-4 border rounded-xl max-lg:mb-3 max-lg:p-3 max-md:px-8 max-md:py-4 border-s-subtle">
                        <div className="flex items-center mb-3 max-md:mb-2">
                            <div className="shrink-0 text-h2 max-md:text-h3">
                                ₦6K
                            </div>
                            <div className="grow pl-3 text-body-2 text-t-secondary max-md:text-body-3">
                                Premium campaigns
                            </div>
                        </div>
                        <Button 
                            className="w-full"
                            isBlack
                            onClick={() => handleTopUp(6000)}
                        >
                            Top Up ₦6,000
                        </Button>
                    </div>

                    {/* Custom Amount Card */}
                    <div className="mb-4 px-10 py-4 border rounded-xl max-lg:mb-3 max-lg:p-3 max-md:px-8 max-md:py-4 border-s-subtle">
                        <div className="flex items-center mb-3 max-md:mb-2">
                            <div className="shrink-0 text-h2 max-md:text-h3">
                                Custom
                            </div>
                            <div className="grow pl-3 text-body-2 text-t-secondary max-md:text-body-3">
                                Enter your amount
                            </div>
                        </div>
                        <div className="mb-3">
                            <Field
                                type="number"
                                placeholder="Minimum ₦500"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                min="500"
                            />
                        </div>
                        <Button 
                            className="w-full"
                            isBlack
                            disabled={!customAmount || parseInt(customAmount) < 500}
                            onClick={() => {
                                if (customAmount && parseInt(customAmount) >= 500) {
                                    handleTopUp(parseInt(customAmount));
                                    setCustomAmount("");
                                }
                            }}
                        >
                            {customAmount && parseInt(customAmount) >= 500 
                                ? `Top Up ₦${parseInt(customAmount).toLocaleString()}` 
                                : "Top Up"
                            }
                        </Button>
                    </div>
                    
                    <div className="flex flex-col gap-4 px-10 max-lg:pl-5 max-lg:pr-0 max-md:px-8 mt-8">
                        {topUpOptions[0].features.map((feature, index) => (
                            <div
                                className="flex items-center gap-4 max-lg:gap-2 max-lg:text-body-2"
                                key={index}
                            >
                                <Icon
                                    className="fill-t-secondary/50"
                                    name="check-circle-fill"
                                />
                                <div className="">{feature}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopUpOptions; 