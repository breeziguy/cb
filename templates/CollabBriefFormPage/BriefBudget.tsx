'use client';

import Card from '@/components/Card';
import Field from '@/components/Field';
import Select from '@/components/Select';
import { budgetOptions } from '@/mocks/briefOptions';
import { SelectOption } from '@/types/select';
import { useEffect, useCallback } from 'react';

const CUSTOM_BUDGET_ID = 0;
const MIN_CUSTOM_BUDGET = 35000;

interface BriefBudgetProps {
    briefData: any;
    onDataChange: (field: string, value: any) => void;
    errors: any;
}

const BriefBudget = ({ briefData, onDataChange, errors }: BriefBudgetProps) => {
    const { selectedBudgetOption, customBudget } = briefData;
    const isCustom = selectedBudgetOption?.id === CUSTOM_BUDGET_ID;

    const updateBudget = useCallback((value: number) => {
        onDataChange('budget', value);
    }, [onDataChange]);

    useEffect(() => {
        let budgetError = '';
        if (isCustom) {
            const val = parseInt(customBudget);
            if (isNaN(val) || val < MIN_CUSTOM_BUDGET) {
                budgetError = `Minimum custom budget is ₦${MIN_CUSTOM_BUDGET.toLocaleString()}`;
            } else {
                updateBudget(val);
            }
        } else if (selectedBudgetOption) {
            updateBudget(selectedBudgetOption.id as number);
        }
        onDataChange('customBudgetError', budgetError);
    }, [customBudget, isCustom, selectedBudgetOption]);

    const budgetPlaceholder = "Select budget or choose Custom";

    return (
        <Card title="Budget">
            <div className="flex flex-col gap-3 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <div>
                    <label className="block text-button mb-2">Campaign Budget (₦) *</label>
                    <Select
                        placeholder={budgetPlaceholder}
                        options={budgetOptions}
                        value={selectedBudgetOption}
                        onChange={(value: SelectOption | null) => onDataChange('selectedBudgetOption', value)}
                        error={errors.budget}
                    />
                </div>

                {isCustom && (
                    <div>
                        <Field
                            classInput="pl-12.5"
                            label="Custom Amount (₦) *"
                            placeholder={`Minimum ₦${MIN_CUSTOM_BUDGET.toLocaleString()}`}
                            type="number"
                            value={customBudget}
                            onChange={(e: any) => onDataChange('customBudget', e.target.value)}
                            error={errors.customBudget}
                            required
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 left-1 w-10 h-10 flex items-center justify-center bg-secondary-04 rounded-full pointer-events-none">
                                <span className="text-lg font-semibold text-n-7">₦</span>
                            </div>
                        </Field>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default BriefBudget; 