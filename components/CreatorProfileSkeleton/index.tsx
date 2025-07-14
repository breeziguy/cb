"use client";

import Layout from "@/components/Layout";

const CreatorProfileSkeleton = () => {
    return (
        <Layout title=" ">
            <div className="flex max-lg:block animate-pulse">
                <div className="grow space-y-5">
                    {/* Creator details skeleton */}
                    <div className="card p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="relative shrink-0 self-center sm:self-start">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-b-surface1 dark:bg-shade-07/20 rounded-full" />
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-b-surface1 dark:bg-shade-07/20 rounded-full" />
                            </div>
                            <div className="text-center sm:text-left flex-grow w-full">
                                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4">
                                    <div className="h-8 bg-b-surface1 dark:bg-shade-07/20 rounded w-48 mb-2 sm:mb-0" />
                                    <div className="w-10 h-10 bg-b-surface1 dark:bg-shade-07/20 rounded-full hidden sm:block" />
                                </div>
                                <div className="space-y-2 mb-6 px-2 sm:px-0">
                                    <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-full" />
                                    <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-5/6" />
                                    <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-4/6" />
                                </div>
                                <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded w-full sm:w-48" />
                            </div>
                        </div>
                    </div>

                    {/* Media skeleton */}
                    <div className="card p-4 sm:p-6">
                        <div className="h-6 bg-b-surface1 dark:bg-shade-07/20 rounded w-20 mb-4" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden bg-b-surface1 dark:bg-shade-07/20" style={{ aspectRatio: '9/16', height: '300px' }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-[23.125rem] shrink-0 ml-5 space-y-5 max-lg:w-full max-lg:ml-0 max-lg:mt-5">
                    {/* About skeleton */}
                    <div className="card p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-6 bg-b-surface1 dark:bg-shade-07/20 rounded w-16" />
                            <div className="w-10 h-10 bg-b-surface1 dark:bg-shade-07/20 rounded-full" />
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-full" />
                            <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-3/4" />
                            <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-5/6" />
                        </div>
                        <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-24 mb-3" />
                        <div className="flex flex-wrap gap-2">
                            <div className="h-6 bg-b-surface1 dark:bg-shade-07/20 rounded-full w-20" />
                            <div className="h-6 bg-b-surface1 dark:bg-shade-07/20 rounded-full w-16" />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreatorProfileSkeleton; 