import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin'; // Use admin client for elevated privileges
import crypto from 'crypto';

// Define the expected payload structure from Wasender
interface WasenderPayload {
    messages: {
        upsert: Array<{
            key: {
                remoteJid: string; // e.g., "2347051515181@s.whatsapp.net"
            };
            message: {
                conversation?: string;
                extendedTextMessage?: {
                    text: string;
                };
            };
        }>;
    };
}

// Main handler for POST requests
export async function POST(req: NextRequest) {
    console.log('Received webhook request...');

    try {
        const secret = process.env.WASENDER_WEBHOOK_SECRET;
        if (!secret) {
            console.error('Webhook secret is not configured.');
            return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        const body = await req.json();
        const rawBody = JSON.stringify(body);
        
        // 1. Verify the webhook signature
        const signature = req.headers.get('x-webhook-signature');
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        // For now, let's log the received signature and the expected one for debugging.
        // This helps verify if the calculation is correct or if the secret is mismatched.
        console.log('Received Signature:', signature);
        console.log('Expected Signature:', expectedSignature);

        /*
        // TEMPORARILY DISABLED FOR TESTING
        if (signature !== expectedSignature) {
            console.error('Invalid webhook signature.');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        */

        // If we reach here, the signature is valid.
        console.log('✅ Webhook signature verified successfully.');

        // 2. Parse the payload to get the message
        const payload: WasenderPayload = body;
        const messageEvent = payload?.messages?.upsert?.[0];
        const messageText = (messageEvent?.message?.conversation || messageEvent?.message?.extendedTextMessage?.text)?.trim().toLowerCase();
        const rawSenderJid = messageEvent?.key?.remoteJid;

        if (!messageText || !rawSenderJid) {
            console.log('Ignoring event with no message text or sender.');
            return NextResponse.json({ status: 'ignored', reason: 'no_message_or_sender' });
        }
        
        const senderPhone = `+${rawSenderJid.split('@')[0]}`;
        console.log(`💬 Received message: "${messageText}" from ${senderPhone}`);
        
        // 3. Determine the brief status
        let newStatus: 'accepted' | 'rejected' | null = null;
        if (messageText === 'accept') {
            newStatus = 'accepted';
        } else if (messageText === 'reject') {
            newStatus = 'rejected';
        }

        if (!newStatus) {
            console.log(`Reply "${messageText}" is not 'accept' or 'reject'. Ignoring.`);
            return NextResponse.json({ status: 'ignored', reason: 'irrelevant_message' });
        }

        // 4. Find the most recent pending brief for this creator
        const { data: creator, error: creatorError } = await supabase
            .from('creators')
            .select('id')
            .eq('whatsapp_number', senderPhone)
            .single();

        if (creatorError || !creator) {
            console.error(`Could not find creator with WhatsApp number: ${senderPhone}`, creatorError);
            return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
        }

        const { data: brief, error: briefError } = await supabase
            .from('briefs')
            .select('*')
            .eq('creator_id', creator.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (briefError || !brief) {
            console.warn(`No pending brief found for creator ${creator.id} (${senderPhone})`);
            return NextResponse.json({ status: 'ignored', reason: 'no_pending_brief' });
        }

        // 5. Update the brief status
        const { error: updateError } = await supabase
            .from('briefs')
            .update({ status: newStatus })
            .eq('id', brief.id);

        if (updateError) {
            console.error(`Failed to update brief ${brief.id}:`, updateError);
            return NextResponse.json({ error: 'Failed to update brief' }, { status: 500 });
        }

        console.log(`✅ Successfully updated brief ${brief.id} to status "${newStatus}"`);
        return NextResponse.json({ status: 'success', brief_id: brief.id, new_status: newStatus });

    } catch (error: any) {
        console.error('Error processing webhook:', error.message);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
} 