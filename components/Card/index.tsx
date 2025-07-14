import Select from "@/components/Select";

type CardProps = {
    className?: string;
    classHead?: string;
    title: string;
    children: React.ReactNode;
    selectOptions?: { id: number; name: string }[];
    selectValue?: {
        id: number;
        name: string;
    };
    selectOnChange?: (value: { id: number; name: string } | null) => void;
    headContent?: React.ReactNode;
};

const Card = ({
    className,
    classHead,
    title,
    selectOptions,
    selectValue,
    selectOnChange,
    children,
    headContent,
}: CardProps) => (
    <div
        className={`card${className ? ` ${className}` : ""}`}
    >
        <div
            className={`flex justify-between items-center${
                classHead ? ` ${classHead}` : ""
            }`}
        >
            <div className="text-sub-title-1">{title}</div>
            {headContent}
            {selectOptions && selectValue && selectOnChange && (
                <Select
                    className="min-w-40 max-md:min-w-34"
                    value={selectValue}
                    onChange={selectOnChange}
                    options={selectOptions}
                />
            )}
        </div>
        <div className="pt-3">{children}</div>
    </div>
);

Card.displayName = "Card";

export default Card;
