/**
 * 内容相关 API
 * 对应 Android 的 SupabaseService 中的各种 get 方法
 */
import { supabase } from '../supabase/client'

// 延迟获取，避免构建时立即检查
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Please check your environment variables.')
  }
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your environment variables.')
  }
  return key
}

// 延迟到使用时才获取，避免构建时立即执行
function getSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    key: getSupabaseAnonKey(),
  }
}

/**
 * 清理错误消息
 */
function sanitizeErrorMessage(message: string | null): string {
  if (!message) return '请打开网络后再尝试'
  const lowerMessage = message.toLowerCase()
  if (
    lowerMessage.includes('supabase') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection')
  ) {
    return '请打开网络后再尝试'
  }
  return message
}

/**
 * 获取案例分享列表
 * 对应 Android 的 SupabaseService.getCaseStudies
 */
export async function getCaseStudies(): Promise<{
  success: boolean
  data?: CaseStudy[]
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/case_studies?select=*&is_active=eq.true&order=display_order.asc`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      }
    } else {
      return {
        success: false,
        error: `获取案例分享列表失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get case studies error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取案例分享列表失败'),
    }
  }
}

/**
 * 获取财经直播流列表
 * 对应 Android 的 SupabaseService.getFinanceLiveStreams
 */
export async function getFinanceLiveStreams(): Promise<{
  success: boolean
  data?: FinanceLiveStream[]
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/finance_live_streams?select=*&is_active=eq.true&order=display_order.asc`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      }
    } else {
      return {
        success: false,
        error: `获取财经直播流列表失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get finance live streams error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取财经直播流列表失败'),
    }
  }
}

/**
 * 获取核心亮点列表
 * 对应 Android 的 SupabaseService.getHighlights
 */
export async function getHighlights(): Promise<{
  success: boolean
  data?: Highlight[]
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/highlights?select=*&is_active=eq.true&order=display_order.asc`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      }
    } else {
      return {
        success: false,
        error: `获取核心亮点列表失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get highlights error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取核心亮点列表失败'),
    }
  }
}

/**
 * 获取计划介绍内容列表
 * 对应 Android 的 SupabaseService.getProgramContent
 */
export async function getProgramContent(): Promise<{
  success: boolean
  data?: ProgramContent[]
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/program_content?select=*&is_active=eq.true&order=display_order.asc`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      }
    } else {
      return {
        success: false,
        error: `获取计划介绍内容列表失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get program content error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取计划介绍内容列表失败'),
    }
  }
}

/**
 * 获取启动流程步骤列表
 * 对应 Android 的 SupabaseService.getGettingStartedSteps
 */
export async function getGettingStartedSteps(): Promise<{
  success: boolean
  data?: GettingStartedStep[]
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/getting_started_steps?select=*&is_active=eq.true&order=display_order.asc`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      }
    } else {
      return {
        success: false,
        error: `获取启动流程步骤列表失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get getting started steps error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取启动流程步骤列表失败'),
    }
  }
}

/**
 * 获取违规说明规则列表
 * 对应 Android 的 SupabaseService.getViolationRules
 */
export async function getViolationRules(): Promise<{
  success: boolean
  data?: ViolationRule[]
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/violation_rules?select=*&is_active=eq.true&order=display_order.asc`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      }
    } else {
      return {
        success: false,
        error: `获取违规说明规则列表失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get violation rules error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取违规说明规则列表失败'),
    }
  }
}

/**
 * 获取常见问题列表
 * 对应 Android 的 SupabaseService.getFaqItems
 */
export async function getFaqItems(): Promise<{
  success: boolean
  data?: FaqItem[]
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/faq_items?select=*&is_active=eq.true&order=display_order.asc`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      }
    } else {
      return {
        success: false,
        error: `获取常见问题列表失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get FAQ items error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取常见问题列表失败'),
    }
  }
}

/**
 * 获取风险提示内容
 * 对应 Android 的 SupabaseService.getRiskWarning
 */
export async function getRiskWarning(): Promise<{
  success: boolean
  data?: RiskWarning | null
  error?: string
}> {
  try {
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/risk_warnings?select=*&is_active=eq.true&limit=1`

    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return {
        success: true,
        data: Array.isArray(data) && data.length > 0 ? data[0] : null,
      }
    } else {
      return {
        success: false,
        error: `获取风险提示内容失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get risk warning error:', error)
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '获取风险提示内容失败'),
    }
  }
}

// 类型定义（对应 Android 的 model 类）
export interface CaseStudy {
  id: number
  name: string | null
  video_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface FinanceLiveStream {
  id: number
  name: string | null
  stream_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface Highlight {
  id: number
  title: string
  description: string
  is_active: boolean
  display_order: number
  created_at: string
}

export interface ProgramContent {
  id: number
  section_type: string
  title: string | null
  content: string | null
  stage_name: string | null
  min_equity: string | null
  edge_score: string | null
  max_multiplier: string | null
  max_capital: string | null
  profit_share: string | null
  profit_target: string | null
  stage_duration: string | null
  trades_per_stage: string | null
  leverage: string | null
  max_loss: string | null
  keyword: string | null
  definition: string | null
  link_text: string | null
  link_target: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface GettingStartedStep {
  id: number
  title: string
  detail: string
  icon_name: string | null
  links: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface ViolationRule {
  id: number
  title: string
  definition: string
  consequence: string
  is_active: boolean
  display_order: number
  created_at: string
}

export interface FaqItem {
  id: number
  question: string
  answer: string
  is_active: boolean
  display_order: number
  created_at: string
}

export interface RiskWarning {
  id: number
  title: string
  content: string
  is_active: boolean
  created_at: string
}

