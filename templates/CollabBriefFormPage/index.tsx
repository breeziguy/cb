"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import BriefDetails from "./BriefDetails";
import BriefRequirements from "./BriefRequirements";
import BriefBudget from "./BriefBudget";
import BriefSubmission from "./BriefSubmission";
import { useUserRole } from "@/hooks/useUserRole";
import { SelectOption } from "@/types/select";
import { PlatformOption } from "@/mocks/briefOptions";

const CollabBriefFormPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { profile } = useUserRole();
    
    const creatorId = searchParams.get('creator_id') || searchParams.get('creatorId');
    const creatorName = searchParams.get('creator_name') || searchParams.get('creatorName');
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    
    const [briefData, setBriefData] = useState({
        title: '',
        description: '',
        productForContent: '',
        productNairaValue: '',
        productWebsite: '',
        leadTime: '',
        category: null as SelectOption | null,
        platforms: [] as PlatformOption[],
        deliverables: [] as (string | number)[],
        videoLayout: null as SelectOption | null,
        budget: 0,
        submissionFee: 2000,
        isSendingProducts: null as boolean | null,
        selectedBudgetOption: null as SelectOption | null,
        customBudget: '35000',
    });

    const handleDataChange = (field: string, value: any) => {
        setBriefData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row gap-6 max-lg:gap-4">
                <div className="flex-1">
                    <BriefDetails 
                        briefData={briefData}
                        onDataChange={handleDataChange}
                        errors={errors}
                    />
                </div>

                <div className="w-full lg:w-80 xl:w-96 space-y-6 max-lg:space-y-4">
                    <BriefBudget 
                        briefData={briefData}
                        onDataChange={handleDataChange}
                        errors={errors}
                    />
                    
                    <BriefRequirements 
                        briefData={briefData}
                        onDataChange={handleDataChange}
                        errors={errors}
                    />
                    
                    <BriefSubmission 
                        briefData={briefData}
                        profile={profile}
                        creatorId={creatorId}
                        creatorName={creatorName}
                        loading={loading}
                        setLoading={setLoading}
                        setErrors={setErrors}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default CollabBriefFormPage; 