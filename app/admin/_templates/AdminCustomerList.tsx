import Link from "next/link";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { Customer } from "@/types/customer";

const tableHead = ["Customer", "Email", "Wallet", "Brief"];

type ListProps = {
    items: Customer[];
};

const AdminCustomerList = ({ items }: ListProps) => {
    return (
        <Table
            cellsThead={tableHead.map((head) => (
                <th key={head}>{head}</th>
            ))}
        >
            {items.map((item) => (
                <TableRow key={item.id}>
                    <td>
                        <div className="inline-flex items-center">
                            <div className="relative z-2 shrink-0">
                                <Image
                                    className="size-10 rounded-full object-cover"
                                    src={item.avatar}
                                    width={40}
                                    height={40}
                                    alt={item.name}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="text-sub-title-1">{item.name}</div>
                            </div>
                        </div>
                    </td>
                    <td>{item.email}</td>
                    <td>$0.00</td>
                    <td>No Brief</td>
                </TableRow>
            ))}
        </Table>
    );
};

export default AdminCustomerList; 