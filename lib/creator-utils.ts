import { supabase } from './supabase';

export interface Creator {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  whatsapp_number?: string;
  industry: string;
  category: string;
  work_url?: string;
  work_embed?: string;
  instagram_profile?: string;
  tiktok_profile?: string;
  video_portfolio?: any[];
  platforms?: any;
  status: 'active' | 'inactive' | 'pending';
  bio?: string;
  avatar_url?: string;
  profile_image?: string;
  followers_count: number;
  engagement_rate: number;
  location?: string;
  price_range?: string;
  portfolio_images?: any[];
  created_at: string;
  updated_at?: string;
}

export interface CreatorFilters {
  industry?: string;
  search?: string;
  status?: 'active' | 'inactive' | 'pending';
  limit?: number;
  offset?: number;
}

// Fetch creators with optional filtering
export async function fetchCreators(filters: CreatorFilters = {}) {
  try {
    let query = supabase
      .from('creators')
      .select('*')
      .eq('status', filters.status || 'active')
      .order('created_at', { ascending: false });

    // Apply industry filter
    if (filters.industry && filters.industry !== 'All') {
      query = query.eq('industry', filters.industry);
    }

    // Apply search filter (search in name, username, industry)
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,username.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }

    return { 
      creators: data as Creator[] || [], 
      total: count || 0 
    };
  } catch (error) {
    console.error('Error in fetchCreators:', error);
    throw error;
  }
}

// Fetch single creator by ID
export async function fetchCreatorById(id: string) {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching creator:', error);
      throw error;
    }

    return data as Creator;
  } catch (error) {
    console.error('Error in fetchCreatorById:', error);
    throw error;
  }
}

// Get all unique industries
export async function fetchIndustries() {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('industry')
      .eq('status', 'active')
      .not('industry', 'is', null);

    if (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }

    // Get unique industries
    const industries = [...new Set(data?.map(item => item.industry) || [])];
    return industries.sort();
  } catch (error) {
    console.error('Error in fetchIndustries:', error);
    throw error;
  }
}

// Format creator name for display
export function formatCreatorName(creator: Creator) {
  if (creator.name) {
    return creator.name;
  }
  return creator.username || 'Unknown Creator';
}

// Get creator avatar/profile image with fallback
export function getCreatorAvatar(creator: Creator) {
  return creator.avatar_url || creator.profile_image || '/placeholder-avatar.svg';
}

// Format creator social links
export function getCreatorSocials(creator: Creator) {
  const socials = [];
  
  if (creator.instagram_profile) {
    socials.push({
      platform: 'instagram',
      url: creator.instagram_profile,
      handle: creator.instagram_profile.split('/').pop() || ''
    });
  }
  
  if (creator.tiktok_profile) {
    socials.push({
      platform: 'tiktok',
      url: creator.tiktok_profile,
      handle: creator.tiktok_profile.split('/').pop() || ''
    });
  }
  
  return socials;
}

// Parse video portfolio
export function getCreatorVideos(creator: Creator) {
  if (creator.video_portfolio && Array.isArray(creator.video_portfolio)) {
    return creator.video_portfolio;
  }
  
  if (creator.work_url) {
    // Split work_url by newlines and filter out empty strings
    const urls = creator.work_url.split(/\n|\\n/).filter(url => url.trim());
    return urls;
  }
  
  return [];
}

// Get creator's primary platform
export function getCreatorPrimaryPlatform(creator: Creator) {
  const videos = getCreatorVideos(creator);
  
  if (videos.length === 0) return null;
  
  const firstVideo = videos[0];
  
  if (firstVideo.includes('tiktok.com') || firstVideo.includes('vm.tiktok.com')) {
    return 'tiktok';
  }
  
  if (firstVideo.includes('instagram.com')) {
    return 'instagram';
  }
  
  if (firstVideo.includes('youtube.com') || firstVideo.includes('youtu.be')) {
    return 'youtube';
  }
  
  return 'other';
}

// Format phone number for display
export function formatPhone(phone?: string) {
  if (!phone) return null;
  
  // Already formatted +234 numbers
  if (phone.startsWith('+234')) {
    return phone;
  }
  
  // Format other numbers
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('234')) {
    return `+${digits}`;
  }
  
  if (digits.startsWith('0')) {
    return `+234${digits.slice(1)}`;
  }
  
  return `+234${digits}`;
}

// Calculate creator engagement score (placeholder)
export function calculateEngagementScore(creator: Creator) {
  // This is a placeholder - in a real app you'd calculate based on actual metrics
  const baseScore = Math.random() * 100;
  
  // Adjust based on available data
  let score = baseScore;
  
  if (creator.video_portfolio && creator.video_portfolio.length > 2) {
    score += 20;
  }
  
  if (creator.instagram_profile && creator.tiktok_profile) {
    score += 15;
  }
  
  if (creator.bio && creator.bio.length > 50) {
    score += 10;
  }
  
  return Math.min(100, Math.round(score));
} 