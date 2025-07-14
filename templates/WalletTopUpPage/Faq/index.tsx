"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs";
import Item from "./Item";
import { TabsOption } from "@/types/tabs";

// Wallet Top-up FAQs
const walletFaqs = [
    {
        id: 1,
        name: "Payments",
        items: [
            {
                id: 1,
                title: "What payment methods are accepted?",
                content: "We accept all major Nigerian bank cards (Visa, Mastercard, Verve), bank transfers, and USSD payments through our secure Paystack integration."
            },
            {
                id: 2,
                title: "Is my payment information secure?",
                content: "Yes, all payments are processed through Paystack, a PCI DSS compliant payment processor. We never store your card details on our servers."
            },
            {
                id: 3,
                title: "How long does it take for funds to reflect?",
                content: "Wallet top-ups are instant. Your funds will be available immediately after successful payment confirmation."
            },
            {
                id: 4,
                title: "Are there any transaction fees?",
                content: "Paystack charges a small transaction fee (1.5% + ₦100 for Nigerian cards). This fee is clearly displayed before you complete your payment."
            }
        ]
    },
    {
        id: 2,
        name: "Wallet Usage",
        items: [
            {
                id: 1,
                title: "How do I use my wallet balance?",
                content: "Your wallet balance is automatically used when sending briefs to creators. The brief amount will be deducted from your wallet when the creator accepts the collaboration."
            },
            {
                id: 2,
                title: "Can I get a refund if a creator rejects my brief?",
                content: "Yes, if a creator rejects your brief, the full amount is automatically refunded to your wallet balance."
            },
            {
                id: 3,
                title: "What happens if I don't have enough balance for a brief?",
                content: "You'll be prompted to top up your wallet before you can send the brief. You can add the exact amount needed or choose from our quick top-up options."
            },
            {
                id: 4,
                title: "Can I withdraw money from my wallet?",
                content: "Currently, wallet funds can only be used for creator collaborations on the platform. We're working on withdrawal options for future updates."
            }
        ]
    },
    {
        id: 3,
        name: "Account",
        items: [
            {
                id: 1,
                title: "Is there a minimum top-up amount?",
                content: "The minimum top-up amount is ₦500. This ensures you can fund at least basic collaborations with micro-influencers."
            },
            {
                id: 2,
                title: "Is there a maximum wallet balance limit?",
                content: "There's no maximum limit on your wallet balance. You can top up as much as needed for your collaboration campaigns."
            },
            {
                id: 3,
                title: "Can I see my transaction history?",
                content: "Yes, you can view all your wallet transactions, top-ups, and brief payments in your account settings under 'Transaction History'."
            },
            {
                id: 4,
                title: "What if I encounter a payment error?",
                content: "If you encounter any payment issues, please contact our support team immediately. We'll help resolve the issue and ensure your funds are properly credited."
            }
        ]
    }
];

const Faq = () => {
    const [activeTab, setActiveTab] = useState(walletFaqs[0]);
    const [activeItemId, setActiveItemId] = useState<number | null>(null);
    
    const handleTabChange = (tab: TabsOption) => {
        setActiveTab(walletFaqs[tab.id - 1]);
        setActiveItemId(null);
    };

    const handleItemClick = (itemId: number) => {
        setActiveItemId(activeItemId === itemId ? null : itemId);
    };

    const currentItems = walletFaqs[activeTab.id - 1]?.items || [];

    return (
        <div className="">
            <h2 className="mb-10 text-center text-h3 max-lg:mb-6 max-lg:text-h4 max-md:text-left">
                Frequently asked questions
            </h2>
            <Tabs
                className="justify-center mb-4 max-md:justify-stretch max-md:-mx-6 max-md:overflow-x-auto max-md:scrollbar-none max-md:before:shrink-0 max-md:before:w-5 max-md:after:shrink-0 max-md:after:w-5"
                classButton="max-md:shrink-0"
                items={walletFaqs}
                value={activeTab}
                setValue={handleTabChange}
            />
            <div className="">
                {currentItems.map((item) => (
                    <Item
                        value={item}
                        isActive={activeItemId === item.id}
                        onClick={() => handleItemClick(item.id)}
                        key={`${activeTab.id}-${item.id}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Faq; 