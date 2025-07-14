"use client";

import Layout from "@/components/Layout";
import Statistics from "./Statistics";
import BriefHistory from "./PayoutHistory";

const PayoutsPage = () => {
    return (
        <Layout title="Dashboard">
            <Statistics />
            <BriefHistory />
        </Layout>
    );
};

export default PayoutsPage;
