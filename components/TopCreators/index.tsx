import Link from "next/link";
import Icon from "@/components/Icon";
import Image from "@/components/Image";

type TopCreatorsProps = {
    className?: string;
    users?: {
        name: string;
        username: string;
        avatar_url: string;
    }[];
};

const TopCreators = ({ className, users }: TopCreatorsProps) => (
    <div className={`${className || ""}`}>
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
                <div className="text-[1.125rem] font-medium tracking-[-0.01em]">
                    Top Creators
                </div>
            </div>
            <div className="text-body-2 text-t-secondary">
                Top creators by followers.
            </div>
        </div>
        <div className="relative before:hidden after:hidden before:absolute before:-left-6 before:top-0 before:bottom-0 before:z-3 before:w-10 before:bg-linear-to-r before:from-b-surface2 before:to-transparent before:pointer-events-none after:absolute after:-right-6 after:top-0 after:bottom-0 after:z-3 after:w-10 after:bg-linear-to-l after:from-b-surface2 after:to-transparent after:pointer-events-none max-md:before:block max-md:after:block">
            <div className="flex max-md:overflow-auto max-md:-mx-6 max-md:px-6 max-md:scrollbar-none">
                {users?.map((creator) => (
                    <div
                        className="flex-1 px-1 py-8 text-center max-3xl:nth-[n+6]:hidden max-[1349px]:nth-[n+5]:hidden max-md:shrink-0 max-md:flex-auto max-md:w-30 max-md:!block"
                        key={creator.username}
                    >
                        <div className="">
                            <Image
                                className="size-16 rounded-full object-cover opacity-100"
                                src={creator.avatar_url || '/images/content/avatar-1.jpg'}
                                width={64}
                                height={64}
                                alt={creator.name || "avatar"}
                            />
                        </div>
                        <div className="mt-4 text-button text-t-secondary max-md:truncate">
                            {creator.name}
                        </div>
                    </div>
                ))}
                <div className="flex-1 px-2 py-8 text-center max-md:shrink-0 max-md:flex-auto max-md:w-30">
                    <Link
                        className="group inline-flex flex-col justify-center items-center"
                        href="/admin/creators"
                    >
                        <div className="flex justify-center items-center size-16 rounded-full border border-s-stroke2 transition-colors group-hover:border-s-highlight group-hover:shadow-depth">
                            <Icon
                                className="fill-t-secondary transition-colors group-hover:fill-t-primary"
                                name="arrow"
                            />
                        </div>
                        <div className="mt-4 text-button text-t-secondary transition-colors group-hover:text-t-primary">
                            View all
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default TopCreators; 