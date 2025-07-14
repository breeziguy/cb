"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Field from "@/components/Field";
import Button from "@/components/Button";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";

const SocialLinks = () => {
    const { session } = useUserRole();
    const user = session?.user;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [instagramProfile, setInstagramProfile] = useState("");
    const [tiktokProfile, setTiktokProfile] = useState("");
    const [twitterProfile, setTwitterProfile] = useState("");
    const [facebookProfile, setFacebookProfile] = useState("");

    // Load profile data
    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('instagram_profile, tiktok_profile, twitter_profile, facebook_profile')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setInstagramProfile(data.instagram_profile || "");
                    setTiktokProfile(data.tiktok_profile || "");
                    setTwitterProfile(data.twitter_profile || "");
                    setFacebookProfile(data.facebook_profile || "");
                }
            } catch (error) {
                console.error('Error loading social links:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadProfile();
        }
    }, [user?.id]);

    const handleSave = async () => {
        if (!user?.id) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    instagram_profile: instagramProfile,
                    tiktok_profile: tiktokProfile,
                    twitter_profile: twitterProfile,
                    facebook_profile: facebookProfile,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            console.log('Social links updated successfully!');
        } catch (error) {
            console.error('Error saving social links:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card title="Social links">
                <div className="flex flex-col gap-6 p-5 pt-0 max-lg:px-3">
                    <div className="animate-pulse space-y-6">
                        <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                        <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                        <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                        <div className="h-12 bg-b-surface1 dark:bg-shade-07/20 rounded"></div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Social links">
            <div className="flex flex-col gap-6 p-5 pt-0 max-lg:px-3">
                <Field
                    label="Instagram Profile URL"
                    placeholder="https://www.instagram.com/yourusername"
                    tooltip="Your Instagram profile or business page URL"
                    value={instagramProfile}
                    onChange={(e) => setInstagramProfile(e.target.value)}
                />
                <Field
                    label="TikTok Profile URL"
                    placeholder="https://www.tiktok.com/@yourusername"
                    tooltip="Your TikTok profile URL"
                    value={tiktokProfile}
                    onChange={(e) => setTiktokProfile(e.target.value)}
                />
                <Field
                    label="Twitter/X Profile URL"
                    placeholder="https://x.com/yourusername"
                    tooltip="Your Twitter/X profile URL"
                    value={twitterProfile}
                    onChange={(e) => setTwitterProfile(e.target.value)}
                />
                <Field
                    label="Facebook Profile URL"
                    placeholder="https://www.facebook.com/yourusername"
                    tooltip="Your Facebook profile or business page URL"
                    value={facebookProfile}
                    onChange={(e) => setFacebookProfile(e.target.value)}
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

export default SocialLinks; 