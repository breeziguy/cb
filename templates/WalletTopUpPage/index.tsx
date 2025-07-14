"use client";

import Layout from "@/components/Layout";
import TopUpOptions from "./TopUpOptions";
import Faq from "./Faq";

const WalletTopUpPage = () => {
    return (
        <Layout title="">
            <div className="card px-12 py-22 max-lg:p-8 max-lg:px-6">
                <div className="max-w-215 mx-auto">
                    <TopUpOptions />
                    <Faq />
                </div>
            </div>
        </Layout>
    );
};

export default WalletTopUpPage; 