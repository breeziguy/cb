"use client";

import { Element } from "react-scroll";
import Layout from "@/components/Layout";
import Menu from "./Menu";
import ProfileInformation from "./ProfileInformation";
import SocialLinks from "./SocialLinks";
import Password from "./Password";
import Notifications from "./Notifications";

const ElementWithOffset = ({
    className,
    name,
    children,
}: {
    className?: string;
    name: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="relative">
            <Element
                className={`absolute -top-21 left-0 right-0 ${className || ""}`}
                name={name}
            ></Element>
            {children}
        </div>
    );
};

const SettingsPage = () => {
    const navigation = [
        {
            title: "Social Links",
            icon: "share",
            description: "Manage social media profiles",
            to: "social-links",
        },
        {
            title: "Security",
            icon: "lock",
            description: "Change password",
            to: "security",
        },
        {
            title: "Notifications",
            icon: "bell",
            description: "Change the way you receive notifications",
            to: "notifications",
        },
    ];

    return (
        <Layout title="">
            <div className="flex items-start max-lg:block">
                <Menu
                    profileInformationTo="profile-information"
                    items={navigation}
                />
                <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
                    <ElementWithOffset
                        className="-top-22"
                        name="profile-information"
                    >
                        <ProfileInformation />
                    </ElementWithOffset>
                    <ElementWithOffset name="social-links">
                        <SocialLinks />
                    </ElementWithOffset>
                    <ElementWithOffset name="security">
                        <Password />
                    </ElementWithOffset>
                    <ElementWithOffset name="notifications">
                        <Notifications />
                    </ElementWithOffset>
                </div>
            </div>
        </Layout>
    );
};

export default SettingsPage;
