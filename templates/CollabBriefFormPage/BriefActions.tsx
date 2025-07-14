'use client';

import Button from '@/components/Button';

const BriefActions = () => {
    const handleSubmit = () => {
        // Logic to gather all form data and submit
        console.log("Submitting brief..."); 
        // We'll need to lift state up or use a form library for actual submission
    };

    return (
        <div className="mt-6">
            <Button 
                className="w-full"
                isBlack 
                onClick={handleSubmit}
            >
                Submit Brief
            </Button>
        </div>
    );
};

export default BriefActions; 