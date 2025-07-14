"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Notification from "./Notification";
import Filter from "./Filter";
import { useNotifications } from "@/contexts/NotificationContext";

const categories = [
    { id: 1, name: "Recent" },
    { id: 2, name: "Earlier" },
];

const NotificationsPage = () => {
    const [category, setCategory] = useState(categories[0]);
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, markAllAsRead } = useNotifications();

    // Use only real notifications from context
    const displayNotifications = notifications;

    return (
        <>
            <Layout title="Notifications">
                <div className="flex items-start">
                    <div className="w-full card mb-0 pb-8">
                        <div className="flex mb-6">
                            <Tabs
                                items={categories}
                                value={category}
                                setValue={setCategory}
                            />

                            <Button 
                                className="ml-auto max-md:!hidden" 
                                isBlack
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </Button>
                            <Button
                                className="!hidden ml-3 max-lg:!flex max-md:ml-auto"
                                icon="filters"
                                isCircle
                                isStroke
                                onClick={() => setIsOpen(true)}
                            />
                        </div>
                        <div className="">
                            {displayNotifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-t-secondary">No notifications yet</p>
                                </div>
                            ) : (
                                displayNotifications.map((notification) => (
                                    <Notification
                                        value={notification}
                                        key={notification.id}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </Layout>
            <Modal
                classWrapper=""
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Filter />
            </Modal>
        </>
    );
};

export default NotificationsPage;

