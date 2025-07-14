import { NotificationData } from '@/contexts/NotificationContext';

export interface NotificationHelpers {
    walletTopUp: (amount: number) => Omit<NotificationData, 'id' | 'time' | 'new'>;
    briefSubmission: (creatorName: string, creatorAvatar?: string, creatorId?: string) => Omit<NotificationData, 'id' | 'time' | 'new'>;
    briefAccepted: (creatorName: string, creatorAvatar?: string, creatorId?: string) => Omit<NotificationData, 'id' | 'time' | 'new'>;
    briefRejected: (creatorName: string, creatorAvatar?: string, creatorId?: string) => Omit<NotificationData, 'id' | 'time' | 'new'>;
    favoriteCreator: (creatorName: string, creatorAvatar?: string, creatorId?: string) => Omit<NotificationData, 'id' | 'time' | 'new'>;
}

// Format currency to Naira
function formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
}

export const notificationHelpers: NotificationHelpers = {
    walletTopUp: (amount: number) => ({
        type: "wallet",
        login: "@Wallet",
        action: "topped up",
        product: `${formatCurrency(amount)} to your wallet`,
        content: `Your wallet has been successfully credited with ${formatCurrency(amount)}. You can now use these funds to submit briefs to creators.`,
        description: "You can now use your balance to send briefs and secure creators faster.",
        avatar: "/icons/wallet-icon.svg", // Fallback if SVG doesn't exist, we'll use wallet icon from Icon component
    }),

    briefSubmission: (creatorName: string, creatorAvatar?: string, creatorId?: string) => ({
        type: "brief",
        login: "@you",
        action: "submitted a collaboration brief to",
        product: creatorName,
        content: `Your collaboration brief has been successfully submitted to ${creatorName}. They will be notified via WhatsApp and can accept or reject your request.`,
        description: "Your brief has been sent. The creator will review and respond via WhatsApp.",
        avatar: creatorAvatar || "/images/avatars/placeholder.png",
        creator_id: creatorId,
    }),

    briefAccepted: (creatorName: string, creatorAvatar?: string, creatorId?: string) => ({
        type: "brief_accept",
        login: `@${creatorName.toLowerCase().replace(/\s+/g, '_')}`,
        action: "accepted",
        product: "your collaboration request",
        content: `Great news! ${creatorName} has accepted your collaboration brief. You can now proceed with the collaboration details.`,
        description: "The creator is ready to work with you. Reach out via WhatsApp to share final details.",
        avatar: creatorAvatar || "/images/avatars/placeholder.png",
        creator_id: creatorId,
    }),

    briefRejected: (creatorName: string, creatorAvatar?: string, creatorId?: string) => ({
        type: "brief_reject",
        login: `@${creatorName.toLowerCase().replace(/\s+/g, '_')}`,
        action: "rejected",
        product: "your collaboration request",
        content: `${creatorName} has declined your collaboration brief. You can try submitting a different brief or contact other creators.`,
        description: "You can explore other creators to find a better fit for your project.",
        avatar: creatorAvatar || "/images/avatars/placeholder.png",
        creator_id: creatorId,
    }),

    favoriteCreator: (creatorName: string, creatorAvatar?: string, creatorId?: string) => ({
        type: "favorite",
        login: "@you",
        action: "added",
        product: `@${creatorName.toLowerCase().replace(/\s+/g, '_')} to your favorites`,
        content: `${creatorName} has been added to your favorites list. You can easily find them in your favorites section for future collaborations.`,
        description: "You can now easily collaborate with this creator for future briefs and track their work from your dashboard.",
        avatar: creatorAvatar || "/images/avatars/placeholder.png",
        creator_id: creatorId,
    }),
}; 