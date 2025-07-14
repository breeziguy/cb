import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Image from "@/components/Image";
import { useNotifications } from "@/contexts/NotificationContext";

const Notifications = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    
    // Show only recent notifications (latest 5)
    const recentNotifications = notifications.slice(0, 5);

    return (
        <>
            <div className="relative">
                <Button 
                    isWhite 
                    isCircle 
                    onClick={() => {
                        setIsOpen(true);
                        markAllAsRead(); // Mark as read when opening
                    }}
                >
                    <Icon name="bell" />
                </Button>
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                )}
            </div>
            <Modal 
                open={isOpen} 
                onClose={() => {
                    setIsOpen(false);
                    markAllAsRead(); // Mark notifications as read when closing
                }} 
                isSlidePanel
            >
                <div className="flex items-center h-20 pl-10 pr-20 pt-5 pb-3 text-h5 max-md:h-18 max-md:pt-3 max-md:pl-9">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="h-[calc(100svh-5rem)] px-5 pb-5 overflow-y-auto max-md:h-[calc(100svh-4.5rem)] max-md:px-4">
                    {recentNotifications.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-t-secondary">
                            No notifications yet
                        </div>
                    ) : (
                        recentNotifications.map((notification) => (
                            <div
                                className="group relative flex items-center p-5"
                                key={notification.id}
                            >
                                <div className="absolute inset-0 gradient-card rounded-[16px] invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                                    <div className="absolute inset-[1.5px] bg-b-highlight rounded-[14.5px]"></div>
                                </div>
                                <Link
                                    className="relative z-2 shrink-0 w-12 h-12 rounded-full overflow-hidden"
                                    href={notification.type === "wallet" ? "/wallet" : "/creators"}
                                >
                                    {notification.type === "wallet" ? (
                                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full">
                                            <Icon name="wallet" className="w-6 h-6 fill-green-600 dark:fill-green-400" />
                                        </div>
                                    ) : (
                                        <Image
                                            className="size-12 rounded-full opacity-100"
                                            src={notification.avatar}
                                            width={48}
                                            height={48}
                                            alt=""
                                        />
                                    )}
                                </Link>
                                <div className="relative z-2 w-[calc(100%-3rem)] pl-4">
                                    <div className="truncate text-body-2">
                                        <Link href={notification.type === "wallet" ? "/wallet" : (notification.creator_id ? `/creators/${notification.creator_id}` : "/creators")}>
                                            <span className="text-t-primary font-medium">{notification.login}</span>
                                        </Link>
                                        <span className="text-t-secondary"> {notification.action} </span>
                                        <Link href={notification.type === "wallet" ? "/wallet" : (notification.creator_id ? `/creators/${notification.creator_id}` : "/creators")}>
                                            <span className="text-t-primary font-medium">{notification.product}</span>
                                        </Link>
                                    </div>
                                    {notification.description && (
                                        <div className="mt-1 text-xs text-t-secondary truncate">
                                            {notification.description}
                                        </div>
                                    )}
                                    <div className="mt-1 text-caption text-t-tertiary">
                                        {notification.time}
                                    </div>
                                    {notification.new && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <Button
                    className="!absolute left-1/2 bottom-5 z-3 -translate-x-1/2"
                    isBlack
                    as="link"
                    href="/notifications"
                >
                    All notifications
                </Button>
            </Modal>
        </>
    );
};

export default Notifications;
