import { useState } from "react";
import Link from "next/link";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { CreatorProfileData } from "@/mocks/creators";

const tableHead = [
    "Creator",
    "Platform",
    "Followers",
    "Status",
];

type ListProps = {
    items: CreatorProfileData[];
    selectedRows: number[];
    onRowSelect: (id: number) => void;
    selectAll: boolean;
    onSelectAll: () => void;
};

const List = ({
    selectedRows,
    onRowSelect,
    selectAll,
    onSelectAll,
    items,
}: ListProps) => {
    const [activeRow, setActiveRow] = useState<number | null>(null);
    return (
        <>
            <Table
                selectAll={selectAll}
                onSelectAll={onSelectAll}
                cellsThead={tableHead.map((head) => (
                    <th
                        className="max-2xl:nth-3:hidden max-lg:nth-6:hidden max-lg:nth-7:hidden"
                        key={head}
                    >
                        {head}
                    </th>
                ))}
            >
                {items.map((item) => (
                    <TableRow
                        selectedRows={selectedRows.includes(Number(item.id))}
                        onRowSelect={() => onRowSelect(Number(item.id))}
                        key={item.id}
                        onClick={() => setActiveRow(Number(item.id))}
                    >
                        <td>
                            <div className="inline-flex items-center max-md:flex max-md:items-start">
                                <div className="relative z-2 shrink-0">
                                    <Image
                                        className="size-16 rounded-full opacity-100 object-cover"
                                        src={item.avatarUrl}
                                        width={64}
                                        height={64}
                                        alt=""
                                    />
                                </div>
                                <div className="max-w-64 ml-5 max-md:ml-4 max-md:grow max-md:max-w-full">
                                    <div className="pt-0.5 text-sub-title-1 max-md:mb-0.5 max-md:pt-0">
                                        {item.name}
                                    </div>
                                    <div className="relative">
                                        <div
                                            className={`absolute top-0 left-0 text-body-2 text-t-secondary/80 transition-all group-hover:invisible group-hover:opacity-0 max-md:static ${
                                                activeRow === Number(item.id)
                                                    ? "max-lg:invisible max-lg:opacity-0"
                                                    : ""
                                            }`}
                                        >
                                            {item.specialties?.join(", ") || "No specialty"}
                                        </div>
                                        <div
                                            className={`flex flex-wrap gap-2 mt-0.5 -ml-1 invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100 max-md:-mr-1 max-md:absolute max-md:top-0 max-md:left-0 max-md:right-0 max-md:flex-col max-md:gap-0.5 ${
                                                activeRow === Number(item.id)
                                                    ? "max-lg:visible max-lg:opacity-100"
                                                    : ""
                                            }`}
                                        >
                                            <button className="action">
                                                <Icon name="chat" />
                                                Message
                                            </button>
                                            <Link
                                                className="action"
                                                href={`/admin/creators/details/${item.id}`}
                                            >
                                                <Icon name="arrow-up-right" />
                                                Edit
                                            </Link>
                                            <button className="action">
                                                <Icon name="block" />
                                                Deactivate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="max-2xl:hidden">
                            <div className="flex gap-2">
                                {item.socialLinks?.map((link, index) => (
                                    <div key={index} className="flex items-center gap-1 px-2 py-1 bg-b-surface2 rounded text-xs">
                                        <Icon name={link.platform} className="w-3 h-3" />
                                        {link.platform}
                                    </div>
                                ))}
                            </div>
                        </td>
                        <td className="max-md:hidden">
                            <div className="text-center">
                                <div className="h6">{item.socialLinks?.[0]?.followers || 0}</div>
                                <div className="caption1 text-t-secondary">
                                    {item.socialLinks?.[0]?.platform || 'N/A'}
                                </div>
                            </div>
                        </td>
                        <td className="max-md:hidden">
                            <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                            </div>
                        </td>
                    </TableRow>
                ))}
            </Table>
            <div className="flex justify-center gap-1 pt-1 pb-4 max-md:pt-3 max-md:pb-1">
                <Button
                    className="rotate-180"
                    icon="arrow"
                    isCircle
                    isStroke
                    disabled
                />
                <Button icon="arrow" isCircle isStroke />
            </div>
        </>
    );
};

export default List; 