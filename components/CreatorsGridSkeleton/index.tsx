"use client";

const CreatorsGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-b-surface2 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Image area skeleton */}
                    <div className="relative">
                        <div className="w-full h-56 bg-b-surface1 dark:bg-shade-07/20 aspect-square" />
                        {/* Follow button skeleton */}
                        <div className="absolute top-3 right-3 w-10 h-10 bg-b-surface1 dark:bg-shade-07/20 rounded-full" />
                    </div>
                    
                    {/* Content area skeleton */}
                    <div className="p-4 bg-b-surface2 dark:bg-linear-to-b dark:from-[#2A2A2A] dark:to-[#202020] space-y-2">
                        {/* Name skeleton */}
                        <div className="h-5 bg-b-surface1 dark:bg-shade-07/20 rounded w-3/4" />
                        
                        {/* Location skeleton */}
                        <div className="h-3 bg-b-surface1 dark:bg-shade-07/20 rounded w-1/2" />
                        
                        {/* Industry skeleton */}
                        <div className="h-3 bg-b-surface1 dark:bg-shade-07/20 rounded w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CreatorsGridSkeleton; 