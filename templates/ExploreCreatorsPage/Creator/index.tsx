import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import FollowButton from "@/components/FollowButton";
import { type Creator } from "@/lib/creator-utils";
import { getCreatorAvatar, getCreatorSocials, formatCreatorName } from "@/lib/creator-utils";

type CreatorProps = {
    value: Creator;
};

const Creator = ({ value }: CreatorProps) => {
    const router = useRouter();
    const creatorName = formatCreatorName(value);
    const avatarUrl = getCreatorAvatar(value);
    const socials = getCreatorSocials(value);

    const handleCreatorClick = () => {
        router.push(`/creators/${value.id}`);
    };

    return (
        <div 
            className="group bg-white dark:bg-b-surface2 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
            onClick={handleCreatorClick}
        >
            <div className="relative">
                <Image
                    className="w-full h-56 object-cover opacity-100 aspect-square"
                    src={avatarUrl}
                    width={400}
                    height={400}
                    alt={creatorName}
                />
                <div className="absolute top-3 right-3 z-10 w-10 h-10" onClick={(e) => e.stopPropagation()}>
                    <FollowButton 
                        creatorId={value.id}
                        size="medium"
                        className="!relative !top-0 !right-0 !bottom-auto bg-black/30 hover:bg-black/50"
                    />
                </div>
            </div>

            <div className="p-4 bg-b-surface2 dark:bg-linear-to-b dark:from-[#2A2A2A] dark:to-[#202020]">
                <h3 className="text-lg font-semibold text-t-primary dark:text-t-primary-dark mb-1 truncate">
                    {creatorName}
                </h3>

                {value.location && (
                    <p className="text-xs text-t-secondary dark:text-t-secondary-dark mb-1 truncate">
                        {value.location}
                    </p>
                )}

                {value.industry && (
                    <p className="text-xs text-t-secondary dark:text-t-secondary-dark mb-3 truncate">
                        {value.industry}
                    </p>
                )}

                {/* Social handles hidden per user request - will be added back in future */}
                {/* <div className="flex items-center space-x-3">
                    {socials.slice(0, 3).map((social) => (
                        <div key={social.platform} className="flex items-center text-xs text-t-tertiary dark:text-t-tertiary-dark">
                            <Icon 
                                name={social.platform === 'instagram' ? 'instagram' : social.platform === 'tiktok' ? 'tiktok' : 'social'} 
                                className="mr-1 fill-current w-3.5 h-3.5" 
                            />
                            <span className="truncate max-w-16">{social.handle}</span>
                        </div>
                    ))}
                    {socials.length > 3 && (
                         <div className="text-xs text-t-tertiary dark:text-t-tertiary-dark">...</div>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default Creator;
