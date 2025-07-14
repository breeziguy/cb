"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  creatorId: string;
  className?: string;
  size?: "small" | "medium" | "large";
  showTooltip?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
  creatorId,
  className = "",
  size = "medium",
  showTooltip = true,
  onToggle,
}: FavoriteButtonProps) {
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
    small: "size-6",
    medium: "size-8", 
    large: "size-10"
  };

  const iconSizes = {
    small: "size-4",
    medium: "size-5",
    large: "size-6"
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`
        relative flex items-center justify-center 
        ${sizeClasses[size]}
        rounded-full transition-all duration-200
        ${favorited 
          ? 'bg-r-6 text-white' 
          : 'bg-s-1 hover:bg-s-2 text-t-secondary hover:text-t-primary'
        }
        ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={showTooltip ? (favorited ? "Remove from favorites" : "Add to favorites") : undefined}
    >
      <Icon
        className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${favorited ? 'fill-white' : 'fill-current'}
          ${isToggling ? 'scale-75' : 'scale-100'}
        `}
        name={favorited ? "heart-fill" : "heart-stroke"}
      />
      
      {/* Pulse animation when toggling */}
      {isToggling && (
        <div className={`
          absolute inset-0 rounded-full 
          ${favorited ? 'bg-r-6' : 'bg-s-3'}
          animate-ping opacity-75
        `} />
      )}
    </button>
  );
} 