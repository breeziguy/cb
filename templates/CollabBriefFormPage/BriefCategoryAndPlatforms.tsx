'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import Tooltip from '@/components/Tooltip';
import { videoPlatforms, PlatformOption } from '@/mocks/briefOptions';

interface BriefCategoryAndPlatformsProps {
    briefData: {
        title: string;
        description: string;
        productForContent: string;
        productNairaValue: string;
        productWebsite: string;
        leadTime: string;
        budget: number;
        submissionFee: number;
    };
    onDataChange: (field: string, value: any) => void;
}

const BriefCategoryAndPlatforms = ({ briefData, onDataChange }: BriefCategoryAndPlatformsProps) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformOption[]>([]);

    const handlePlatformToggle = (platform: PlatformOption) => {
        const isSelected = selectedPlatforms.some(p => p.id === platform.id);
        let updatedPlatforms;
        
        if (isSelected) {
            updatedPlatforms = selectedPlatforms.filter(p => p.id !== platform.id);
        } else {
            updatedPlatforms = [...selectedPlatforms, platform];
        }
        
        setSelectedPlatforms(updatedPlatforms);
        onDataChange('platforms', updatedPlatforms);
    };

    const isPlatformSelected = (platform: PlatformOption) => {
        return selectedPlatforms.some(p => p.id === platform.id);
    };

    return (
        <Card title="Platforms & Distribution">
            <div className="px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-button">Where will this content be used? *</span>
                        <Tooltip
                            className="text-t-tertiary"
                            content="Select all platforms where the content will be published or shared"
                        >
                            <Icon name="help" />
                        </Tooltip>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                        {videoPlatforms.map((platform) => {
                            const isSelected = isPlatformSelected(platform);
                            return (
                                <button
                                    key={platform.id}
                                    type="button"
                                    onClick={() => handlePlatformToggle(platform)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                        isSelected
                                            ? 'border-primary-01 bg-primary-01/5'
                                            : 'border-s-stroke2 hover:border-primary-01/50'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                        isSelected 
                                            ? 'border-primary-01 bg-primary-01' 
                                            : 'border-s-stroke2'
                                    }`}>
                                        {isSelected && (
                                            <Icon name="check" className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Icon 
                                            name={platform.iconName} 
                                            className="w-6 h-6 text-primary-01" 
                                        />
                                        <div className="text-left">
                                            <div className="font-medium text-t-primary">
                                                {platform.name}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {selectedPlatforms.length > 0 && (
                        <div className="mt-2">
                            <div className="text-sm font-medium text-primary-01">
                                Selected platforms: {selectedPlatforms.map(p => p.name).join(', ')}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default BriefCategoryAndPlatforms; 