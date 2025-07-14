"use client";

import CreatorCard from "@/templates/ExploreCreatorsPage/Creator";
import { Creator } from "@/lib/creator-utils";
import Layout from "@/components/Layout";
import Button from "@/components/Button"; 

type MyCreatorListPageProps = {
    creators: Creator[];
};

const MyCreatorListPage = ({ creators }: MyCreatorListPageProps) => {
    return (
        <Layout title="">
            <div className="card p-4 md:p-6 flex flex-col min-h-[calc(100vh-6.75rem)]">
                {creators.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {creators.map((creator) => (
                            <CreatorCard key={creator.id} value={creator} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-grow text-center">
                        <p className="h4 mb-2 text-t-primary dark:text-t-primary-dark">
                            Your Creator List is Empty
                        </p>
                        <p className="body1 text-t-secondary mb-6">
                            You haven&apos;t favorited any creators yet. Browse the "Creators" page to find and add creators to your list.
                        </p>
                        <Button as="link" href="/creators" className="mt-4">
                            View Creators
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyCreatorListPage; 