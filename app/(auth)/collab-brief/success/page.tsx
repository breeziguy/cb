import { Suspense } from "react";
import BriefSuccessPage from "@/templates/BriefSuccessPage";

const SuccessPageSkeletonWrapper = () => (
    <div className="min-h-screen bg-b-surface1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="space-y-4">
                <div className="h-16 w-16 bg-b-surface1 dark:bg-shade-07/20 rounded-full mx-auto animate-pulse"></div>
                <div className="space-y-2">
                    <div className="h-6 bg-b-surface1 dark:bg-shade-07/20 rounded w-48 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-32 mx-auto animate-pulse"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-10 bg-b-surface1 dark:bg-shade-07/20 rounded-lg w-40 mx-auto animate-pulse"></div>
                <div className="h-10 bg-b-surface1 dark:bg-shade-07/20 rounded-lg w-32 mx-auto animate-pulse"></div>
            </div>
        </div>
    </div>
);

export default function Page() {
    return (
        <Suspense fallback={<SuccessPageSkeletonWrapper />}>
            <BriefSuccessPage />
        </Suspense>
    );
} 