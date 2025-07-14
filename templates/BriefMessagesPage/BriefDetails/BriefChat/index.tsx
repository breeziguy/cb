import React from "react";
import Image from "@/components/Image";
import { useUserRole } from "@/hooks/useUserRole";

interface BriefChatProps {
    brief: {
        id: string;
        title: string;
        description: string;
        status: string;
        budget: number;
        created_at: string;
        user_id: string;
        creator_id?: string;
        creator?: {
            name: string;
            username: string;
            avatar_url: string | null;
        };
        user?: {
            name: string;
            avatar_url: string | null;
        };
    };
}

// Function to format date as relative time
const formatRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    return `${diffMonths}mo ago`;
};

const BriefChat = ({ brief }: BriefChatProps) => {
    const { session } = useUserRole();
    
    if (!brief) {
        return <div className="flex flex-col gap-6 grow py-6 overflow-auto max-md:gap-0 max-md:h-[calc(100svh-15.5rem)] max-md:py-0"></div>;
    }
    
    // Create real chat data from the brief
    const briefChat = [
        {
            id: 1,
            name: brief.user?.name || "Brief Owner",
            login: brief.user?.name?.toLowerCase().replace(/\s+/g, '') || "customer",
            avatar: brief.user?.avatar_url || "/placeholder-avatar.svg",
            time: formatRelativeTime(brief.created_at),
            content: (
                <>
                    <div 
                        style={{ 
                            wordBreak: 'break-word', 
                            overflowWrap: 'anywhere',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.5'
                        }}
                        dangerouslySetInnerHTML={{ __html: brief.description }}
                    />
                </>
            )
        }
    ];

    // Add creator response if there's a creator assigned
    if (brief.creator && brief.status !== 'pending') {
        briefChat.push({
            id: 2,
            name: brief.creator.name,
            login: brief.creator.username,
            avatar: brief.creator.avatar_url || "/placeholder-avatar.svg",
            time: formatRelativeTime(brief.created_at), // Using same time for now, could be different
            content: (
                <>
                    <div style={{ 
                        wordBreak: 'break-word', 
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.5'
                    }}>
                        Brief {brief.status.toLowerCase()}. Looking forward to working on this project!
                    </div>
                </>
            )
        });
    }

    return (
        <div className="flex flex-col gap-6 grow py-6 overflow-auto max-md:gap-4">
            {briefChat.map((item) => (
                <div className="flex p-4 max-md:p-3" key={item.id}>
                    <div className="shrink-0">
                        <Image
                            className="size-12 rounded-full opacity-100 object-cover"
                            src={item.avatar}
                            width={48}
                            height={48}
                            alt=""
                        />
                    </div>
                    <div className="grow pl-5 pr-6 max-md:pl-3 max-md:pr-3">
                        <div className="flex items-center flex-wrap">
                            <div className="text-sub-title-1">{item.name}</div>
                            {/* <div className="ml-3 text-t-secondary/80 max-md:hidden">
                                @{item.login}
                            </div> */} {/* Disabled till next version */}
                            <div className="shrink-0 size-0.5 rounded-full bg-t-tertiary/50 mx-3"></div>
                            <div className="text-t-secondary/80">{item.time}</div>
                        </div>
                        <div className="mt-2 pr-4 break-words max-md:pr-0" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            {item.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BriefChat; 