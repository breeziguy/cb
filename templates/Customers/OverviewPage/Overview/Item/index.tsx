import Icon from "@/components/Icon";

type ItemProps = {
    value: {
        id: string;
        title:string;
        value: number;
        icon: string;
        color: string;
    };
};

const Item = ({ value }: ItemProps) => (
    <div className="flex-1 pr-6 border-r border-shade-07/10 last:border-r-0 max-4xl:nth-3:hidden max-4xl:nth-2:border-r-0 max-md:flex-auto max-md:shrink-0 max-md:w-68 max-md:nth-3:block max-md:nth-2:border-r">
        <div className="flex items-center justify-center w-16 h-16 mb-10 rounded-full bg-b-surface1">
            <Icon
                name={value.icon}
                fill={value.color}
            />
        </div>
        <div className="relative">
            <div className="relative z-2 grow">
                <div className="flex items-center gap-2 mb-2">
                    <div className="text-sub-title-1">{value.title}</div>
                </div>
                <div className="flex mb-3">
                    <div className="text-h2">{value.value}</div>
                </div>
            </div>
        </div>
    </div>
);

export default Item;
