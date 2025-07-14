import axios from 'axios';
import { stripHtmlToText } from './text-formatting';

interface BriefDataForWhatsApp {
  title: string;
  description: string;
  productForContent: string;
  deliverables: string[];
  videoLayout: string;
  platforms: string[];
  leadTime: string;
  budget: number;
}

export async function sendBriefToWhatsApp(creatorPhone: string, brief: BriefDataForWhatsApp) {
  if (!creatorPhone) {
    console.error('Creator phone number is missing. Cannot send WhatsApp message.');
    return;
  }

  if (!process.env.NEXT_PUBLIC_WASENDER_API_KEY) {
      console.error('WASENDER_API_KEY is not set in environment variables.');
      // In a real app, you might want to return an error or handle this more gracefully
      return;
  }
  
  // Simple check for E.164 format. You might want a more robust library for this in production.
  if (!/^\+\d{1,3}\d{4,14}(?:x.+)?$/.test(creatorPhone)) {
      console.warn(`Creator phone number ${creatorPhone} may not be in E.164 format. Attempting to send anyway.`);
  }

  const cleanedDescription = stripHtmlToText(brief.description);

  // Dynamically build the message body, skipping blank lines
  const messageParts = [
    `📄 Campaign *Title: ${brief.title}*`,
    `💬 Brief: ${cleanedDescription}`,
  ];
  if (brief.productForContent) {
    messageParts.push(`🎯 Product: ${brief.productForContent}`);
  }
  if (brief.deliverables && brief.deliverables.length > 0) {
    messageParts.push(`🎥 Deliverables: ${brief.deliverables.join(', ')}`);
  }
  if (brief.videoLayout) {
    messageParts.push(`🎥 Video Layout: ${brief.videoLayout}`);
  }
  if (brief.platforms && brief.platforms.length > 0) {
    messageParts.push(`📱 Platform(s): ${brief.platforms.join(', ')}`);
  }
  if (brief.leadTime) {
    messageParts.push(`⏱ Lead Time: ${brief.leadTime}`);
  }
  if (brief.budget) {
    messageParts.push(`💰 Budget: ₦${brief.budget.toLocaleString()}`);
  }

  const message = `
> New Brief Submitted by a Brand!

${messageParts.join('\n')}

⸻

> If you're available to take on this brief, reply: *Accept*

> If not, simply reply: *Reject*
  `;

  try {
    const response = await axios.post('https://www.wasenderapi.com/api/send-message', {
      to: creatorPhone,
      text: message
    }, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_WASENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ WhatsApp message sent successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('❌ Error sending WhatsApp message:', err.response ? err.response.data : err.message);
    // We don't rethrow the error because the main brief submission flow shouldn't fail if the WhatsApp message fails.
  }
} 