"use client";

import Layout from "@/components/Layout";
import CreatorsGridSkeleton from "@/components/CreatorsGridSkeleton";
import Creator from "./Creator";
import { useState } from "react";
import Filters from "@/components/Filters";
import Select from "@/components/Select";
import { SelectOption } from "@/types/select";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Link from "next/link";
import { useCreators, useIndustries } from "@/hooks/useCreators";

const socialAccountOptions: SelectOption[] = [
    { id: 0, name: "Social account" }, 
    { id: 1, name: "Instagram" }, 
    { id: 2, name: "TikTok" },
    { id: 3, name: "YouTube" },
];
const locationOptions: SelectOption[] = [
    { id: 0, name: "Location" }, 
    { id: 1, name: "United States" }, 
    { id: 2, name: "Canada" },
    { id: 3, name: "United Kingdom" },
];

const ExploreCreatorsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [socialAccount, setSocialAccount] = useState<SelectOption>(socialAccountOptions[0]);
    const [location, setLocation] = useState<SelectOption>(locationOptions[0]);
    const [selectedIndustry, setSelectedIndustry] = useState("All");

    // Use TanStack Query for creators and industries
    const { data: creatorsData, isLoading: creatorsLoading } = useCreators({ 
        search: searchQuery || undefined,
        industry: selectedIndustry === "All" ? undefined : selectedIndustry,
        limit: 100  // Increased limit to show all creators
    });

    const { data: industriesData, isLoading: industriesLoading } = useIndustries();

    const creators = creatorsData?.creators || [];
    const industries = industriesData ? ["All", ...industriesData] : ["All"];
    const loading = creatorsLoading; // Show loading for creators, industries can load separately

    // Create industry options for the select
    const industryOptions: SelectOption[] = industries.map((industry, index) => ({
        id: index,
        name: industry
    }));

    const selectedIndustryOption = industryOptions.find(opt => opt.name === selectedIndustry) || industryOptions[0];

    return (
        <Layout title="">
            <div className="card p-4 md:p-6">
                {/* Search and Filter Bar */}
                <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3 p-3 rounded-xl">
                    <Search
                        className="flex-grow min-w-[200px] sm:flex-grow-0 sm:w-auto md:min-w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search creators by name..."
                        isGray
                    />

                    {industryOptions.length > 1 && (
                        <Select 
                            className="min-w-[160px]"
                            classButton="h-12 !border-n-3 dark:!border-n-5 text-sm !text-n-7 dark:!text-n-1"
                            options={industryOptions}
                            value={selectedIndustryOption} 
                            onChange={(option) => setSelectedIndustry(option.name)} 
                        />
                    )}
                </div>
                
                {loading ? (
                    <CreatorsGridSkeleton />
                ) : creators.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {creators.map((creator) => (
                            <Link key={creator.id} href={`/creators/${creator.id}`} className="block">
                                <Creator value={creator} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="mb-4">
                            <Icon className="mx-auto h-16 w-16 text-gray-400" name="search" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No creators found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {searchQuery || selectedIndustry !== "All" 
                                ? "Try adjusting your search criteria." 
                                : "No creators available at the moment."
                            }
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ExploreCreatorsPage;
