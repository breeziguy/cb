"use client";

import MyCreatorListPageTemplate from "@/templates/MyCreatorListPage";
import { useFavorites } from "@/hooks/useFavorites";
import { Creator } from "@/lib/creator-utils";
import Layout from "@/components/Layout";
import CreatorsGridSkeleton from "@/components/CreatorsGridSkeleton";

const MyCreatorListRoutePage = () => {
    const { favorites, loading } = useFavorites();

    // Convert favorites to creator format
    const creators = favorites
        .filter((fav: any) => fav.creator) // Ensure creator data exists
        .map((fav: any) => ({
            ...fav.creator!,
            profile_image: fav.creator!.avatar_url || '',
            avatar_url: fav.creator!.avatar_url || '',
        })) as Creator[];

    if (loading) {
        return (
            <Layout title="My Creator List">
                <div className="card p-4 md:p-6">
                    <CreatorsGridSkeleton />
                </div>
            </Layout>
        );
    }

    return <MyCreatorListPageTemplate creators={creators} />;
};

export default MyCreatorListRoutePage; 