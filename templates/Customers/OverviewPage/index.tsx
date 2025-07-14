"use client";

import CardChartPie from "@/components/CardChartPie";
import Overview from "./Overview";
import TrafficСhannel from "./TrafficСhannel";
import ActiveTimes from "./ActiveTimes";
// import ShareProducts from "./ShareProducts";
// import RefundRequests from "./RefundRequests";
import Countries from "./Countries";
import Messages from "./Messages";
import { devicesChartData, devicesGenderData } from "@/mocks/charts";

const OverviewPage = () => {
    return (
        <div className="center-with-sidebar pb-5">
            <div className="flex max-lg:flex-col">
                <div className="col-left">
                    <Overview />
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
