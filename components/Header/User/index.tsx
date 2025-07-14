import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    MenuSeparator,
} from "@headlessui/react";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Login from "@/components/Login";
import { navigationUser } from "@/contstants/navigation";
import supabase from "@/lib/supabase";
import { useUserRole } from "@/hooks/useUserRole";

const User = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { session } = useUserRole();
    const isActive = (href: string) => pathname === href;

    // Get user initials from email or name
    const getUserInitials = () => {
        if (!session?.user) return "U";
        
        const email = session.user.email;
        const userMetadata = session.user.user_metadata;
        
        // Try to get name from user metadata first
        if (userMetadata?.full_name) {
            const names = userMetadata.full_name.split(' ');
            return names.length > 1 
                ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
                : names[0][0].toUpperCase();
        }
        
        // Fall back to email initials
        if (email) {
            const emailParts = email.split('@')[0];
            return emailParts.length > 1 ? emailParts.substring(0, 2).toUpperCase() : emailParts[0].toUpperCase();
        }
        
        return "U";
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            setShowLogoutConfirm(false);
            console.log('Logging out user...');
            
            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('Logout error:', error);
                alert('Failed to logout. Please try again.');
                return;
            }
            
            console.log('User logged out successfully');
            
            // Redirect to login page
            router.push('/auth/login');
            
        } catch (error) {
            console.error('Unexpected logout error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <Menu className="group" as="div">
                <div className="fixed inset-0 z-30 bg-b-surface1/70 invisible opacity-0 transition-all group-[[data-open]]:visible group-[[data-open]]:opacity-100"></div>
                <MenuButton className="relative z-40 w-12 h-12 rounded-full flex items-center justify-center transition-colors border-2 border-b-surface2 data-[hover]:border-primary-01 data-[active]:border-primary-01">
                    <div className="size-10 rounded-full bg-primary-01 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {getUserInitials()}
                        </span>
                    </div>
                </MenuButton>
                <MenuItems
                    className="z-100 w-67.5 p-3 rounded-4xl bg-b-surface2 border-1 border-s-subtle outline-none shadow-dropdown [--anchor-gap:0.625rem] [--anchor-offset:0.625rem] origin-top transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 max-md:w-[calc(100vw-1.5rem)] max-md:[--anchor-offset:0]"
                    anchor="bottom end"
                    transition
                >
                    {navigationUser.map((link, index) => (
                        <MenuItem key={index}>
                            <Link
                                className={`group/item relative flex items-center h-12 px-3 text-button text-t-secondary transition-colors data-[focus]:text-t-primary before:absolute before:inset-0 before:rounded-[16px] before:bg-linear-to-b before:from-shade-09 before:to-[#ebebeb] before:opacity-0 before:transition-opacity after:absolute after:inset-0.25 after:bg-b-pop after:rounded-[15px] after:opacity-0 after:transition-opacity ${
                                    isActive(link.href)
                                        ? "!text-t-primary before:opacity-100 after:opacity-100 dark:before:opacity-[0.075]"
                                        : ""
                                }`}
                                href={link.href}
                            >
                                <Icon
                                    className={`relative z-2 mr-4 fill-t-secondary transition-colors group-[[data-focus]]/item:fill-t-primary ${
                                        isActive(link.href)
                                            ? "!fill-t-primary"
                                            : ""
                                    }`}
                                    name={link.icon}
                                />
                                <div className="relative z-2">{link.title}</div>
                            </Link>
                        </MenuItem>
                    ))}
                    <MenuSeparator className="-mx-3 my-3 h-px bg-s-subtle" />
                    <MenuItem>
                        <button
                            className="group/item flex items-center w-full h-12 px-3 text-button text-t-secondary transition-colors data-[focus]:text-t-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                        >
                            <Icon
                                className="mr-4 fill-t-secondary transition-colors group-[[data-focus]]/item:fill-t-primary"
                                name="logout"
                            />
                            {isLoggingOut ? "Logging out..." : "Log out"}
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>

            {/* Login Modal */}
            <Modal
                classWrapper="!max-w-120 p-16 bg-b-surface2"
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Login />
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal
                open={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="logout" className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    
                    <h3 className="text-h5">Confirm Logout</h3>
                    <p className="text-t-secondary">
                        Are you sure you want to log out of your account?
                    </p>
                    
                    <div className="flex gap-3 pt-4">
                        <button 
                            className="flex-1 h-12 px-6 rounded-3xl border border-s-stroke2 text-button text-t-secondary hover:text-t-primary hover:border-s-highlight transition-colors"
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="flex-1 h-12 px-6 rounded-3xl bg-red-600 text-white text-button hover:bg-red-700 transition-colors disabled:opacity-50"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? "Logging out..." : "Log out"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default User;
