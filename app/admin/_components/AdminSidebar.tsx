"use client";

import Logo from "@/components/Logo";
import ThemeButton from "@/components/ThemeButton";
import NavLink from "@/components/NavLink";
import Button from "@/components/Button";
import Dropdown from "@/components/Sidebar/Dropdown";

import { adminNavigation } from "@/contstants/navigation";

const AdminSidebar = () => (
    <div className="fixed top-0 left-0 bottom-0 flex flex-col w-85 p-5 bg-b-surface1 z-30 max-4xl:w-70 max-3xl:w-60 max-xl:w-74 max-md:p-3">
        <Logo className="mb-5" />
        <div className="flex flex-col gap-1 grow overflow-auto -mx-5 px-5 scrollbar scrollbar-thumb-t-tertiary/50 scrollbar-track-b-surface2 max-md:-mx-3 max-md:px-3">
            {adminNavigation.map((item) =>
                item.href ? (
                    <NavLink key={item.title} value={item} />
                ) : (
                    <Dropdown key={item.title} value={item} />
                )
            )}
        </div>
        <div className="mt-auto pt-6 max-md:pt-4">
            <ThemeButton />
        </div>
    </div>
);

export default AdminSidebar;
