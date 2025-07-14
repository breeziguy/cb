'use client';

import Card from '@/components/Card';
import Select from '@/components/Select';
import Icon from '@/components/Icon';
import Tooltip from '@/components/Tooltip';
import { videoDeliverables, videoLayouts, DeliverableOption } from '@/mocks/briefOptions';
import { SelectOption } from '@/types/select';

interface BriefRequirementsProps {
    briefData: any;
    onDataChange: (field: string, value: any) => void;
    errors: any;
}

const BriefRequirements = ({ briefData, onDataChange, errors }: BriefRequirementsProps) => {

    const handleDeliverableToggle = (deliverableId: string | number) => {
        const newDeliverables = briefData.deliverables.includes(deliverableId)
            ? briefData.deliverables.filter((id: any) => id !== deliverableId)
            : [...briefData.deliverables, deliverableId];
        onDataChange('deliverables', newDeliverables);
    };

    return (
        <Card title="Video Requirements">
            <div className="flex flex-col gap-5 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <div>
                    <div className="flex items-center mb-2">
                        <label className="text-button">Select video deliverables *</label>
                        <Tooltip 
                            className="ml-1.5" 
                            content="Choose one or more types of videos you expect from the creator."
                        />
                    </div>
                    <div className="flex flex-wrap -mt-3 -mx-1.5">
                        {videoDeliverables.map((deliverable: DeliverableOption) => (
                            <div
                                key={deliverable.id}
                                onClick={() => handleDeliverableToggle(deliverable.id)}
                                className={`flex items-center h-12 mt-3 mx-1.5 gap-2 border rounded-full px-3 py-1.5 text-button transition-colors cursor-pointer hover:border-s-highlight ${
                                    briefData.deliverables.includes(deliverable.id) ? "!border-s-focus bg-s-focus/10" : "border-s-stroke2"
                                }`}
                            >
                                {deliverable.iconName && (
                                    <Icon 
                                        name={deliverable.iconName} 
                                        className={`w-5 h-5 fill-current text-t-secondary group-hover:text-t-primary transition-colors ${briefData.deliverables.includes(deliverable.id) ? "!text-s-focus" : ""}`} 
                                    />
                                )}
                                <span className="truncate">{deliverable.name}</span>
                            </div>
                        ))}
                    </div>
                    {errors.deliverables && <div className="mt-2 text-caption text-red-500">{errors.deliverables}</div>}
                </div>

                <Select
                    label="Choose your video layout *"
                    options={videoLayouts}
                    value={briefData.videoLayout}
                    onChange={(value: SelectOption | null) => onDataChange('videoLayout', value)}
                    placeholder="Select video layout"
                    tooltip="Select the primary aspect ratio for the videos."
                    error={errors.videoLayout}
                />
            </div>
        </Card>
    );
};

export default BriefRequirements; 