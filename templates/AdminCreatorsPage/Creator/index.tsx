import Image from "@/components/Image";
import { CreatorProfileData } from "@/mocks/creators";

type CreatorProps = {
    value: CreatorProfileData;
    isActive: boolean;
    onClick: () => void;
};

const Creator = ({ value, isActive, onClick }: CreatorProps) => {
    return (
        <div
            className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors hover:bg-b-surface2 ${
                isActive ? "bg-b-surface2" : ""
            }`}
            onClick={onClick}
        >
            <div className="relative shrink-0 mr-3">
                <Image
                    className="size-12 rounded-full object-cover"
                    src={value.avatarUrl}
                    width={48}
                    height={48}
                    alt=""
                />
            </div>
            <div className="grow min-w-0">
                <div className="text-sub-title-1 truncate">{value.name}</div>
                <div className="text-body-2 text-t-secondary truncate">
                    {value.location} • {value.specialties.slice(0, 2).join(", ")}
                </div>
                <div className="text-caption text-t-tertiary">
                    {value.socialLinks.reduce((total, social) => {
                        const followers = parseInt(social.followers.replace(/[^\d]/g, ''));
                        return total + (isNaN(followers) ? 0 : followers);
                    }, 0).toLocaleString()}+ followers
                </div>
            </div>
        </div>
    );
};

export default Creator; 