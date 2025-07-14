import React, { useState } from "react";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { SelectOption } from "@/types/select";

interface BriefSummaryProps {
    briefData: {
        title: string;
        description: string;
        leadTime: string;
        budget: number;
        submissionFee: number;
    };
    creatorName: string | null;
    onSubmit: () => Promise<void>;
    loading: boolean;
}

const timelineOptions: SelectOption[] = [
    { id: 1, name: "3 days" },
    { id: 2, name: "5 days" },
    { id: 3, name: "7 days" },
    { id: 4, name: "2 weeks" },
    { id: 5, name: "1 month" },
];

const BriefSummary = ({ briefData, creatorName, onSubmit, loading }: BriefSummaryProps) => {
    const [selectedBudget, setSelectedBudget] = useState(35000);
    const [selectedTimeline, setSelectedTimeline] = useState<SelectOption>(timelineOptions[0]);

    return (
        <div className="max-lg:min-h-[calc(100vh-10rem)] max-lg:flex max-lg:flex-col">
            <Card title="Brief Summary" className="max-lg:flex-1">
                <div className="px-5 pb-6 max-lg:px-3 max-lg:h-full max-lg:flex max-lg:flex-col">
                    {/* Budget and Timeline - exact copy from Price component layout */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Field
                                classInput="pl-12.5"
                                label="Budget"
                                placeholder="35000"
                                value={selectedBudget.toString()}
                                onChange={(e) => setSelectedBudget(Number(e.target.value))}
                                required
                            >
                                <div className="absolute top-1/2 -translate-y-1/2 left-1 w-10 h-10 flex items-center justify-center bg-secondary-04 rounded-full pointer-events-none">
                                    <div className="text-button font-semibold text-black">₦</div>
                                </div>
                            </Field>
                        </div>
                        <div className="relative flex-1">
                            <Select
                                label="Timeline"
                                placeholder="Select timeline"
                                value={selectedTimeline}
                                onChange={setSelectedTimeline}
                                options={timelineOptions}
                            />
                        </div>
                    </div>

                    {/* Product Preview */}
                    <div className="flex items-start mt-8">
                        <div className="grow">
                            <div className="mb-4 text-sub-title-1">
                                {briefData.title || "Brief Title"}
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shrink-0">
                                    <Image
                                        src="/images/avatars/2.png"
                                        width={40}
                                        height={40}
                                        alt={creatorName || "Creator"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="grow">
                                    <div className="text-button text-t-primary">
                                        {creatorName || "Creator Name"}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-button text-t-primary">
                                        ₦{briefData.budget?.toLocaleString() || "0"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 mt-8 max-md:flex-col max-lg:mt-auto max-lg:pt-6">
                        <Button 
                            className="flex-1" 
                            onClick={() => window.history.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1" 
                            onClick={onSubmit}
                            disabled={!briefData.title || !briefData.description || loading}
                            isBlack
                        >
                            {loading ? "Submitting..." : "Submit Brief"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default BriefSummary; 