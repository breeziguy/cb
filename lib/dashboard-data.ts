import supabase from '@/lib/supabase'; // Replaced import
import type { User } from '@supabase/supabase-js'

export interface DashboardStats {
  currentBalance: number
  totalBriefsSent: number
  totalCreatorsFavorited: number
  pendingBriefs: number
}

export interface BriefHistoryItem {
  id: string
  submissionDate: string
  creatorName: string | null
  campaignTitle: string
  budget: number
  status: string
}

export async function getDashboardStats(user?: User | null): Promise<DashboardStats | null> {
  try {
    // Use provided user or get current user
    let currentUser = user;
    if (!currentUser) {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.log('No authenticated user found')
        return null
      }
      currentUser = user;
    }

    console.log('Fetching dashboard stats for user:', currentUser.email)

    // Get user's wallet balance from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', currentUser.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
    }

    console.log('Profile data fetched:', profile)
    console.log('Wallet balance raw:', profile?.wallet_balance)
    console.log('Wallet balance parsed:', parseFloat(profile?.wallet_balance || '0'))

    // Get total briefs sent by user
    const { count: totalBriefsSent, error: briefsError } = await supabase
      .from('briefs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)

    if (briefsError) {
      console.error('Error fetching briefs count:', briefsError)
    }

    // Get total creators favorited by user
    const { count: totalCreatorsFavorited, error: favoritesError } = await supabase
      .from('saved_creators')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)

    if (favoritesError) {
      console.error('Error fetching favorites count:', favoritesError)
    }

    // Get pending briefs
    const { count: pendingBriefs, error: pendingError } = await supabase
      .from('briefs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)
      .eq('status', 'pending')

    if (pendingError) {
      console.error('Error fetching pending briefs count:', pendingError)
    }

    const stats = {
      currentBalance: parseFloat(profile?.wallet_balance || '0'),
      totalBriefsSent: totalBriefsSent || 0,
      totalCreatorsFavorited: totalCreatorsFavorited || 0,
      pendingBriefs: pendingBriefs || 0
    }

    console.log('Dashboard stats:', stats)
    return stats
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

export async function getBriefHistory(user?: User | null): Promise<BriefHistoryItem[]> {
  try {
    // Use provided user or get current user
    let currentUser = user;
    if (!currentUser) {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.log('No authenticated user found')
        return []
      }
      currentUser = user;
    }

    console.log('Fetching brief history for user:', currentUser.email)

    // Get briefs with creator information
    const { data: briefs, error: briefsError } = await supabase
      .from('briefs')
      .select(`
        id,
        created_at,
        title,
        budget,
        status,
        creators (
          name
        )
      `)
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })

    if (briefsError) {
      console.error('Error fetching brief history:', briefsError)
      return []
    }

    const briefHistory = briefs?.map(brief => ({
      id: brief.id,
      submissionDate: new Date(brief.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      creatorName: (brief.creators as any)?.name || null,
      campaignTitle: brief.title,
      budget: parseFloat(brief.budget.toString()),
      status: brief.status
    })) || []

    console.log('Brief history:', briefHistory)
    return briefHistory
  } catch (error) {
    console.error('Error fetching brief history:', error)
    return []
  }
}