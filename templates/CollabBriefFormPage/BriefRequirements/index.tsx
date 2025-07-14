import React, { useState } from "react";
import Card from "@/components/Card";
import Field from "@/components/Field";
import Select from "@/components/Select";
import { SelectOption } from "@/types/select";

const leadTimeOptions: SelectOption[] = [
    { id: 3, name: "3 days" },
    { id: 5, name: "5 days" },
    { id: 7, name: "7 days" },
    { id: 14, name: "1 week" },
];

interface BriefRequirementsProps {
    briefData: {
        title: string;
        description: string;
        leadTime: string;
        budget: number;
        submissionFee: number;
    };
    onDataChange: (field: string, value: any) => void;
    errors: any;
}

const BriefRequirements = ({ briefData, onDataChange, errors }: BriefRequirementsProps) => {
    const [selectedLeadTime, setSelectedLeadTime] = useState<SelectOption | null>(
        leadTimeOptions.find(option => option.name === briefData.leadTime) || null
    );

    const handleLeadTimeChange = (leadTime: SelectOption | null) => {
        setSelectedLeadTime(leadTime);
        onDataChange('leadTime', leadTime?.name || '');
    };

    return (
        <Card title="Campaign requirements">
            <div className="flex flex-col gap-8 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <Select
                    label="Lead time"
                    placeholder="Select lead time"
                    tooltip="How much time do you need for this campaign?"
                    value={selectedLeadTime}
                    onChange={handleLeadTimeChange}
                    options={leadTimeOptions}
                />
                <Field
                    label="Budget (NGN)"
                    value="₦35,000"
                    disabled
                    tooltip="Budget is currently locked at ₦35,000 minimum"
                />
            </div>
        </Card>
    );
};

export default BriefRequirements; 