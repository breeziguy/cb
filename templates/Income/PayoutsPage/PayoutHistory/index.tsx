"use client";

import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import Search from "@/components/Search";
import Tabs from "@/components/Tabs";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Image from "@/components/Image";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import { getBriefHistory, BriefHistoryItem } from "@/lib/dashboard-data";
import { useSession } from "@supabase/auth-helpers-react"; // Import useSession

// import { payoutHistory } from "@/mocks/payouts"; // Comment out or remove old mock import
// import { mockBriefs, Brief } from "@/mocks/briefs"; // Import new mock briefs

// const sortOptions = [
//     { id: 1, name: "All" },
//     { id: 2, name: "Pending" },
//     { id: 3, name: "Paid" },
// ];

// Status label mapping for consistent UI display
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

// const tableHead = [
//     "Date",
//     "Status",
//     "Method",
//     "Transaction ID",
//     "Amount",
//     "Fees",
//     "Net",
// ];
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
            className="!h-12 !px-6"
                                    href="/creators"
        >
            Browse Creators
        </Button>
    </div>
);

const BriefHistory = () => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(briefSortOptions[0]);
    const [briefs, setBriefs] = useState<BriefHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const session = useSession(); // Get session

    useEffect(() => {
        const fetchBriefs = async () => {
            if (session === undefined) return; // Wait for session to load
            try {
                // Pass session.user to getBriefHistory
                const briefData = await getBriefHistory(session?.user || null); 
                setBriefs(briefData);
            } catch (error) {
                console.error('Error fetching brief history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBriefs();
    }, [session]); // Add session to dependency array

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
        if (dbValue === "all") { // All Briefs
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

export default BriefHistory;
