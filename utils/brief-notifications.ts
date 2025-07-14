import { notificationHelpers } from '@/utils/notifications';

// These functions will be called by WhatsApp webhook handlers
// when creators respond with "accept" or "reject" to collaboration briefs

export const handleBriefAcceptance = (
  addNotification: (notification: any) => void,
  creatorName: string,
  creatorAvatar?: string
) => {
  addNotification(notificationHelpers.briefAccepted(creatorName, creatorAvatar));
};

export const handleBriefRejection = (
  addNotification: (notification: any) => void,
  creatorName: string, 
  creatorAvatar?: string
) => {
  addNotification(notificationHelpers.briefRejected(creatorName, creatorAvatar));
};

// Example webhook handler structure (to be implemented with actual WhatsApp API)
export const processWhatsAppMessage = async (
  message: {
    from: string;
    body: string;
    timestamp: string;
  },
  addNotification: (notification: any) => void
) => {
  const messageText = message.body.toLowerCase().trim();
  
  // Check if message is a brief response
  if (messageText === 'accept' || messageText === 'yes') {
    // TODO: Get creator details from database using phone number
    // handleBriefAcceptance(addNotification, creatorName, creatorAvatar);
  } else if (messageText === 'reject' || messageText === 'no') {
    // TODO: Get creator details from database using phone number  
    // handleBriefRejection(addNotification, creatorName, creatorAvatar);
  }
};

// Demo function to test notifications (remove in production)
export const triggerTestNotifications = (
  addNotification: (notification: any) => void
) => {
  // Test wallet notification
  addNotification(notificationHelpers.walletTopUp(5000));
  
  // Test brief submission
  addNotification(notificationHelpers.briefSubmission("John Doe", "/images/avatars/1.png"));
  
  // Test favorite
  addNotification(notificationHelpers.favoriteCreator("Jane Smith", "/images/avatars/2.png"));
  
  // Test brief responses
  addNotification(notificationHelpers.briefAccepted("Mike Johnson", "/images/avatars/3.png"));
  addNotification(notificationHelpers.briefRejected("Sarah Wilson", "/images/avatars/4.png"));
}; 