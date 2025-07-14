"use client";

import { useState, useEffect } from "react";
import { useMedia } from "react-use";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Button from "@/components/Button";
import BriefMessage from "./BriefMessage";
import BriefDetails from "./BriefDetails";
import { BriefListSkeleton } from "@/components/Skeleton/BriefSkeleton";
import BriefDetailsSkeleton from "@/components/Skeleton/BriefDetailsSkeleton";
import { useBriefs, BriefType } from "@/hooks/useBriefs";

const BriefMessagesPage = () => {
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);
    const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
    const isMobile = useMedia("(max-width: 767px)");

    const { data: briefs = [], isLoading: loading } = useBriefs();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isMobile && briefs.length > 0 && !activeBriefId) {
            setActiveBriefId(briefs[0].id);
            }
    }, [isMobile, briefs, activeBriefId]);


    if (!mounted) return null;

    const filteredBriefs = briefs.filter(brief => 
        brief.title.toLowerCase().includes(search.toLowerCase()) ||
        brief.creator?.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Get the active brief object
    const activeBrief = activeBriefId ? briefs.find(brief => brief.id === activeBriefId) || null : null;

    return (
        <Layout title="">
            <div className="card p-0 overflow-hidden">
                <div className="flex max-md:block max-md:p-3">
                    <div
                        className={`shrink-0 w-126 max-4xl:w-106 max-3xl:w-96 p-3 pb-0 max-2xl:w-76 max-md:w-full max-md:p-0 ${
                            activeBriefId === null
                                ? "max-md:block"
                                : "max-md:hidden"
                        }`}
                    >
                        <Search
                            className="mb-3"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search briefs"
                            isGray
                        />
                        {loading ? (
                            <BriefListSkeleton />
                        ) : (
                            <div className="flex flex-col gap-1 h-[calc(100svh-11.25rem)] pb-3 overflow-y-auto scrollbar-none max-md:h-auto max-lg:gap-0">
                                {filteredBriefs.length > 0 ? (
                                    filteredBriefs.map((brief) => (
                                        <BriefMessage
                                            key={brief.id}
                                            value={brief}
                                            isActive={activeBriefId === brief.id}
                                            onClick={() =>
                                                setActiveBriefId(brief.id)
                                            }
                                        />
                                    ))
                                ) : (
                                    <div className="pt-16 text-center max-md:pb-24">
                                        <div className="mb-6 text-h5">
                                            {search ? "No results found" : "No briefs found"}
                                        </div>
                                        <Button
                                            isStroke
                                            as="link"
                                            href="/collab-brief/new"
                                        >
                                            {search ? "Create a brief" : "Create your first brief"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div
                        className={`flex flex-col w-[calc(100%-31.5rem)] p-3 pl-6 max-4xl:w-[calc(100%-26.5rem)] max-3xl:w-[calc(100%-24rem)] h-[calc(100svh-6.75rem)] py-3 overflow-y-auto scrollbar-none max-2xl:w-[calc(100%-19rem)] max-lg:pl-3 max-md:block max-md:w-full max-md:h-auto max-md:p-0 ${
                            activeBriefId !== null
                                ? "max-md:block"
                                : "max-md:hidden"
                        }`}
                    >
                        {/* Mobile Back Button - only show on mobile */}
                        <div className="hidden max-md:flex items-center p-3 mb-3 border-b border-s-subtle">
                            <Button
                                className="mr-3"
                                icon="arrow"
                                isStroke
                                isCircle
                                onClick={() => setActiveBriefId(null)}
                            />
                            <div className="text-h6">Brief Details</div>
                        </div>
                        {loading ? (
                            <BriefDetailsSkeleton />
                        ) : activeBrief ? (
                            <BriefDetails brief={activeBrief} />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-h5 mb-2">Select a brief</div>
                                    <div className="text-t-secondary">Choose a brief from the list to view details</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BriefMessagesPage; 