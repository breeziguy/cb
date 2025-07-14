import React from "react";
import Image from "@/components/Image";

type BriefMessageType = {
    id: string;
    title: string;
    description: string;
    status: string;
    budget: number;
    created_at: string;
    creator?: {
        name: string;
        username: string;
        avatar_url: string | null;
    };
};

type BriefMessageProps = {
    value: BriefMessageType;
    isActive: boolean;
    onClick: () => void;
};

const BriefMessage = ({ value, isActive, onClick }: BriefMessageProps) => {
    // Get status color for the dot
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'bg-green-500'; // green for accepted
            case 'pending':
                return 'bg-yellow-500'; // yellow for pending
            case 'rejected':
                return 'bg-red-500'; // red for rejected
            default:
                return 'bg-t-tertiary/50'; // default gray
        }
    };

    // Format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    // Function to strip HTML tags and get plain text
    const stripHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    // Get plain text from description and truncate if needed
    const plainDescription = stripHtmlTags(value.description);

    return (
        <div
            className="group relative flex items-center p-3 cursor-pointer"
            onClick={onClick}
        >
            <div
                className={`box-hover ${isActive ? "visible opacity-100" : ""}`}
            ></div>
            <div className="relative z-2 shrink-0">
                <Image
                    className="size-12 rounded-full opacity-100 object-cover"
                    src={value.creator?.avatar_url || "/placeholder-avatar.svg"}
                    width={48}
                    height={48}
                    alt=""
                />
            </div>
            <div className="relative z-2 w-[calc(100%-3rem)] pl-5 max-lg:pl-4">
                <div className="flex items-center">
                    <div className="text-sub-title-1 truncate pr-2">{value.title}</div>
                    <div className="ml-auto text-caption text-t-tertiary shrink-0">
                        {formatTime(value.created_at)}
                    </div>
                    <div
                        className={`w-3 h-3 ml-3 rounded-full shrink-0 ${getStatusColor(value.status)}`}
                    ></div>
                </div>
                <div className="mt-1 truncate text-body-2 text-t-secondary">
                    {plainDescription}
                </div>
            </div>
        </div>
    );
};

export default BriefMessage; 