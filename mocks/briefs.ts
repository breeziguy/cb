export interface Brief {
    id: string;
    submissionDate: string;
    creatorName: string;
    creatorProfilePicUrl?: string; // Optional profile picture
    campaignTitle: string;
    budget: number;
    status: "Pending Review" | "Sent to Creator" | "Accepted" | "Rejected";
}

export const mockBriefs: Brief[] = [
    {
        id: "1",
        submissionDate: "2024-07-28",
        creatorName: "Paige Johnson",
        creatorProfilePicUrl: "https://source.unsplash.com/random/100x100/?woman,face", 
        campaignTitle: "Summer Skincare Line Launch",
        budget: 750,
        status: "Accepted",
    },
    {
        id: "2",
        submissionDate: "2024-07-25",
        creatorName: "Alex Chen",
        creatorProfilePicUrl: "https://source.unsplash.com/random/100x100/?man,face",
        campaignTitle: "Tech Gadget Unboxing Video",
        budget: 300,
        status: "Pending Review",
    },
    {
        id: "3",
        submissionDate: "2024-07-22",
        creatorName: "Maria Rodriguez",
        creatorProfilePicUrl: "https://source.unsplash.com/random/100x100/?latina,face",
        campaignTitle: "Sustainable Fashion Lookbook",
        budget: 500,
        status: "Sent to Creator",
    },
    {
        id: "4",
        submissionDate: "2024-07-20",
        creatorName: "John Doe",
        creatorProfilePicUrl: "https://source.unsplash.com/random/100x100/?person,face",
        campaignTitle: "Fitness App Challenge Promotion",
        budget: 400,
        status: "Rejected",
    },
    {
        id: "5",
        submissionDate: "2024-07-18",
        creatorName: "Sarah Miller",
        creatorProfilePicUrl: "https://source.unsplash.com/random/100x100/?female,face",
        campaignTitle: "Artisanal Coffee Brand Story",
        budget: 600,
        status: "Accepted",
    },
]; 