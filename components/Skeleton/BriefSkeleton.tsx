import React from 'react';
import Skeleton from './index';

const BriefSkeleton = () => {
    return (
        <div className="p-4 border-b border-s-subtle">
            <div className="flex items-start gap-3">
                <Skeleton 
                    width="w-3 h-3" 
                    height="h-3" 
                    rounded 
                    className="mt-2 flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <Skeleton width="w-24" height="h-3" />
                        <Skeleton width="w-16" height="h-3" />
                    </div>
                    <Skeleton width="w-40" height="h-4" className="mb-2" />
                    <Skeleton lines={2} height="h-3" />
                </div>
            </div>
        </div>
    );
};

export const BriefListSkeleton = () => {
    return (
        <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, index) => (
                <BriefSkeleton key={index} />
            ))}
        </div>
    );
};

export default BriefSkeleton; 