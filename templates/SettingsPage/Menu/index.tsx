"use client";

import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import Search from "@/components/Search";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";

type MenuProps = {
    profileInformationTo: string;
    items: {
        title: string;
        icon: string;
        description: string;
        to: string;
    }[];
};

const Menu = ({ profileInformationTo, items }: MenuProps) => {
    const { session } = useUserRole();
    const user = session?.user;
    const isOnline = true;
    const [search, setSearch] = useState("");
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Load profile data
    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) return;
            
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [user?.id]);

    return (
        <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden">
            <Search
                className="mb-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search settings"
                isGray
            />
            <div className="flex flex-col gap-1">
                <Link
                    className="group relative flex items-center h-18 px-3 cursor-pointer"
                    activeClass="[&_.box-hover]:!visible [&_.box-hover]:!opacity-100"
                    to={profileInformationTo}
                    smooth={true}
                    duration={500}
                    isDynamic={true}
                    spy={true}
                    // offset={-88}
                >
                    <div className="box-hover"></div>
                    <div className="relative z-2 flex justify-center items-center shrink-0 w-11 h-11 rounded-full bg-b-surface1">
                        {loading ? (
                            <div className="size-11 bg-b-surface1 dark:bg-shade-07/20 rounded-full animate-pulse"></div>
                        ) : (
                            <Image
                                className="size-11 opacity-100 rounded-full overflow-hidden"
                                src={profile?.avatar_url || "/placeholder-avatar.svg"}
                                width={44}
                                height={44}
                                alt="Avatar"
                                quality={100}
                            />
                        )}
                        {isOnline && (
                            <div className="absolute right-0 bottom-0 w-[13px] h-[13px] bg-primary-02 border-2 border-b-surface2 rounded-full"></div>
                        )}
                    </div>
                    <div className="relative z-2 grow pl-4">
                        <div className="text-button">
                            {loading ? (
                                <div className="h-4 bg-b-surface1 dark:bg-shade-07/20 rounded animate-pulse w-24"></div>
                            ) : (
                                profile?.full_name || profile?.username || 'No name set'
                            )}
                        </div>
                        <div className="mt-1 text-caption text-t-secondary">
                            {loading ? (
                                <div className="h-3 bg-b-surface1 dark:bg-shade-07/20 rounded animate-pulse w-32"></div>
                            ) : (
                                user?.email || 'No email'
                            )}
                        </div>
                    </div>
                </Link>
                {items.map((item, index) => (
                    <Link
                        className="group relative flex items-center h-18 px-3 cursor-pointer"
                        activeClass="[&_.box-hover]:!visible [&_.box-hover]:!opacity-100"
                        key={index}
                        to={item.to}
                        smooth={true}
                        duration={500}
                        isDynamic={true}
                        spy={true}
                        offset={-5.5}
                    >
                        <div className="box-hover"></div>
                        <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                            <Icon
                                className="fill-t-secondary"
                                name={item.icon}
                            />
                        </div>
                        <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
                            <div className="text-button">{item.title}</div>
                            <div className="mt-1 truncate text-caption text-t-secondary">
                                {item.description}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Menu;
