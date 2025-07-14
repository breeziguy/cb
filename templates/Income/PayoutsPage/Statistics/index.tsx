"use client";

import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import { getDashboardStats, DashboardStats } from "@/lib/dashboard-data";
import { useSession } from "@supabase/auth-helpers-react";
import { formatNaira } from "@/lib/utils";

const Statistics = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const session = useSession();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const dashboardStats = await getDashboardStats(session?.user || null);
                console.log('Dashboard stats received in component:', dashboardStats);
                setStats(dashboardStats);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [session]);

    // Dashboard statistics configuration
    const statisticsConfig = [
        {
            id: 1,
            title: "Current balance",
            icon: "wallet",
            tooltip: "Your current wallet balance available for collaborations",
            value: stats?.currentBalance || 0,
            isPrice: true,
        },
        {
            id: 2,
            title: "Total briefs sent",
            icon: "message",
            tooltip: "Total number of collaboration briefs you have sent to creators",
            value: stats?.totalBriefsSent || 0,
            isPrice: false,
        },
        {
            id: 3,
            title: "Creators favorited",
            icon: "profile",
            tooltip: "Number of creators you have saved to your favorites",
            value: stats?.totalCreatorsFavorited || 0,
            isPrice: false,
        },
        {
            id: 4,
            title: "Pending briefs",
            icon: "arrow",
            tooltip: "Number of briefs awaiting creator response",
            value: stats?.pendingBriefs || 0,
            isPrice: false,
        },
    ];

    if (loading) {
        return (
            <div className="card">
                <div className="flex gap-8 p-5 max-2xl:gap-6 max-lg:p-3 max-md:flex-col">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex-1 pr-6 border-r border-shade-07/10 last:border-0 max-4xl:nth-3:hidden max-lg:nth-2:hidden max-md:pr-0 max-md:border-r-0 max-md:border-b max-md:pb-6 max-md:last:pb-0"
                        >
                            <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-b-surface1 max-md:mb-4">
                                <div className="w-6 h-6 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                            </div>
                            <div className="mb-2">
                                <div className="w-24 h-4 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                            </div>
                            <div className="w-16 h-8 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex gap-8 p-5 max-2xl:gap-6 max-lg:p-3 max-md:flex-col">
                {statisticsConfig.map((item) => (
                    <div
                        className="flex-1 pr-6 border-r border-shade-07/10 last:border-0 max-4xl:nth-3:hidden max-lg:nth-2:hidden max-md:pr-0 max-md:border-r-0 max-md:border-b max-md:pb-6 max-md:last:pb-0"
                        key={item.id}
                    >
                        <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-b-surface1 max-md:mb-4">
                            <Icon
                                className={`fill-t-primary ${
                                    item.title === "Pending briefs"
                                        ? "-rotate-45"
                                        : ""
                                }`}
                                name={item.icon}
                            />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-sub-title-1">{item.title}</div>
                            <Tooltip content={item.tooltip} large />
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="flex">
                                {item.isPrice ? (
                                    <div className="text-h2 max-xl:text-h3 max-lg:text-h2 max-md:text-h3">
                                        {formatNaira(item.value, true)}
                                    </div>
                                ) : (
                                    <NumericFormat
                                        className="text-h2 max-xl:text-h3 max-lg:text-h2 max-md:text-h3"
                                        value={item.value}
                                        thousandSeparator=","
                                        decimalScale={0}
                                        fixedDecimalScale
                                        displayType="text"
                                    />
                                )}
                            </div>
                            {item.title === "Current balance" && (
                                <Button 
                                    className="!text-xs !h-8 !px-3"
                                    isBlack
                                    href="/wallet/top-up"
                                >
                                    <Icon name="plus" className="w-3 h-3 mr-1" />
                                    Top Up
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;
