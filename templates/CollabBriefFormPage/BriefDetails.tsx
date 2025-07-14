'use client';

import Card from '@/components/Card';
import Field from '@/components/Field';
import Editor from '@/components/Editor';
import Select from '@/components/Select';
import Icon from '@/components/Icon';
import { productCategories, videoPlatforms, PlatformOption } from '@/mocks/briefOptions';
import { SelectOption } from '@/types/select';

const leadTimeOptions: SelectOption[] = [
    { id: 3, name: "3 days" },
    { id: 5, name: "5 days" },
    { id: 7, name: "7 days" },
    { id: 14, name: "1 week" },
];

const yesNoOptions: SelectOption[] = [
    { id: 1, name: "Yes" },
    { id: 0, name: "No" },
];

interface BriefDetailsProps {
    briefData: any;
    onDataChange: (field: string, value: any) => void;
    errors: any;
}

const BriefDetails = ({ briefData, onDataChange, errors }: BriefDetailsProps) => {
    if (!briefData) {
        return null;
    }

    const handlePlatformToggle = (platform: PlatformOption) => {
        const isSelected = briefData.platforms.some((p: any) => p.id === platform.id);
        const updatedPlatforms = isSelected
            ? briefData.platforms.filter((p: any) => p.id !== platform.id)
            : [...briefData.platforms, platform];
        onDataChange('platforms', updatedPlatforms);
    };

    return (
        <Card title="">
            <div className="flex flex-col gap-5 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <Field
                    label="Brief Title / Campaign Name *"
                    placeholder="Enter campaign title"
                    value={briefData.title}
                    onChange={(e: any) => onDataChange('title', e.target.value)}
                    error={errors.title}
                    required
                />

                <div>
                    <label className="block text-button mb-2">Brief Description / Campaign Goals *</label>
                    <Editor
                        content={briefData.description}
                        onChange={(value: string) => onDataChange('description', value)}
                    />
                    {errors.description && <div className="mt-2 text-caption text-red-500">{errors.description}</div>}
                </div>

                <Select
                    label="Will you be sending products? *"
                    tooltip="Please specify if you will be sending a product to the creator for this collaboration."
                    options={yesNoOptions}
                    value={
                        briefData.isSendingProducts === null ? null :
                        briefData.isSendingProducts ? yesNoOptions[0] : yesNoOptions[1]
                    }
                    onChange={(option: SelectOption | null) => {
                        const value = option ? option.id === 1 : null;
                        onDataChange('isSendingProducts', value);
                        if (value === false) {
                            onDataChange('productNairaValue', '');
                        }
                    }}
                    error={errors.isSendingProducts}
                />

                {briefData.isSendingProducts && (
                <Field
                    label="Product Naira Value *"
                    placeholder="Enter value in Naira"
                    type="number"
                    value={briefData.productNairaValue}
                    onChange={(e: any) => onDataChange('productNairaValue', e.target.value)}
                        error={errors.productNairaValue}
                    required
                />
                )}

                <div>
                    <label className="block text-button mb-2">Campaign Focus / Product Category *</label>
                    <Select
                        placeholder="Select product category"
                        options={productCategories}
                        value={briefData.category}
                        onChange={(value: SelectOption | null) => onDataChange('category', value)}
                        error={errors.category}
                    />
                </div>

                <div>
                    <label className="block text-button mb-2">Where will this content be used? *</label>
                    <div className="flex flex-wrap gap-2">
                        {videoPlatforms.map((platform) => {
                            const isSelected = briefData.platforms.some((p: any) => p.id === platform.id);
                            return (
                                <button
                                    key={platform.id}
                                    type="button"
                                    onClick={() => handlePlatformToggle(platform)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-colors text-sm cursor-pointer hover:border-primary-01/50 ${
                                        isSelected
                                            ? '!border-s-focus bg-s-focus/10 text-s-focus'
                                            : 'border-s-stroke2 text-t-primary'
                                    }`}
                                >
                                    <Icon 
                                        name={platform.iconName} 
                                        className={`w-4 h-4 transition-colors ${isSelected ? 'text-s-focus' : 'text-primary-01'}`} 
                                    />
                                    <span className="font-semibold">{platform.name}</span>
                                </button>
                            );
                        })}
                    </div>
                    {errors.platforms && <div className="mt-2 text-caption text-red-500">{errors.platforms}</div>}
                </div>

                <div>
                    <label className="block text-button mb-2">Lead Time *</label>
                    <Select
                        placeholder="Select lead time"
                        options={leadTimeOptions}
                        value={leadTimeOptions.find(o => o.name === briefData.leadTime) || null}
                        onChange={(value: SelectOption | null) => onDataChange('leadTime', value?.name || '')}
                        error={errors.leadTime}
                    />
                </div>
            </div>
        </Card>
    );
};

export default BriefDetails; 