import { SelectOption } from "@/types/select";

export const productCategories: SelectOption[] = [
    { id: 1, name: "Beauty" },
    { id: 2, name: "Health & Wellness" },
    { id: 3, name: "Technology" },
    { id: 4, name: "Fashion & Apparel" },
    { id: 5, name: "Food & Beverage" },
    { id: 6, name: "Travel & Hospitality" },
    { id: 7, name: "Gaming" },
    { id: 8, name: "Home & Garden" },
    { id: 9, name: "Finance" },
    { id: 10, name: "Education" },
    { id: 11, name: "Others" },
];

export interface PlatformOption extends SelectOption {
    iconName: string; // Icon name for the platform
}

export const videoPlatforms: PlatformOption[] = [
    { id: 1, name: "Instagram", iconName: "instagram" },
    { id: 2, name: "Facebook", iconName: "facebook" },
    { id: 3, name: "Twitter/X", iconName: "twitter" }, // Assuming 'twitter' is a valid icon name
    { id: 4, name: "TikTok", iconName: "tiktok" },
    { id: 5, name: "YouTube", iconName: "youtube" },
];

export interface DeliverableOption extends SelectOption {
    // id is number from SelectOption
    description?: string;
    iconName?: string; // Optional icon for deliverable pills
}

export const videoDeliverables: DeliverableOption[] = [
    { id: 1, name: "Product in Action", description: "Showcasing the product being used effectively." },
    { id: 2, name: "Unboxing Video", description: "Creator opens and reveals the product for the first time." },
    { id: 3, name: "Testimonial", description: "Creator shares their positive experience with the product." },
    { id: 4, name: "How-to / Tutorial", description: "Demonstrating how to use the product or achieve something with it." },
    { id: 5, name: "Product Review", description: "Creator gives their honest opinion and review of the product." },
];

export interface VideoLayoutOption extends SelectOption {
    iconName?: string; // Icon representing the layout shape
}

export const videoLayouts: VideoLayoutOption[] = [
    { id: 1, name: "Square (1:1)", iconName: "square" }, // Placeholder icon name
    { id: 2, name: "Vertical (9:16)", iconName: "rectangle-portrait" }, // Placeholder
    { id: 3, name: "Horizontal (16:9)", iconName: "rectangle-landscape" }, // Placeholder
];

export const budgetOptions: SelectOption[] = [
    { id: 35000, name: "₦35,000" },
    { id: 40000, name: "₦40,000" },
    { id: 45000, name: "₦45,000" },
    { id: 50000, name: "₦50,000" },
    { id: 55000, name: "₦55,000" },
    { id: 60000, name: "₦60,000" },
    { id: 65000, name: "₦65,000" },
    { id: 70000, name: "₦70,000" },
    { id: 75000, name: "₦75,000" },
    { id: 80000, name: "₦80,000" },
    { id: 85000, name: "₦85,000" },
    { id: 90000, name: "₦90,000" },
    { id: 95000, name: "₦95,000" },
    { id: 100000, name: "₦100,000" },
    { id: 0, name: "Custom" }, // Using 0 or a string like "custom" for ID
];

export interface VideoLengthOption extends SelectOption {
    iconName?: string; // Optional icon for length pills
}

export const predefinedVideoLengths: VideoLengthOption[] = [
    { id: 1, name: "15 seconds" },
    { id: 2, name: "30 seconds" },
    { id: 3, name: "60 seconds" },
    { id: 4, name: "1-2 minutes" },
    { id: 5, name: "2-3 minutes" },
    { id: 0, name: "Custom" }, // Using 0 or a string like "custom" for ID
]; 