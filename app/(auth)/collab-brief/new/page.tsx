import { Suspense } from "react";
import CollabBriefFormPage from "@/templates/CollabBriefFormPage";
import { BriefFormSkeleton } from "@/components/Skeleton";

const BriefFormSkeletonWrapper = () => (
    <div className="min-h-screen bg-b-surface1 p-6">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-12 gap-6">
                {/* Left section skeleton */}
                <div className="col-span-8 max-lg:col-span-12">
                    <BriefFormSkeleton />
                </div>
                {/* Right section skeleton */}
                <div className="col-span-4 max-lg:hidden">
                    <div className="space-y-6">
                        <div className="h-32 bg-b-surface1 dark:bg-shade-07/20 rounded-xl animate-pulse"></div>
                        <div className="h-24 bg-b-surface1 dark:bg-shade-07/20 rounded-xl animate-pulse"></div>
                        <div className="h-40 bg-b-surface1 dark:bg-shade-07/20 rounded-xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function Page() {
    return (
        <Suspense fallback={<BriefFormSkeletonWrapper />}>
            <CollabBriefFormPage />
        </Suspense>
    );
} 