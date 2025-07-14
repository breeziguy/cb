import { useState } from "react";
import { NumericFormat } from "react-number-format";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
// import Message from "@/components/Message"; // Hidden till next version
import BriefChat from "./BriefChat";

type BriefDetailsProps = {
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
    } | null;
};

const BriefDetails = ({ brief }: BriefDetailsProps) => {
    // const [message, setMessage] = useState(""); // Hidden till next version

    if (!brief) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-h5 mb-2">No brief selected</div>
                    <div className="text-t-secondary">Select a brief to view details</div>
                </div>
            </div>
        );
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format budget in Naira
    const formatBudget = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Show creator info (the person assigned to work on the brief), or fallback if no creator assigned
    const displayUser = brief.creator || {
        name: "No Creator Assigned",
        username: "pending",
        avatar_url: "/placeholder-avatar.svg"
    };

    return (
        <>
            <div className="flex items-center px-4 py-3.5 border border-s-subtle rounded-[1.25rem]">
                <div className="shrink-0">
                    <Image
                        className="size-12 rounded-full opacity-100 object-cover"
                        src={displayUser.avatar_url || "/placeholder-avatar.svg"}
                        width={48}
                        height={48}
                        alt=""
                    />
                </div>
                <div className="grow pl-5">
                    <div className="flex items-center gap-3 text-sub-title-1">
                        <div>{displayUser.name}</div>
                        {/* <div className="text-t-secondary/80">@{displayUser.username}</div> */} {/* Disabled till next version */}
                    </div>
                    <div className="flex items-center gap-8 mt-2">
                        <div className="flex items-center gap-3 text-body-2">
                            <Icon className="fill-t-secondary" name="profile" />
                            {formatDate(brief.created_at)}
                        </div>
                        <div className="flex items-center gap-3 text-body-2">
                            <Icon className="fill-t-secondary" name="bag" />
                            {formatBudget(brief.budget)}
                        </div>
                    </div>
                </div>
                {/* <Button
                    className="shrink-0 ml-8"
                    icon="trash-think"
                    isStroke
                    isCircle
                /> */} {/* Disabled till next version */}
            </div>
            <BriefChat brief={brief} />
            {/* <Message
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus={false}
            /> */} {/* Hidden till next version - write message section */}
        </>
    );
};

export default BriefDetails; 