"use client";

import { useEffect, useState } from "react";
import Search from "@/components/Search";
import AdminCustomerList from "@/app/admin/_templates/AdminCustomerList";
import { customers } from "@/mocks/customers";

const AdminCustomerListPage = () => {
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="pb-5">
            <div className="card p-0 overflow-hidden">
                <div className="flex items-start">
                    <div className="p-3 pb-0 transition-all duration-300 w-full">
                        <div className="mb-3">
                            <Search
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email"
                                isGray
                            />
                        </div>
                        <div className="h-[calc(100vh-14rem)] overflow-y-auto scrollbar-none">
                            <AdminCustomerList items={filteredCustomers} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomerListPage; 