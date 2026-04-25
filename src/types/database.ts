export interface House {
  id: string
  name: string
  color: string
  mascot?: string
  mascot_name?: string
  logo_url?: string
  banner_url?: string
  points: number
  rank_pos: number
  motto?: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  sort_order: number
  gender?: string
  eligible_years?: string
  category_type: 'sport' | 'cultural'
  special_rules?: string
  is_active: boolean
  registration_url?: string
  team_size?: string
  duration?: string
  image_url?: string
  judging_criteria?: unknown
  created_at: string
}

export interface Match {
  id: number
  category_id: string
  match_no?: number
  team1_id: string
  team2_id: string
  score1: number
  score2: number
  winner_id?: string
  status: 'upcoming' | 'live' | 'completed'
  venue?: string
  match_time?: string
  eligible_years?: string
  man_of_the_match?: string
  created_at: string
  category?: { name: string }
  team1?: { name: string; color: string }
  team2?: { name: string; color: string }
  winner?: { name: string }
}
