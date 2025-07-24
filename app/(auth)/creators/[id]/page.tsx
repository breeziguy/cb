"use client";

import { useParams } from "next/navigation";
import Layout from "../../../../components/Layout";
import Icon from "../../../../components/Icon";
import Button from "../../../../components/Button";
import CreatorProfilePage from "../../../../templates/CreatorProfilePage";
import CreatorProfileSkeleton from "../../../../components/CreatorProfileSkeleton";
import { useCreator } from "../../../../hooks/useCreators";

const CreatorPage = () => {
    const params = useParams();
    const creatorId = params.id as string;
    
    const { data: creator, isLoading: loading, error } = useCreator(creatorId);

    if (loading) {
        return <CreatorProfileSkeleton />;
    }

    if (error || !creator) {
        return (
            <Layout title=" ">
                <div className="text-center py-20">
                    <div className="mb-4">
                        <Icon className="mx-auto h-16 w-16 text-gray-400" name="user" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Creator not found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        The creator you're looking for doesn't exist or has been removed.
                    </p>
                    <Button className="mt-4" href="/creators">
                        View Creators
                    </Button>
                </div>
            </Layout>
        );
    }

    // Use your original CreatorProfilePage template
    return <CreatorProfilePage creator={creator} />;
};

export default CreatorPage; 