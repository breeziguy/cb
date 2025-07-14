"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";

const locations = [
    { id: 1, name: "Nigeria" },
    { id: 2, name: "Ghana" },
    { id: 3, name: "Kenya" },
    { id: 4, name: "South Africa" },
    { id: 5, name: "United States" },
    { id: 6, name: "United Kingdom" },
    { id: 7, name: "Canada" },
    { id: 8, name: "Other" },
];

const ProfileInformation = () => {
    const { session } = useUserRole();
    const user = session?.user;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState(locations[0]);
    const [whatsappNumber, setWhatsappNumber] = useState("");

    // Load profile data
    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setDisplayName(data.full_name || "");
                    setEmail(data.email || "");
                    setWhatsappNumber(data.whatsapp_number || "");
                    setPreview(data.avatar_url || null);
                    
                    // Set location based on saved value
                    if (data.location) {
                        const savedLocation = locations.find(loc => loc.name === data.location);
                        if (savedLocation) {
                            setLocation(savedLocation);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadProfile();
        }
    }, [user?.id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // For now, just show preview. Image upload can be implemented later
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            console.log('Image upload feature coming soon');
        }
    };

    const handleSave = async () => {
        if (!user?.id) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: displayName,
                    whatsapp_number: whatsappNumber,
                    location: location.name,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            console.log('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card title="Profile information">
                <div className="flex flex-col gap-8 p-5 pt-0 max-lg:px-3">
                    <div className="animate-pulse">
                        <div className="flex items-center mb-8">
                            <div className="w-20 h-20 bg-b-surface1 dark:bg-shade-07/20 rounded-full"></div>
                            <div className="grow max-w-88 pl-4">
                                <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-3/4"></div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                            <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                            <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                            <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Profile information">
            <div className="flex flex-col gap-8 p-5 pt-0 max-lg:px-3">
                <div className="flex items-center">
                    <div className="relative flex justify-center items-center shrink-0 w-20 h-20 rounded-full overflow-hidden bg-b-surface1">
                        {preview ? (
                            <Image
                                className="z-2 w-20 h-20 object-cover opacity-100"
                                src={preview}
                                width={80}
                                height={80}
                                quality={100}
                                priority={true}
                                alt="Avatar"
                            />
                        ) : (
                            <Icon
                                className="absolute top-1/2 left-1/2 -translate-1/2 fill-t-secondary"
                                name="camera"
                            />
                        )}
                        <input
                            type="file"
                            className="absolute z-3 inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="grow max-w-88 pl-4 text-caption text-t-secondary">
                        Update your avatar by clicking the image beside. 288x288
                        px size recommended in PNG or JPG format only.
                    </div>
                </div>
                <Field
                    label="Display name"
                    placeholder="Enter display name"
                    tooltip="Maximum 100 characters. No HTML or emoji allowed"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    validated
                />
                <Field
                    label="Email"
                    placeholder="Enter email"
                    tooltip="Email cannot be changed"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    className="opacity-60"
                />
                <Field
                    label="WhatsApp Number"
                    placeholder="e.g., +234 803 123 4567"
                    tooltip="Required for creators to contact you about briefs"
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    required
                />
                <Select
                    label="Location"
                    tooltip="Select your current location"
                    value={location}
                    onChange={setLocation}
                    options={locations}
                />
                
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProfileInformation;
