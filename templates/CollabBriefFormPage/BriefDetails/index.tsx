import React from "react";
import Card from "@/components/Card";
import Field from "@/components/Field";
import Editor from "@/components/Editor";
import Select from "@/components/Select";
import { SelectOption } from "@/types/select";

const yesNoOptions: SelectOption[] = [
    { id: 1, name: "Yes" },
    { id: 0, name: "No" },
];

interface BriefDetailsProps {
    briefData: {
        title: string;
        description: string;
        productForContent: string;
        isSendingProducts: boolean | null;
        productNairaValue: string;
    };
    onDataChange: (field: string, value: any) => void;
}

const BriefDetails = ({ briefData, onDataChange }: BriefDetailsProps) => {
    const handleSendingProductsChange = (option: SelectOption | null) => {
        if (option) {
            const value = option.id === 1;
            onDataChange('isSendingProducts', value);
            if (!value) {
                onDataChange('productNairaValue', ''); // Clear value if not sending products
            }
        } else {
            onDataChange('isSendingProducts', null);
        }
    };
    
    return (
        <Card title="Brief Details" className="mb-6">
            <div className="px-5 pb-6 max-lg:px-3 space-y-4">
                
                {/* Brief Title */}
                <Field
                    label="Brief Title *"
                    placeholder="Enter brief title"
                    value={briefData.title}
                    onChange={(e) => onDataChange('title', e.target.value)}
                    required
                />

                {/* Brief Description */}
                <div>
                    <div className="mb-2 text-sub-title-1">Description *</div>
                    <Editor
                        content={briefData.description}
                        onChange={(content) => onDataChange('description', content)}
                    />
                </div>
                
                {/* Product for Content */}
                <Field
                    label="Product for Content *"
                    placeholder="E.g., 1 Skincare Set, 2 T-shirts"
                    value={briefData.productForContent}
                    onChange={(e) => onDataChange('productForContent', e.target.value)}
                    required
                />
                
                {/* Will you be sending products? */}
                <Select
                    label="Will you be sending products? *"
                    options={yesNoOptions}
                    value={
                        briefData.isSendingProducts === null
                            ? null
                            : briefData.isSendingProducts
                            ? yesNoOptions[0]
                            : yesNoOptions[1]
                    }
                    onChange={handleSendingProductsChange}
                />
                
                {/* Product Naira Value (Conditional) */}
                {briefData.isSendingProducts && (
                    <Field
                        label="Product Naira Value *"
                        placeholder="Enter the total value of the products"
                        type="number"
                        value={briefData.productNairaValue}
                        onChange={(e) => onDataChange('productNairaValue', e.target.value)}
                        required
                    />
                )}
            </div>
        </Card>
    );
};

export default BriefDetails; 