"use client";

import CardChartPie from "@/components/CardChartPie";
import Overview from "./Overview";
import TrafficСhannel from "./TrafficСhannel";
import ActiveTimes from "./ActiveTimes";
// import ShareProducts from "./ShareProducts";
// import RefundRequests from "./RefundRequests";
import Countries from "./Countries";
import Messages from "./Messages";
import { devicesChartData, devicesGenderData, customersOverviewChartData } from "@/mocks/charts";
import { overview } from "@/mocks/customers";

const OverviewPage = () => {
    // Transform overview data to match expected format
    const transformedOverviewData = overview.map(item => ({
        id: item.id.toString(),
        title: item.title,
        value: parseInt(item.counter.replace(/k/g, '000').replace(/,/g, '')),
        icon: item.icon,
        color: "#10b981" // default green color
    }));

    return (
        <div className="center-with-sidebar pb-5">
            <div className="flex max-lg:flex-col">
                <div className="col-left">
                    <Overview 
                        data={transformedOverviewData}
                        monthlyStats={customersOverviewChartData}
                        topCreators={[]}
                    />
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

export default OverviewPage;
