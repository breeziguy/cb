import React from 'react';
import Skeleton from './index';

const BriefDetailsSkeleton = () => {
    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center px-4 py-3.5 border border-s-subtle rounded-[1.25rem] mb-6">
                <Skeleton width="w-12 h-12" height="h-12" rounded className="flex-shrink-0" />
                <div className="grow pl-5">
                    <div className="flex items-center gap-3 mb-2">
                        <Skeleton width="w-32" height="h-5" />
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Skeleton width="w-4 h-4" height="h-4" />
                            <Skeleton width="w-20" height="h-3" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton width="w-4 h-4" height="h-4" />
                            <Skeleton width="w-16" height="h-3" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages Section */}
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex p-4" key={index}>
                        <Skeleton width="w-12 h-12" height="h-12" rounded className="flex-shrink-0" />
                        <div className="grow pl-5 pr-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Skeleton width="w-24" height="h-4" />
                                <Skeleton width="w-16" height="h-3" />
                            </div>
                            <Skeleton lines={3} height="h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BriefDetailsSkeleton; 