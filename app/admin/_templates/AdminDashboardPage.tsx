"use client";

import CardChartPie from "@/components/CardChartPie";
import Overview from "@/templates/Customers/OverviewPage/Overview";
import TrafficСhannel from "@/templates/Customers/OverviewPage/TrafficСhannel";
import ActiveTimes from "@/templates/Customers/OverviewPage/ActiveTimes";
// import ShareProducts from "./ShareProducts";
// import RefundRequests from "./RefundRequests";
import Countries from "@/templates/Customers/OverviewPage/Countries";
import Messages from "@/templates/Customers/OverviewPage/Messages";
import { devicesChartData, devicesGenderData } from "@/mocks/charts";

type AdminDashboardPageProps = {
    totalCustomers: number;
    totalCreators: number;
    totalBriefs: number;
    topCreators: any[];
    briefsLast12Months: { month: string; value: number }[];
};

const AdminDashboardPage = ({
    totalCustomers,
    totalCreators,
    totalBriefs,
    topCreators,
    briefsLast12Months,
}: AdminDashboardPageProps) => {
    const overviewData = [
        {
            id: "1",
            title: "Total Customers",
            value: totalCustomers,
            icon: "profile-circle",
            color: "#8E55EA",
        },
        {
            id: "2",
            title: "Total Creators",
            value: totalCreators,
            icon: "people",
            color: "#3C976E",
        },
        {
            id: "3",
            title: "Total Briefs",
            value: totalBriefs,
            icon: "briefcase",
            color: "#E3A342",
        },
    ];

    return (
        <div className="center-with-sidebar pb-5">
            <div className="flex max-lg:flex-col">
                <div className="col-left">
                    <Overview data={overviewData} monthlyStats={briefsLast12Months} topCreators={topCreators} />
                    <TrafficСhannel />
                    <ActiveTimes />
                </div>
                <div className="col-right">
                    <CardChartPie title="Devices" data={devicesChartData} />
                    <Countries />
                    <Messages />
                    <CardChartPie title="Gender" data={devicesGenderData} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage; 