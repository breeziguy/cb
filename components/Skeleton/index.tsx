import React from 'react';

interface SkeletonProps {
    className?: string;
    height?: string;
    width?: string;
    rounded?: boolean;
    lines?: number;
    variant?: 'text' | 'avatar' | 'card' | 'button';
}

const Skeleton = ({ 
    className = '', 
    height = 'h-4', 
    width = 'w-full', 
    rounded = false,
    lines = 1,
    variant = 'text'
}: SkeletonProps) => {
    // Predefined variants for common UI elements
    const getVariantStyles = () => {
        switch (variant) {
            case 'avatar':
                return 'w-10 h-10 rounded-full bg-b-surface1 dark:bg-shade-07/20 animate-pulse';
            case 'card':
                return 'w-full h-32 rounded-xl bg-b-surface1 dark:bg-shade-07/20 animate-pulse';
            case 'button':
                return 'w-24 h-10 rounded-lg bg-b-surface1 dark:bg-shade-07/20 animate-pulse';
            default:
                return `animate-pulse bg-b-surface1 dark:bg-shade-07/20 ${height} ${width} ${
                    rounded ? 'rounded-full' : 'rounded'
                }`;
        }
    };

    if (lines > 1) {
        return (
            <div className={`space-y-3 ${className}`}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={`animate-pulse bg-b-surface1 dark:bg-shade-07/20 ${height} ${
                            index === lines - 1 ? 'w-3/4' : width
                        } ${rounded ? 'rounded-full' : 'rounded'}`}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${getVariantStyles()} ${className}`}
        />
    );
};

// Pre-built skeleton components for common use cases
export const TextSkeleton = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
    <Skeleton lines={lines} className={className} />
);

export const AvatarSkeleton = ({ className = '' }: { className?: string }) => (
    <Skeleton variant="avatar" className={className} />
);

export const CardSkeleton = ({ className = '' }: { className?: string }) => (
    <Skeleton variant="card" className={className} />
);

export const ButtonSkeleton = ({ className = '' }: { className?: string }) => (
    <Skeleton variant="button" className={className} />
);

// Complex skeleton for creator cards
export const CreatorCardSkeleton = () => (
    <div className="p-4 border border-s-stroke2 rounded-xl space-y-3">
        <AvatarSkeleton className="mx-auto" />
        <TextSkeleton lines={2} className="text-center" />
        <ButtonSkeleton className="mx-auto" />
    </div>
);

// Complex skeleton for brief form sections
export const BriefFormSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-4">
            <Skeleton height="h-6" width="w-32" />
            <Skeleton height="h-10" />
        </div>
        <div className="space-y-4">
            <Skeleton height="h-6" width="w-40" />
            <Skeleton height="h-24" />
        </div>
        <div className="space-y-4">
            <Skeleton height="h-6" width="w-28" />
            <Skeleton height="h-10" />
        </div>
    </div>
);

export default Skeleton; 