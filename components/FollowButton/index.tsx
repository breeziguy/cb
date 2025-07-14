"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { useFavorites } from "@/hooks/useFavorites";

interface FollowButtonProps {
  creatorId: string;
  className?: string;
  size?: "small" | "medium" | "large";
  showTooltip?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

export default function FollowButton({
  creatorId,
  className = "",
  size = "medium",
  showTooltip = true,
  onToggle,
}: FollowButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);
  
  const favorited = isFavorited(creatorId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;
    
    try {
      setIsToggling(true);
      await toggleFavorite(creatorId);
      onToggle?.(!favorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const sizeClasses = {
    small: "size-7 border-2 max-md:size-7 max-md:border-2",
    medium: "size-9.5 border-3 max-md:size-7 max-md:border-2", 
    large: "size-12 border-4 max-md:size-9 max-md:border-3"
  };

  const iconSizes = {
    small: "size-4 max-md:size-4",
    medium: "size-5 max-md:size-4",
    large: "size-6 max-md:size-5"
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`
        absolute -bottom-1 -right-1 ${sizeClasses[size]} rounded-full border-b-surface2 
        bg-linear-to-b from-[#2C2C2C] to-[#282828] text-0 transition-all 
        dark:from-[#EAEAEA] dark:to-[#B4B4B4]
        ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={showTooltip ? (favorited ? "Remove from favorites" : "Add to favorites") : undefined}
    >
      <Icon
        className={`
          ${iconSizes[size]} fill-t-light transition-opacity
          ${favorited ? "opacity-0" : "opacity-100"}
        `}
        name="plus"
      />
      <Icon
        className={`
          absolute left-1/2 top-1/2 -translate-1/2 ${iconSizes[size]} fill-t-light transition-opacity
          ${favorited ? "opacity-100" : "opacity-0"}
        `}
        name="check"
      />
    </button>
  );
} 