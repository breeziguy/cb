import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import { supabase } from "@/lib/supabase";
import { useDashboardMutations } from "@/hooks/useDashboard";
import { useCreator } from "@/hooks/useCreators";
import { getCreatorAvatar, formatCreatorName } from "@/lib/creator-utils";
import { SelectOption } from "@/types/select";
import { PlatformOption, videoDeliverables } from "@/mocks/briefOptions";
import { useUserRole } from "@/hooks/useUserRole";
import { useNotifications } from '@/contexts/NotificationContext';
import { notificationHelpers } from '@/utils/notifications';
import { sendBriefToWhatsApp } from "@/utils/whatsapp";

interface BriefSubmissionProps {
    briefData: {
        title: string;
        description: string;
        productForContent: string;
        productNairaValue: string;
        productWebsite: string;
        leadTime: string;
        budget: number;
        submissionFee: number;
        isSendingProducts: boolean | null;
        deliverables: (string | number)[];
        videoLayout: SelectOption | null;
        platforms: PlatformOption[];
        category: SelectOption | null;
    };
    profile: any;
    creatorId: string | null;
    creatorName: string | null;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setErrors: (errors: any) => void;
}

const BriefSubmission = ({ 
    briefData, 
    profile, 
    creatorId, 
    creatorName, 
    loading, 
    setLoading,
    setErrors
}: BriefSubmissionProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
    const [showMissingWhatsApp, setShowMissingWhatsApp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Get creator data
    const { data: creator, isLoading: creatorLoading } = useCreator(creatorId || '');
    
    // Get fresh profile data to ensure wallet balance is up-to-date
    const { profile: freshProfile } = useUserRole();
    
    // Get cache invalidation functions
    const { invalidateAll } = useDashboardMutations();

    // Get notifications helper
    const { addNotification } = useNotifications();

    // Use fresh profile data with proper fallbacks
    const currentProfile = freshProfile || profile;
    const walletBalance = parseFloat(currentProfile?.wallet_balance || "0");

    const validateForm = () => {
        const newErrors: any = {};
        const { 
            title, description, isSendingProducts, productNairaValue, 
            category, platforms, deliverables, videoLayout, leadTime
        } = briefData;

        if (!title.trim()) newErrors.title = 'Please enter a campaign title.';
        if (!description.trim()) newErrors.description = 'Please provide a campaign description.';
        if (isSendingProducts === null) newErrors.isSendingProducts = 'Please specify if you will be sending products.';
        if (isSendingProducts && (!productNairaValue.trim() || isNaN(parseInt(productNairaValue)))) {
            newErrors.productNairaValue = 'Please enter a valid numeric value for the products.';
        }
        if (!category) newErrors.category = 'Please select a product category.';
        if (platforms.length === 0) newErrors.platforms = 'Please select at least one platform.';
        if (deliverables.length === 0) newErrors.deliverables = 'Please select at least one deliverable.';
        if (!videoLayout) newErrors.videoLayout = 'Please select a video layout.';
        if (!leadTime.trim()) newErrors.leadTime = 'Please select a lead time.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setLoading(true);

        try {
            // Fetch the latest profile data directly from database to ensure current balance
            const { data: latestProfile, error: profileError } = await supabase
                .from('profiles')
                .select('wallet_balance, whatsapp_number')
                .eq('id', currentProfile.id)
                .single();

            if (profileError) {
                console.error('Error fetching latest profile:', profileError);
                alert(`Error checking wallet balance: ${profileError.message}`);
                setLoading(false);
                return;
            }

            console.log('Raw profile data from database:', latestProfile);
            console.log('Raw wallet_balance value:', latestProfile?.wallet_balance);
            console.log('Type of wallet_balance:', typeof latestProfile?.wallet_balance);
            
            const currentWalletBalance = parseFloat(latestProfile?.wallet_balance || "0");
            console.log('Parsed wallet balance:', currentWalletBalance, 'Required:', briefData.submissionFee);

            // Check wallet balance with fresh data
            if (currentWalletBalance < briefData.submissionFee) {
            setShowInsufficientFunds(true);
                setLoading(false);
            return;
        }

        // Check WhatsApp number
            if (!latestProfile?.whatsapp_number) {
            setShowMissingWhatsApp(true);
                setLoading(false);
            return;
        }

            console.log('Updating wallet balance...');
            // Deduct submission fee from wallet using the fresh balance
            const { error: walletError } = await supabase
                .from('profiles')
                .update({ wallet_balance: currentWalletBalance - briefData.submissionFee })
                .eq('id', currentProfile.id);

            if (walletError) {
                console.error('Wallet update error:', walletError);
                throw new Error(`Wallet update failed: ${walletError.message}`);
            }

            console.log('Inserting brief data:', {
                user_id: currentProfile.id,
                creator_id: creatorId,
                title: briefData.title.trim(),
                description: briefData.description.trim(),
                product_naira_value: parseInt(briefData.productNairaValue) || 0,
                lead_time: briefData.leadTime,
                budget: briefData.budget,
                submission_fee: briefData.submissionFee,
                is_sending_products: briefData.isSendingProducts,
                category: briefData.category,
                platforms: briefData.platforms,
                deliverables: briefData.deliverables,
                video_layout: briefData.videoLayout,
                status: 'pending'
            });

            // Insert brief into database with all form data
            const { error: briefError } = await supabase
                .from('briefs')
                .insert({
                    user_id: currentProfile.id,
                    creator_id: creatorId,
                    title: briefData.title.trim(),
                    description: briefData.description.trim(),
                    product_naira_value: parseInt(briefData.productNairaValue) || 0,
                    lead_time: briefData.leadTime,
                    budget: briefData.budget,
                    submission_fee: briefData.submissionFee,
                    is_sending_products: briefData.isSendingProducts,
                    category: briefData.category,
                    platforms: briefData.platforms,
                    deliverables: briefData.deliverables,
                    video_layout: briefData.videoLayout,
                    status: 'pending'
                });

            if (briefError) {
                console.error('Brief insertion error:', briefError);
                throw new Error(`Brief submission failed: ${briefError.message}`);
            }

            console.log('Brief submitted successfully!');
            
            // Send WhatsApp notification to creator
            if (creator && creator.whatsapp_number) {
                const deliverableNames = briefData.deliverables.map(id => {
                    const deliverable = videoDeliverables.find(d => d.id === id);
                    return deliverable ? deliverable.name : null;
                }).filter(Boolean) as string[];

                const platformNames = briefData.platforms.map(p => p.label);

                const briefForWhatsApp = {
                    title: briefData.title,
                    description: briefData.description,
                    productForContent: briefData.productForContent,
                    deliverables: deliverableNames,
                    videoLayout: briefData.videoLayout?.label || 'Not specified',
                    platforms: platformNames,
                    leadTime: briefData.leadTime,
                    budget: briefData.budget
                };

                await sendBriefToWhatsApp(creator.whatsapp_number, briefForWhatsApp);
            } else {
                console.warn('Creator phone number not found. Skipping WhatsApp notification.');
            }
            
            // Add success notification
            console.log('Adding notification for creator:', creator);
            if (creator) {
                const creatorAvatar = getCreatorAvatar(creator);
                const creatorDisplayName = formatCreatorName(creator);
                console.log('Notification data:', { creatorDisplayName, creatorAvatar, creatorId: creator.id });
                const notification = notificationHelpers.briefSubmission(creatorDisplayName, creatorAvatar, creator.id);
                console.log('Generated notification:', notification);
                addNotification(notification);
                console.log('Notification added successfully');
            } else {
                console.log('No creator data available for notification');
            }

            // Invalidate dashboard cache to show updated data
            invalidateAll();

            // Show success modal
            setShowSuccess(true);
            
        } catch (error: any) {
            console.error('Error submitting brief:', error);
            alert(`Error submitting brief: ${error.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        // Navigate to brief to show brief history
        router.push('/brief');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <>
            <Card classHead="!pl-3" title="Payment & submission">
                <div className="p-3">
                    <div className="space-y-4">
                        {/* Creator Information */}
                        {creatorId && (
                            <div className="p-3 bg-b-surface2 rounded-xl">
                                <div className="mb-3 text-button">Brief Recipient</div>
                                <div className="flex items-center gap-3">
                                    {creatorLoading ? (
                                        <>
                                            <div className="w-12 h-12 bg-b-surface1 dark:bg-shade-07/20 rounded-full animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded w-24 mb-2 animate-pulse"></div>
                                                <div className="h-3 bg-b-surface1 dark:bg-shade-07/20 rounded w-20 animate-pulse"></div>
                                            </div>
                                        </>
                                    ) : creator ? (
                                        <>
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                <Image
                                                    className="object-cover opacity-100"
                                                    src={getCreatorAvatar(creator)}
                                                    fill
                                                    alt={formatCreatorName(creator)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-t-primary">
                                                    {formatCreatorName(creator)}
                                                </div>
                                                <div className="text-sm text-t-secondary">
                                                    {creator.industry || creator.category || 'Content Creator'}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm text-t-secondary">Creator not found</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="p-3 bg-b-surface2 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-t-secondary">Submission Fee</span>
                                <span className="text-sm font-medium">₦{briefData.submissionFee.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-t-secondary">Campaign Budget</span>
                                <span className="text-sm font-medium">₦{briefData.budget.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button 
                                className="flex-1"
                                isStroke
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1"
                                isBlack
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Brief"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Success Modal */}
            <Modal 
                open={showSuccess} 
                onClose={handleSuccessClose}
            >
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="check" className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <h3 className="h3">Brief Submitted Successfully!</h3>
                    <p className="text-t-secondary">
                        Your collaboration brief has been sent to <strong>{creatorName}</strong>. 
                        You'll receive a notification once they respond.
                    </p>
                    
                    <div className="bg-b-surface2 rounded-xl p-4 text-left space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-t-secondary">Creator</span>
                            <span className="text-sm font-medium">{creatorName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-t-secondary">Campaign Budget</span>
                            <span className="text-sm font-medium">₦{briefData.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-t-secondary">Status</span>
                            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Review</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <Button 
                            className="flex-1"
                            isStroke
                            onClick={() => router.push('/creators')}
                        >
                            View More Creators
                        </Button>
                        <Button 
                            className="flex-1"
                            isBlack
                            onClick={handleSuccessClose}
                        >
                            View Brief History
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Insufficient Funds Modal */}
            <Modal 
                open={showInsufficientFunds} 
                onClose={() => setShowInsufficientFunds(false)}
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="wallet" className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    
                    <h3 className="h4">Insufficient Funds</h3>
                    <p className="text-t-secondary">
                        You need ₦{briefData.submissionFee.toLocaleString()} to submit this brief, but your current balance is ₦{walletBalance.toLocaleString()}.
                    </p>
                    
                    <div className="flex gap-3 pt-4">
                        <Button 
                            className="flex-1"
                            isStroke
                            onClick={() => setShowInsufficientFunds(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1"
                            isBlack
                            onClick={() => router.push('/wallet/top-up')}
                        >
                            Add Funds
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Missing WhatsApp Modal */}
            <Modal 
                open={showMissingWhatsApp} 
                onClose={() => setShowMissingWhatsApp(false)}
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="phone" className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    
                    <h3 className="h4">WhatsApp Number Required</h3>
                    <p className="text-t-secondary">
                        You need to add your WhatsApp number to your profile before submitting briefs. This allows creators to contact you directly.
                    </p>
                    
                    <div className="flex gap-3 pt-4">
                        <Button 
                            className="flex-1"
                            isStroke
                            onClick={() => setShowMissingWhatsApp(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1"
                            isBlack
                            onClick={() => router.push('/settings?tab=profile')}
                        >
                            Complete Profile
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default BriefSubmission; 