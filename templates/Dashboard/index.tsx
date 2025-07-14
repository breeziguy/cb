"use client";

import { useState } from "react";
import { NumericFormat } from "react-number-format";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import Search from "@/components/Search";
import Tabs from "@/components/Tabs";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import { formatNaira } from "@/lib/utils";
import { useDashboardStats, useBriefHistory } from "@/hooks/useDashboard";

// Statistics Component using TanStack Query
const Statistics = () => {
    const { data: stats, isLoading: loading } = useDashboardStats();

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
                                    as="link"
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

// PayoutHistory Component (BriefHistory) using TanStack Query
const statusLabels = {
    pending: "Pending",
    sent_to_creator: "Sent to Creator", 
    accepted: "Accepted",
    rejected: "Rejected",
    completed: "Completed",
};

const briefSortOptions = [
    { id: 1, name: "All" },
    { id: 2, name: "Pending" },
    { id: 3, name: "Sent to Creator" },
    { id: 4, name: "Accepted" },
    { id: 5, name: "Rejected" },
    { id: 6, name: "Completed" },
];

// Mapping from UI display names to DB values
const statusToDbValue = {
    "All": "all",
    "Pending": "pending",
    "Sent to Creator": "sent_to_creator",
    "Accepted": "accepted",
    "Rejected": "rejected",
    "Completed": "completed",
};

const briefTableHead = [
    "Submission Date",
    "Creator",
    "Campaign Title",
    "Budget",
    "Status",
];

// Custom Empty State Component
const BriefEmptyState = () => (
    <div className="pt-26 pb-32 text-center max-md:py-16">
        <div className="inline-block mb-2 text-h4">No briefs found</div>
        <div className="text-sub-title-1 text-t-tertiary mb-8">
            You haven't sent any collaboration briefs yet. Start by discovering creators and sending your first brief.
        </div>
        <Button
            className="shrink-0"
            as="link"
            href="/creators"
        >
            Discover Creators
        </Button>
    </div>
);

const BriefHistory = () => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(briefSortOptions[0]);

    // Use TanStack Query for brief history
    const { data: briefs = [], isLoading: loading } = useBriefHistory();

    // Function to get status label style
    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "accepted":
                return "label-green";
            case "pending":
                return "label-yellow";
            case "sent_to_creator":
                return "label-blue";
            case "rejected":
                return "label-red";
            case "completed":
                return "label-green";
            default:
                return "label-gray";
        }
    };

    // Function to format status for display using the status labels map
    const formatStatus = (status: string): string => {
        const dbValue = status.toLowerCase() as keyof typeof statusLabels;
        return statusLabels[dbValue] || status;
    };

    const filteredBriefs = briefs.filter(brief => {
        const searchTerm = search.toLowerCase();
        const matchesSearch = 
            brief.campaignTitle.toLowerCase().includes(searchTerm) ||
            (brief.creatorName && brief.creatorName.toLowerCase().includes(searchTerm));

        const dbValue = statusToDbValue[sort.name as keyof typeof statusToDbValue];
        if (dbValue === "all") {
            return matchesSearch;
        }
        return matchesSearch && brief.status.toLowerCase() === dbValue.toLowerCase();
    });

    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center max-md:h-12">
                    <div className="pl-5 text-h6 max-lg:pl-3 max-md:mr-auto">
                        Brief History
                    </div>
                    <div className="ml-6 mr-auto">
                        <div className="w-70 h-10 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse max-lg:w-64" />
                    </div>
                </div>
                <div className="p-1 pt-6 max-md:pt-3 max-lg:px-0">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center p-4 space-x-4">
                                <div className="w-24 h-4 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                                <div className="w-32 h-4 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                                <div className="w-40 h-4 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                                <div className="w-20 h-4 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                                <div className="w-16 h-6 rounded bg-b-surface1 dark:bg-shade-07/20 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Show empty state only if there are no briefs at all (not just filtered results)
    if (briefs.length === 0) {
        return (
            <div className="card">
                <div className="flex items-center max-md:h-12">
                    <div className="pl-5 text-h6 max-lg:pl-3 max-md:mr-auto">
                        Brief History
                    </div>
                </div>
                <BriefEmptyState />
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center max-md:h-12">
                <div className="pl-5 text-h6 max-lg:pl-3 max-md:mr-auto">
                    Brief History
                </div>
                <Search
                    className="w-70 ml-6 mr-auto max-lg:w-64 max-lg:ml-4 max-md:hidden"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search briefs..."
                    isGray
                />
                <>
                    <Tabs
                        className="max-md:hidden"
                        items={briefSortOptions}
                        value={sort}
                        setValue={setSort}
                    />
                    <Dropdown
                        className="hidden max-md:block"
                        items={briefSortOptions}
                        value={sort}
                        setValue={setSort}
                    />
                </>
            </div>
            {filteredBriefs.length === 0 ? (
                <div className="pt-16 pb-20 text-center">
                    <div className="text-h6 mb-2">No matching briefs</div>
                    <div className="text-sub-title-1 text-t-tertiary">
                        Try adjusting your search or filter criteria.
                    </div>
                </div>
            ) : (
                <div className="p-1 pt-6 max-md:pt-3 max-lg:px-0">
                    <Table
                        cellsThead={briefTableHead.map((head) => (
                            <th
                                className="!h-12.5 last:text-right max-lg:nth-4:hidden max-lg:nth-6:hidden max-md:nth-3:hidden max-md:nth-5:hidden"
                                key={head}
                            >
                                {head}
                            </th>
                        ))}
                        isMobileVisibleTHead
                    >
                        {filteredBriefs.map((brief) => (
                            <TableRow key={brief.id}>
                                <td className="max-md:text-caption">
                                    {brief.submissionDate}
                                </td>
                                <td>
                                    <div className="flex items-center">
                                        {brief.creatorName ? (
                                            <>
                                                <div className="mr-2 shrink-0">
                                                    <div className="size-7 rounded-full bg-shade-07/20 flex items-center justify-center text-xs">
                                                        {brief.creatorName.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                {brief.creatorName}
                                            </>
                                        ) : (
                                            <span className="text-shade-07/60">No creator assigned</span>
                                        )}
                                    </div>
                                </td>
                                <td className="max-md:hidden">
                                    {brief.campaignTitle}
                                </td>
                                <td className="max-md:hidden">
                                    <NumericFormat
                                        value={brief.budget}
                                        thousandSeparator=","
                                        decimalScale={2}
                                        fixedDecimalScale
                                        displayType="text"
                                        prefix="₦"
                                    />
                                </td>
                                <td>
                                    <div
                                        className={`label whitespace-nowrap ${
                                            getStatusClass(brief.status)
                                        }`}
                                    >
                                        {formatStatus(brief.status)}
                                    </div>
                                </td>
                            </TableRow>
                        ))}
                    </Table>
                </div>
            )}
        </div>
    );
};

// Main Dashboard Component
const DashboardPage = () => {
    return (
        <Layout title="">
            <Statistics />
            <BriefHistory />
        </Layout>
    );
};

export default DashboardPage;