"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

const SubscriptionPage = () => {
    const [currentPlan, setCurrentPlan] = useState("free"); // free, basic, premium
    const [isLoading, setIsLoading] = useState(false);

    const plans = [
        {
            id: "free",
            name: "Free Plan",
            price: "₦0",
            period: "forever",
            features: [
                "Browse creators",
                "View creator profiles",
                "Limited to 5 profile views per day",
                "Basic search filters"
            ],
            limitations: [
                "Cannot contact creators",
                "No WhatsApp integration",
                "Limited access"
            ],
            buttonText: "Current Plan",
            disabled: true
        },
        {
            id: "basic",
            name: "Basic Plan",
            price: "₦5,000",
            period: "per month",
            features: [
                "Everything in Free",
                "Contact up to 10 creators per month",
                "WhatsApp integration",
                "Advanced search filters",
                "Creator contact information",
                "Email support"
            ],
            buttonText: "Upgrade to Basic",
            disabled: false,
            popular: false
        },
        {
            id: "premium",
            name: "Premium Plan",
            price: "₦15,000",
            period: "per month",
            features: [
                "Everything in Basic",
                "Unlimited creator contacts",
                "Priority support",
                "Advanced analytics",
                "Custom collaboration templates",
                "Dedicated account manager",
                "Early access to new features"
            ],
            buttonText: "Upgrade to Premium",
            disabled: false,
            popular: true
        }
    ];

    const handleSubscribe = async (planId: string) => {
        if (planId === "free") return;
        
        setIsLoading(true);
        
        // Paystack integration would go here
        // For now, simulate payment process
        setTimeout(() => {
            setCurrentPlan(planId);
            setIsLoading(false);
            alert(`Successfully subscribed to ${plans.find(p => p.id === planId)?.name}!`);
        }, 2000);
    };

    return (
        <Layout title="Subscription Plans">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="h2 mb-4">Choose Your Plan</h1>
                </div>

                {/* Current Plan Status */}
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="h5 mb-1">Current Plan</h3>
                            <p className="text-t-secondary">
                                You are currently on the <strong>{plans.find(p => p.id === currentPlan)?.name}</strong>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="h4 text-primary-01">{plans.find(p => p.id === currentPlan)?.price}</p>
                            <p className="text-sm text-t-secondary">{plans.find(p => p.id === currentPlan)?.period}</p>
                        </div>
                    </div>
                </div>

                {/* Pricing Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`card p-6 relative ${
                                plan.popular ? 'ring-2 ring-primary-01' : ''
                            } ${
                                currentPlan === plan.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary-01 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="h5 mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="h2 text-primary-01">{plan.price}</span>
                                    <span className="text-t-secondary">/{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Icon name="check" className="w-5 h-5 text-green-600 mr-3 mt-0.5 shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                                {plan.limitations && plan.limitations.map((limitation, index) => (
                                    <li key={`limit-${index}`} className="flex items-start">
                                        <Icon name="close" className="w-5 h-5 text-red-600 mr-3 mt-0.5 shrink-0" />
                                        <span className="text-sm text-t-secondary">{limitation}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                isBlack={plan.popular}
                                isWhite={!plan.popular}
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={plan.disabled || isLoading || currentPlan === plan.id}
                            >
                                {currentPlan === plan.id ? "Current Plan" : 
                                 isLoading ? "Processing..." : plan.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Payment Methods */}
                <div className="card p-6">
                    <h3 className="h5 mb-4">Payment Methods</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center justify-center p-4 bg-b-surface2 rounded-xl">
                            <span className="font-medium text-sm">Paystack</span>
                        </div>
                        <div className="flex items-center justify-center p-4 bg-b-surface2 rounded-xl">
                            <span className="font-medium text-sm">Card</span>
                        </div>
                        <div className="flex items-center justify-center p-4 bg-b-surface2 rounded-xl">
                            <span className="font-medium text-sm">Bank Transfer</span>
                        </div>
                        <div className="flex items-center justify-center p-4 bg-b-surface2 rounded-xl">
                            <span className="font-medium text-sm">USSD</span>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="card p-6">
                    <h3 className="h5 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Can I cancel my subscription anytime?</h4>
                            <p className="text-sm text-t-secondary">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">What happens if I exceed my plan limits?</h4>
                            <p className="text-sm text-t-secondary">You'll be prompted to upgrade to a higher plan to continue accessing premium features.</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                            <p className="text-sm text-t-secondary">We offer a 7-day money-back guarantee for all paid plans if you're not satisfied.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SubscriptionPage; 