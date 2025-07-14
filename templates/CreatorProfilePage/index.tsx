"use client";

import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import FollowButton from "@/components/FollowButton";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import CreatorContactModal from "@/templates/CreatorContactModal";
import { type Creator } from "@/lib/creator-utils";
import WatermarkedVideoPlayer from "@/components/WatermarkedVideoPlayer";

interface CreatorProfileProps {
    creator: Creator;
}

const CreatorProfilePage = ({ creator }: CreatorProfileProps) => {
    if (!creator) {
        return (
            <Layout title="Creator Not Found">
                <div className="text-center py-20">
                    <h3 className="text-lg font-medium">Creator not found</h3>
                </div>
            </Layout>
        );
    }

    const displayCreator = {
        id: creator.id,
        name: creator.name,
        avatarUrl: creator.profile_image || "/placeholder-avatar.svg",
        location: creator.location,
        age: null,
        gender: null,
        bio: `Professional ${creator.industry} Creator. Connect with me for collaborations and partnerships.`,
        categories: creator.industry ? [{ id: 1, name: creator.industry, icon: "tag" }] : [],
    };

    const [showContactModal, setShowContactModal] = useState(false);

    return (
        <Layout title=" ">
            <div className="flex max-lg:block">
                <div className="grow space-y-5">
                    {/* Creator details card */}
                    <div className="card p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="relative shrink-0 self-center sm:self-start">
                                <Image
                                    src={displayCreator.avatarUrl || "/placeholder-avatar.svg"}
                                    alt={displayCreator.name}
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
                                />
                                <FollowButton
                                    creatorId={creator.id}
                                    size="small"
                                    className="sm:hidden"
                                />
                            </div>
                            <div className="text-center sm:text-left flex-grow w-full">
                                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-3 sm:mb-2">
                                    <h2 className="h4 mb-2 sm:mb-0">{displayCreator.name}</h2>
                                    <div className="relative shrink-0 ml-auto sm:ml-4 hidden sm:block">
                                        <div className="size-10">
                                            <FollowButton
                                                creatorId={creator.id}
                                                size="medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="body1 text-t-secondary mb-6 px-2 sm:px-0 sm:pr-4 leading-relaxed">
                                    Send a brief and collaborate with this creator to promote your products or businesses. Build meaningful partnerships that drive engagement, increase brand awareness, and generate authentic user-generated content for your marketing campaigns.
                                </p>
                                <Button
                                    onClick={() => setShowContactModal(true)}
                                    className="w-full sm:w-auto"
                                    isBlack
                                >
                                    Collab with Creator
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Media Portfolio */}
                    <div className="card p-4 sm:p-6">
                        <h3 className="h6 mb-4">Media Portfolio</h3>
                        
                        {creator.video_portfolio && creator.video_portfolio.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                {creator.video_portfolio.map((videoUrl, index) => (
                                    <WatermarkedVideoPlayer key={index} url={videoUrl} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 px-4 rounded-lg bg-b-surface1 dark:bg-b-dark1">
                                <Icon name="video-off" className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No Videos Uploaded</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This creator hasn't uploaded any videos to their portfolio yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-[23.125rem] shrink-0 ml-5 space-y-5 max-lg:w-full max-lg:ml-0 max-lg:mt-5">
                    {/* About card */}
                    <div className="card p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="h6">About</h3>
                            <Image src={displayCreator.avatarUrl || "/placeholder-avatar.svg"} alt={displayCreator.name} width={40} height={40} className="rounded-full object-cover" />
                        </div>
                        <div className="body2 text-t-secondary space-y-3">
                            {displayCreator.location && (
                                <p className="flex items-center">
                                    <Icon name="location" className="w-4 h-4 mr-2 shrink-0" /> 
                                    {displayCreator.location}
                                </p>
                            )}
                            <p>{displayCreator.bio}</p>
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-t-tertiary mt-6 mb-3">Categories</h4>
                        <div className="flex flex-wrap">
                            {displayCreator.categories?.map((category: any) => (
                                <div 
                                    key={category.id} 
                                    className="py-1 px-2.5 rounded-full text-xs font-medium bg-b-surface1 dark:bg-b-dark1 text-t-secondary dark:text-t-secondary-dark mr-1.5 mb-1.5 inline-flex items-center"
                                >
                                    {category.icon && <Icon name={category.icon} className="w-3.5 h-3.5 mr-1.5 fill-t-secondary dark:fill-t-secondary-dark" />}
                                    {category.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            {showContactModal && (
                <CreatorContactModal 
                    creator={creator}
                    onClose={() => setShowContactModal(false)}
                />
            )}
        </Layout>
    );
};

export default CreatorProfilePage; 