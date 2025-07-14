"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Field from "@/components/Field";

const WalletPage = () => {
    const [balance, setBalance] = useState(250.00); // Mock balance
    const [showAddFunds, setShowAddFunds] = useState(false);
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddFunds = async () => {
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            const addedAmount = parseFloat(amount);
            if (addedAmount > 0) {
                setBalance(prev => prev + addedAmount);
                setAmount("");
                setShowAddFunds(false);
            }
            setIsLoading(false);
        }, 2000);
    };

    const recentTransactions = [
        { id: 1, type: "Brief Payment", creator: "Fatima Bello", amount: -50.00, date: "2024-01-15", status: "Completed" },
        { id: 2, type: "Funds Added", creator: "", amount: 100.00, date: "2024-01-14", status: "Completed" },
        { id: 3, type: "Brief Payment", creator: "Adanna Eze", amount: -75.00, date: "2024-01-12", status: "Completed" },
        { id: 4, type: "Brief Payment", creator: "Chinedu Okafor", amount: -25.00, date: "2024-01-10", status: "Pending" },
    ];

    return (
        <Layout title="">
            <div className="space-y-6">
                {/* Balance Card */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="h4">Account Balance</h2>
                        <Button 
                            isBlack
                            onClick={() => setShowAddFunds(true)}
                        >
                            <Icon name="plus" className="w-4 h-4 mr-2" />
                            Add Funds
                        </Button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                                <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Icon name="wallet" className="w-6 h-6" />
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-blue-100 text-sm">
                                Minimum balance required for brief submission: <strong>$25.00</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-4 text-center">
                        <Icon name="plus" className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-medium mb-1">Add Funds</h3>
                        <p className="text-sm text-t-secondary">Top up your account</p>
                    </div>
                    <div className="card p-4 text-center">
                        <Icon name="chart" className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-medium mb-1">Spending Report</h3>
                        <p className="text-sm text-t-secondary">View your expenses</p>
                    </div>
                    <div className="card p-4 text-center">
                        <Icon name="settings" className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <h3 className="font-medium mb-1">Payment Methods</h3>
                        <p className="text-sm text-t-secondary">Manage cards & billing</p>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="card p-6">
                    <h3 className="h5 mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 bg-b-surface2 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        transaction.amount > 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                                    }`}>
                                        <Icon 
                                            name={transaction.amount > 0 ? "arrow-down" : "arrow-up"} 
                                            className={`w-5 h-5 ${
                                                transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`} 
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{transaction.type}</p>
                                        {transaction.creator && (
                                            <p className="text-sm text-t-secondary">{transaction.creator}</p>
                                        )}
                                        <p className="text-xs text-t-tertiary">{transaction.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-medium ${
                                        transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                    </p>
                                    <p className={`text-xs ${
                                        transaction.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {transaction.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Funds Modal */}
            <Modal 
                open={showAddFunds} 
                onClose={() => setShowAddFunds(false)}
            >
                <div className="space-y-4">
                    <h3 className="h4 mb-4">Add Funds to Wallet</h3>
                    <Field
                        label="Amount"
                        placeholder="Enter amount (USD)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        min="10"
                        step="0.01"
                    />
                    
                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {[25, 50, 100, 200].map((quickAmount) => (
                            <Button
                                key={quickAmount}
                                isWhite
                                className="text-sm"
                                onClick={() => setAmount(quickAmount.toString())}
                            >
                                ${quickAmount}
                            </Button>
                        ))}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <Icon name="info" className="w-4 h-4 inline mr-1" />
                            Funds will be available immediately after payment confirmation.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button 
                            className="flex-1"
                            isWhite
                            onClick={() => setShowAddFunds(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1"
                            isBlack
                            onClick={handleAddFunds}
                            disabled={!amount || parseFloat(amount) < 10 || isLoading}
                        >
                            {isLoading ? "Processing..." : `Add $${amount || "0"}`}
                        </Button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default WalletPage; 