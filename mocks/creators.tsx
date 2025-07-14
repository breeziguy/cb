// New interfaces for Creator Profile Page
export interface Category {
    id: string | number;
    name: string;
    icon?: string; // Icon name for the Icon component
}

export interface MediaItem {
    thumbnailUrl: string;
    linkUrl?: string;
    type?: 'image' | 'tiktok';
    videoId?: string;
    videoUrl?: string;
}

export interface SocialPlatformMedia {
    platform: "YouTube" | "Instagram" | "TikTok" | "Facebook";
    platformIcon?: string; // e.g., 'youtube', 'instagram'
    items: MediaItem[];
    viewAllLink?: string;
}

// Extended SocialStat for profile page context
export interface SocialLinkProfile {
    platform: "tiktok" | "instagram" | "youtube" | "twitter" | "facebook"; // Added facebook
    handle: string; // Added handle, as it's shown on the profile
    followers: string;
    iconName: string;
    engagementRate?: string; // Added engagement rate
    linkUrl?: string; // Added link to the social profile
}

// Renamed from CreatorCardData and extended for the profile page
export interface CreatorProfileData {
    id: string | number;
    name: string;
    age?: number;
    location?: string;
    avatarUrl: string;
    // image?: string; // This was from an older version, not in current mock, potentially for card background
    specialties: string[]; // Kept as it might be used, though categories is more detailed
    socialLinks: SocialLinkProfile[]; // Changed from socialStats to socialLinks for clarity and extended type
    isFavorite?: boolean;
    whatsappNumber?: string; // WhatsApp contact number

    // New fields for Profile Page
    gender?: string;
    bio?: string;
    categories?: Category[];
    media?: SocialPlatformMedia[];
    riskAnalysis?: string;
}

// Adapted mock data
export const creators: CreatorProfileData[] = [
    {
        id: 1,
        name: "Adanna Eze",
        age: 51,
        location: "United States",
        avatarUrl: "/images/avatars/1.png",
        specialties: ["Fashion", "Food & Drink"],
        socialLinks: [
            { platform: 'tiktok', handle: 'adannaeze', followers: "1.2M", iconName: "tiktok", linkUrl: "#" },
            { platform: 'instagram', handle: 'adannaeze', followers: "385K", iconName: "instagram", linkUrl: "#" }
        ],
        isFavorite: false,
        // Add new profile fields if needed for this creator later
    },
    {
        id: 2,
        name: "Chinedu Okafor",
        age: 31,
        location: "United States",
        avatarUrl: "/images/creators/photo-1632765937900-a3bbbfa58d46.avif",
        specialties: ["Home"],
        socialLinks: [
            { platform: 'instagram', handle: 'chineduokafor', followers: "571K", iconName: "instagram", linkUrl: "#" }
        ],
        isFavorite: true,
    },
    {
        id: 3, // Paige Johnson - Updated with new fields
        name: "Fatima Bello",
        age: 25,
        location: "United States",
        avatarUrl: "/images/avatars/2.png", 
        specialties: ["Health & Wellness", "Home"], // Keep specialties or consolidate with categories?
        socialLinks: [
            {
                platform: 'facebook',
                handle: "FatimaBInspires",
                followers: "128", 
                iconName: "facebook",
                engagementRate: "0.13%",
                linkUrl: "#",
            },
            {
                platform: 'instagram',
                handle: "fatima_bello_official",
                followers: "444K",
                iconName: "instagram",
                engagementRate: "2.07%",
                linkUrl: "#",
            },
            {
                platform: 'tiktok',
                handle: "fatimabello",
                followers: "418K",
                iconName: "tiktok",
                engagementRate: "21.16%",
                linkUrl: "#",
            },
            {
                platform: 'youtube',
                handle: "Fatima Bello",
                followers: "2.8K",
                iconName: "youtube",
                engagementRate: "4.81%",
                linkUrl: "#",
            },
        ],
        isFavorite: false,
        gender: "Female",
        bio: "Inspiring wellness and joyful living. Join my journey! @fatimabello",
        categories: [
            { id: 1, name: "Health & Wellness, Home Decor", icon: "tag" }, 
            { id: 2, name: "Lifestyle & Motivation", icon: "gallery" }, 
        ],
        media: [
            {
                platform: "YouTube",
                platformIcon: "youtube",
                items: [
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/youtube/1.jpg", linkUrl: "#" },
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/youtube/2.jpg", linkUrl: "#" },
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/youtube/3.jpg", linkUrl: "#" },
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/youtube/4.jpg", linkUrl: "#" },
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/youtube/5.jpg", linkUrl: "#" },
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/youtube/6.jpg", linkUrl: "#" },
                ],
                viewAllLink: "#",
            },
            {
                platform: "Instagram",
                platformIcon: "instagram",
                items: [
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/instagram/1.jpg", linkUrl: "#" },
                    { type: 'image', thumbnailUrl: "/images/creators/media/paige/instagram/2.jpg", linkUrl: "#" },
                ],
                viewAllLink: "#",
            },
            {
                platform: "TikTok",
                platformIcon: "tiktok",
                items: [
                    { 
                        type: 'tiktok',
                        videoId: "7392682864053079301", 
                        videoUrl: "https://www.tiktok.com/@nikmunacreativecorner/video/7392682864053079301",
                        thumbnailUrl: ""
                    },
                    { 
                        type: 'tiktok',
                        videoId: "7190087312838003973", 
                        videoUrl: "https://www.tiktok.com/@alicia_ugc/video/7190087312838003973",
                        thumbnailUrl: "" 
                    },
                    { 
                        type: 'tiktok',
                        videoId: "7249287383789653250", 
                        videoUrl: "https://www.tiktok.com/@ugcwithlauraa/video/7249287383789653250",
                        thumbnailUrl: "" 
                    },
                    { 
                        type: 'tiktok',
                        videoId: "7495847143849168150", 
                        videoUrl: "https://www.tiktok.com/@damilola.biyi/video/7495847143849168150",
                        thumbnailUrl: "" 
                    },
                ],
            },
        ],
        riskAnalysis: "Not available",
    },
    {
        id: 4,
        name: "Emeka Adebayo",
        age: 34,
        location: "United States",
        avatarUrl: "/images/creators/photo-1572112686886-5c0b5bc8dacd.avif",
        specialties: ["Crafts & DIY", "Fashion", "Home"],
        socialLinks: [
            { platform: 'instagram', handle: 'emeka_adebayo', followers: "426K", iconName: "instagram", linkUrl: "#" },
            { platform: 'youtube', handle: 'EmekaAdebayoDIY', followers: "300K", iconName: "youtube", linkUrl: "#" } 
        ],
        isFavorite: false,
    },
    {
        id: 5,
        name: "Aisha Ibrahim",
        age: 28,
        location: "Canada",
        avatarUrl: "/images/avatars/3.png",
        specialties: ["Tech", "Gaming"],
        socialLinks: [
            { platform: 'twitter', handle: 'aisha_codes', followers: "150K", iconName: "twitter", linkUrl: "#" },
            { platform: 'youtube', handle: 'AishaGaming', followers: "220K", iconName: "youtube", linkUrl: "#" }
        ],
        isFavorite: true,
    },
    // New creators from CSV import
    {
        id: 100,
        name: "Afolarin Wuraola",
        location: "Nigeria",
        avatarUrl: "/images/avatars/4.png",
        specialties: ["Lifestyle"],
        socialLinks: [
            { 
                platform: 'instagram', 
                handle: 'wuraaaah', 
                followers: "25K+", 
                iconName: "instagram", 
                engagementRate: "3.2%",
                linkUrl: "https://www.instagram.com/wuraaaah?igsh=MTlkcWxwYm84aDF4dg%3D%3D&utm_source=qr"
            },
            { 
                platform: 'tiktok', 
                handle: 'wuraaagold', 
                followers: "18K+", 
                iconName: "tiktok", 
                engagementRate: "6.8%",
                linkUrl: "https://www.tiktok.com/@wuraaagold?_t=ZM-8wNOjWzAodz&_r=1"
            }
        ],
        isFavorite: false,
        whatsappNumber: "+2348081795588",
        bio: "Content creator specializing in Lifestyle. Contact me for collaborations!",
        categories: [
            { id: 101, name: "Lifestyle", icon: "tag" }
        ],
        media: [
            {
                platform: "TikTok",
                platformIcon: "tiktok",
                items: [
                    { type: 'image', thumbnailUrl: "/images/creators/photo-1632765937900-a3bbbfa58d46.avif", linkUrl: "https://vm.tiktok.com/ZMSRFw6hJ/" },
                    { type: 'image', thumbnailUrl: "/images/creators/photo-1572112686886-5c0b5bc8dacd.avif", linkUrl: "https://vm.tiktok.com/ZMSRFqwtE/" },
                    { type: 'image', thumbnailUrl: "/images/creators/photo-1613053341085-db794820ce43.avif", linkUrl: "https://vm.tiktok.com/ZMSRFo26Q/" }
                ]
            }
        ],
        riskAnalysis: "Not available"
    },
    {
        id: 101,
        name: "Confidence CHIKAMSO",
        location: "Nigeria",
        avatarUrl: "/images/avatars/5.png",
        specialties: ["Beauty"],
        socialLinks: [
            { 
                platform: 'tiktok', 
                handle: 'kamso_ugc_creator', 
                followers: "32K+", 
                iconName: "tiktok", 
                engagementRate: "8.1%",
                linkUrl: "https://www.tiktok.com/@kamso_ugc_creator"
            }
        ],
        isFavorite: false,
        whatsappNumber: "+2348149076477",
        bio: "Content creator specializing in Beauty. Contact me for collaborations!",
        categories: [
            { id: 102, name: "Beauty", icon: "tag" }
        ],
        media: [
            {
                platform: "TikTok",
                platformIcon: "tiktok",
                items: [
                    { 
                        type: 'tiktok',
                        videoId: "7502389897114799365",
                        videoUrl: "https://www.tiktok.com/@kamso_ugc_creator/video/7502389897114799365",
                        thumbnailUrl: ""
                    }
                ]
            }
        ],
        riskAnalysis: "Not available"
    },
    {
        id: 102,
        name: "Chimdinma Udeze",
        location: "Nigeria",
        avatarUrl: "/images/avatars/6.png",
        specialties: ["Health & Wellness", "Tech"],
        socialLinks: [
            { 
                platform: 'instagram', 
                handle: 'lifewith_drchim', 
                followers: "15K+", 
                iconName: "instagram", 
                engagementRate: "4.5%",
                linkUrl: "https://www.instagram.com/lifewith_drchim/"
            },
            { 
                platform: 'tiktok', 
                handle: 'ugcwithdrchim_', 
                followers: "22K+", 
                iconName: "tiktok", 
                engagementRate: "7.2%",
                linkUrl: "https://www.tiktok.com/@ugcwithdrchim_"
            }
        ],
        isFavorite: false,
        whatsappNumber: "+2348137834526",
        bio: "Content creator specializing in Health & Wellness. Contact me for collaborations!",
        categories: [
            { id: 103, name: "Health & Wellness", icon: "tag" },
            { id: 104, name: "Technology", icon: "tag" }
        ],
        riskAnalysis: "Not available"
    },
    {
        id: 103,
        name: "Jesutoni Akoni",
        location: "Nigeria",
        avatarUrl: "/images/avatars/7.png",
        specialties: ["Finance"],
        socialLinks: [
            { 
                platform: 'instagram', 
                handle: 'ugcbyjesutoni', 
                followers: "8K+", 
                iconName: "instagram", 
                engagementRate: "5.8%",
                linkUrl: "https://www.instagram.com/ugcbyjesutoni"
            },
            { 
                platform: 'tiktok', 
                handle: 'ugcbyjesutoni_', 
                followers: "12K+", 
                iconName: "tiktok", 
                engagementRate: "9.1%",
                linkUrl: "https://www.tiktok.com/@ugcbyjesutoni_"
            }
        ],
        isFavorite: false,
        whatsappNumber: "+2348134817431",
        bio: "Content creator specializing in Finance. Contact me for collaborations!",
        categories: [
            { id: 105, name: "Finance", icon: "tag" }
        ],
        riskAnalysis: "Not available"
    },
    {
        id: 104,
        name: "Obi Chioma",
        location: "Nigeria",
        avatarUrl: "/images/avatars/8.png",
        specialties: ["Lifestyle"],
        socialLinks: [
            { 
                platform: 'instagram', 
                handle: 'oma.ugc', 
                followers: "14K+", 
                iconName: "instagram", 
                engagementRate: "4.2%",
                linkUrl: "https://www.instagram.com/oma.ugc"
            },
            { 
                platform: 'tiktok', 
                handle: 'oma_ugc', 
                followers: "19K+", 
                iconName: "tiktok", 
                engagementRate: "6.5%",
                linkUrl: "https://www.tiktok.com/@oma_ugc"
            }
        ],
        isFavorite: false,
        whatsappNumber: "+2349131069349",
        bio: "Content creator specializing in Lifestyle. Contact me for collaborations!",
        categories: [
            { id: 106, name: "Lifestyle", icon: "tag" }
        ],
        riskAnalysis: "Not available"
    }
];

// The old creators data is removed or fully replaced by the structure above.
// If you had other exports in this file, ensure they are preserved if still needed.
