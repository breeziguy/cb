import Image from "@/components/Image";

type CustomerType = {
    name: string;
    email: string;
    avatar: string;
};

type CustomerProps = {
    value: CustomerType;
    isActive: boolean;
    onClick: () => void;
};

const Customer = ({ value, isActive, onClick }: CustomerProps) => (
    <div
        className="group relative flex items-center p-3 cursor-pointer rounded-lg transition-colors hover:bg-b-hover"
        onClick={onClick}
    >
        <div
            className={`absolute inset-0 bg-b-selected rounded-lg ${
                isActive ? "opacity-100" : "opacity-0"
            } transition-opacity`}
        ></div>
        <div className="relative z-1 flex items-center w-full">
            <div className="shrink-0">
                <Image
                    className="size-10 rounded-full object-cover"
                    src={value.avatar}
                    width={40}
                    height={40}
                    alt={value.name}
                />
            </div>
            <div className="flex-1 min-w-0 px-4">
                <div className="truncate text-sub-title-1">{value.name}</div>
            </div>
            <div className="flex-1 min-w-0 hidden md:block">
                <div className="truncate text-body-2 text-t-secondary">
                    {value.email}
                </div>
            </div>
        </div>
    </div>
);

export default Customer;
