"use client";

import { useState } from "react";
import Search from "@/components/Search";
import Tabs from "@/components/Tabs";
import Button from "@/components/Button";
import DeleteItems from "@/components/DeleteItems";
import NoFound from "@/components/NoFound";
import Dropdown from "@/components/Dropdown";
import List from "./List";
import { CreatorProfileData } from "@/mocks/creators";
import { creators } from "@/mocks/creators";

const views = [
    { id: 1, name: "All Creators" },
    { id: 2, name: "Active" },
    { id: 3, name: "Inactive" },
];

const AdminCreatorsPage = () => {
    const [search, setSearch] = useState("");
    const [view, setView] = useState(views[0]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleRowSelect = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id)
                ? prev.filter((rowId) => rowId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(creators.map((item) => Number(item.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleDeselect = () => {
        setSelectedRows([]);
        setSelectAll(false);
    };

    const filteredCreators = creators.filter((creator) =>
        creator.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="center-with-sidebar pb-5">
            <div className="card">
                <div className="flex items-center justify-between mb-8 max-md:block">
                    <div className="mr-auto max-md:mb-6">
                        <div className="h4 mb-1">Creators</div>
                        <div className="body2 text-t-secondary">
                            Manage your platform creators
                        </div>
                    </div>
                    <div className="flex max-md:block">
                        <Button 
                            className="mr-3 max-md:mb-3 max-md:mr-0 max-md:w-full"
                            href="/admin/creators/new"
                        >
                            Add Creator
                        </Button>
                        {/* Dropdown component has interface issues - simplified for now */}
                    </div>
                </div>
                <div className="flex items-center mb-6 max-md:block">
                    <Search
                        className="mr-auto max-md:mb-4 max-md:mr-0"
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                        placeholder="Search creators"
                        isGray
                    />
                    <Tabs
                        className="shrink-0 max-md:w-full"
                        items={views}
                        value={view}
                        setValue={setView}
                    />
                </div>
                {selectedRows.length > 0 && (
                    <DeleteItems
                        counter={selectedRows.length}
                        onDelete={handleDeselect}
                    />
                )}
                {filteredCreators.length > 0 ? (
                    <List
                        items={filteredCreators}
                        selectedRows={selectedRows}
                        onRowSelect={handleRowSelect}
                        selectAll={selectAll}
                        onSelectAll={handleSelectAll}
                    />
                ) : (
                    <NoFound title="No creators found" />
                )}
            </div>
        </div>
    );
};

export default AdminCreatorsPage; 