import { useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import { creators } from "@/mocks/creators";

type DetailsProps = {
    onBack: () => void;
};

const Details = ({ onBack }: DetailsProps) => {
    const [isEditing, setIsEditing] = useState(false);
    
    // For demo, use the first creator
    const creator = creators[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        className="max-md:hidden"
                        icon="arrow"
                        isStroke
                        isCircle
                        onClick={onBack}
                    />
                    <h2 className="h4">Creator Details</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        isWhite
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Icon name="edit" className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>
                    <Button isBlack>
                        <Icon name="plus" className="w-4 h-4 mr-2" />
                        Add New Creator
                    </Button>
                </div>
            </div>

            {/* Creator Profile */}
            <div className="card p-6">
                <div className="flex items-start gap-6 mb-6">
                    <Image
                        src={creator.avatarUrl}
                        alt={creator.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                    />
                    <div className="flex-grow">
                        <h3 className="h5 mb-2">{creator.name}</h3>
                        <p className="text-t-secondary mb-2">{creator.location}</p>
                        <div className="flex flex-wrap gap-2">
                            {creator.specialties.map((specialty, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Social Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {creator.socialLinks.map((social, index) => (
                        <div key={index} className="text-center p-4 bg-b-surface2 rounded-xl">
                            <Icon name={social.iconName} className="w-6 h-6 mx-auto mb-2 text-t-secondary" />
                            <div className="font-medium">{social.followers}</div>
                            <div className="text-sm text-t-secondary capitalize">{social.platform}</div>
                        </div>
                    ))}
                </div>

                {/* Bio */}
                <div className="mb-6">
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-t-secondary">{creator.bio || "No bio available"}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button isWhite className="flex-1">
                        <Icon name="eye" className="w-4 h-4 mr-2" />
                        View Profile
                    </Button>
                    <Button isWhite className="flex-1">
                        <Icon name="chat" className="w-4 h-4 mr-2" />
                        Contact
                    </Button>
                    <Button isWhite className="flex-1">
                        <Icon name="block" className="w-4 h-4 mr-2" />
                        Deactivate
                    </Button>
                </div>
            </div>

            {/* Edit Form (shown when editing) */}
            {isEditing && (
                <div className="card p-6">
                    <h4 className="h6 mb-4">Edit Creator Information</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                defaultValue={creator.name}
                                className="w-full p-3 border border-s-stroke2 rounded-xl bg-b-surface1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <input
                                type="text"
                                defaultValue={creator.location}
                                className="w-full p-3 border border-s-stroke2 rounded-xl bg-b-surface1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Bio</label>
                            <textarea
                                defaultValue={creator.bio}
                                rows={3}
                                className="w-full p-3 border border-s-stroke2 rounded-xl bg-b-surface1"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button isBlack className="flex-1">
                                Save Changes
                            </Button>
                            <Button isWhite className="flex-1" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Details; 