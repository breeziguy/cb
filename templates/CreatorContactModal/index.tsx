"use client";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import { useRouter } from "next/navigation";
import { type Creator, getCreatorSocials, formatCreatorName, getCreatorAvatar } from "@/lib/creator-utils";

interface CreatorContactModalProps {
    creator: Creator;
    onClose: () => void;
}

const CreatorContactModal = ({ creator, onClose }: CreatorContactModalProps) => {
    const router = useRouter();
    const creatorName = formatCreatorName(creator);
    const socials = getCreatorSocials(creator);
    const avatarUrl = getCreatorAvatar(creator);
    
    const handleSubmitBrief = () => {
        // Navigate to brief submission form with creator ID
        router.push(`/collab-brief/new?creator_id=${creator.id}&creator_name=${encodeURIComponent(creatorName)}`);
        onClose();
    };

    return (
        <Modal open={true} onClose={onClose}>
            {/* Creator Profile Image */}
            <div className="flex flex-wrap gap-5 mb-8 max-md:gap-3">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden">
                    <Image
                        className="object-cover opacity-100"
                        src={avatarUrl}
                        fill
                        alt={creatorName}
                    />
                </div>
            </div>
            
            {/* Modal Title */}
            <div className="mb-4 text-h4 max-md:text-h5">
                Contact {creatorName}!
            </div>
            
            {/* Modal Description */}
            <div className="mb-8 text-body-2 font-medium text-t-tertiary">
                Connect directly with this creator to discuss your collaboration. 
                You'll be taken to the brief submission form to send your proposal.
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
                <Button
                    className="flex-1"
                    isStroke
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button className="flex-1" isBlack onClick={handleSubmitBrief}>
                    Let's do it
                </Button>
            </div>
        </Modal>
    );
};

export default CreatorContactModal; 