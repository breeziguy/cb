import Link from "next/link";
import Icon from "@/components/Icon";
import Image from "@/components/Image";

type NotificationProps = {
    value: {
        id: number | string;
        type: string;
        login: string;
        action: string;
        product: string;
        content?: string;
        description?: string;
        avatar: string;
        time: string;
        new: boolean;
        creator_id?: string;
    };
};

const getIconForNotificationType = (type: string, isNew: boolean) => {
    const baseClass = `max-md:!size-4 ${isNew ? '' : 'fill-t-secondary/50'}`;
    
    switch (type) {
        case "wallet":
            return {
                name: "wallet" as const,
                className: `${baseClass} ${isNew ? '!fill-green-500' : ''}`,
            };
        case "brief":
        case "brief_accept":
            return {
                name: "check-circle" as const,
                className: `${baseClass} ${isNew ? '!fill-blue-500' : ''}`,
            };
        case "brief_reject":
            return {
                name: "close" as const,
                className: `${baseClass} ${isNew ? '!fill-red-500' : ''}`,
            };
        case "favorite":
            return {
                name: "heart-fill" as const,
                className: `${baseClass} ${isNew ? '!fill-pink-500' : ''}`,
            };
        case "like":
            return {
                name: "heart-fill" as const,
                className: `${baseClass} ${isNew ? '!fill-primary-03' : ''}`,
            };
        case "purchase":
            return {
                name: "cart" as const,
                className: `${baseClass} ${isNew ? '!fill-primary-02' : ''}`,
            };
        case "reply":
            return {
                name: "reply" as const,
                className: `${baseClass} ${isNew ? '!fill-t-secondary' : ''}`,
            };
        default:
            return {
                name: "bell" as const,
                className: baseClass,
            };
    }
};

const Notification = ({ value }: NotificationProps) => {
    const iconConfig = getIconForNotificationType(value.type, value.new);
    
    return (
        <div className="relative group flex items-start p-6 max-md:p-3 max-md:border-t max-md:border-s-subtle max-md:first:border-t-0">
            <div className="box-hover max-md:hidden"></div>
            <div className="relative z-3 flex justify-center items-center shrink-0 mr-5 mt-3 max-md:absolute max-md:top-10 max-md:left-10 max-md:size-6 max-md:bg-b-surface2 max-md:rounded-full max-md:m-0">
                <Icon
                    className={iconConfig.className}
                    name={iconConfig.name}
                />
            </div>
            <Link
                className="relative z-2 shrink-0 w-12 h-12 mr-5 rounded-full overflow-hidden max-md:mr-4"
                href={value.type === "wallet" ? "/wallet" : (value.creator_id ? `/creators/${value.creator_id}` : "/creators")}
            >
                {value.type === "wallet" ? (
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full">
                        <Icon name="wallet" className="w-6 h-6 fill-green-600 dark:fill-green-400" />
                    </div>
                ) : (
                    <Image
                        className="size-12 opacity-100"
                        src={value.avatar}
                        width={48}
                        height={48}
                        alt=""
                    />
                )}
            </Link>
            <div className="relative z-2 grow">
                <div className="text-body-2 max-md:pr-4">
                    <Link href={value.type === "wallet" ? "/wallet" : (value.creator_id ? `/creators/${value.creator_id}` : "/creators")}>
                        <span className="text-t-primary font-medium">{value.login}</span>
                    </Link>
                    <span className="text-t-secondary"> {value.action} </span>
                    <span className="max-md:block max-md:mt-1.5">
                        <Link href={value.type === "wallet" ? "/wallet" : (value.creator_id ? `/creators/${value.creator_id}` : "/creators")}>
                            <span className="text-t-primary font-medium">{value.product}</span>
                        </Link>
                        <span className="hidden ml-1 !text-caption !text-t-tertiary font-normal max-md:inline">
                            {value.time}
                        </span>
                    </span>
                </div>
                {value.description && (
                    <div className="mt-1 text-sm text-t-secondary max-md:mt-1.5 max-md:line-clamp-2">
                        {value.description}
                    </div>
                )}
            </div>
            <div className="relative z-2 flex items-center shrink-0 ml-8 max-md:absolute max-md:top-3 max-md:right-3 max-md:ml-0">
                <div className="text-caption text-t-tertiary max-md:hidden">
                    {value.time}
                </div>
                <div
                    className={`w-3 h-3 ml-3 rounded-full ${
                        value.new ? "bg-primary-02" : "bg-t-secondary/50"
                    }`}
                ></div>
            </div>
        </div>
    );
};

export default Notification;
