"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import SearchGlobal from "@/components/Header/SearchGlobal";
import User from "@/components/Header/User";
import Notifications from "@/components/Header/Notifications";
import Messages from "@/components/Header/Messages";

const AdminHeader = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [hasOverflowHidden, setHasOverflowHidden] = useState(false);
    const [visibleSearch, setVisibleSearch] = useState(false);

    const isHideCreateButton = true; // Always hide create button in admin

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "style") {
                    const htmlElement = document.documentElement;
                    const isOverflowHidden =
                        window.getComputedStyle(htmlElement).overflow ===
                        "hidden";
                    setHasOverflowHidden(isOverflowHidden);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["style"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <header
            className={`fixed top-0 right-0 z-20 bg-b-surface1 max-lg:!right-0 ${
                hasOverflowHidden
                    ? "right-[calc(0px+var(--scrollbar-width))]"
                    : ""
            } left-85 max-4xl:left-70 max-3xl:left-60 max-xl:left-0`}
        >
            <div className="flex items-center h-22 max-md:h-18 center-with-sidebar">
                <div className="mr-auto text-h4 max-lg:text-h5 max-md:hidden invisible">
                    Admin Panel
                </div>
                <div className="flex items-center gap-3">
                    <SearchGlobal
                        className="max-md:hidden"
                        onClose={() => setVisibleSearch(false)}
                        visible={visibleSearch}
                    />
                    <Button
                        className="!hidden max-lg:!flex max-md:!hidden"
                        isWhite
                        isCircle
                        onClick={() => setVisibleSearch(true)}
                    >
                        <Icon name="search" />
                    </Button>
                    <Notifications />
                    <Messages />
                    <User />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
