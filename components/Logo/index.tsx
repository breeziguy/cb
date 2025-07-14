import Link from "next/link";
import Image from "@/components/Image";

type LogoProps = {
    className?: string;
};

const Logo = ({ className }: LogoProps) => {
    return (
        <Link className={`block w-12 h-12 ${className || ""}`} href="/">
            <Image
                className="size-full opacity-100"
                src="/images/Group 1000006146.svg"
                alt="logo"
                width={48}
                height={48}
                priority
                quality={100}
            />
        </Link>
    );
};

export default Logo;
