/**
 * 认证相关 API
 * 对应 Android 的 SupabaseService.sendVerificationCode 和 verifyCode
 */
import { getEdgeFunctionsBaseUrl } from '../supabase/client'

// 延迟获取，避免构建时立即检查
function getSupabaseAnonKey(): string {
  // 在 Next.js 中，NEXT_PUBLIC_ 前缀的环境变量会在构建时内联到客户端代码
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!key) {
    // 调试信息：列出所有可用的 NEXT_PUBLIC_ 环境变量
    const availableEnvVars = typeof process !== 'undefined' && process.env
      ? Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_'))
      : []
    
    console.error('❌ Environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
    console.error('📋 Available NEXT_PUBLIC_ variables:', availableEnvVars)
    console.error('🔧 Please check Vercel: Settings -> Environment Variables')
    console.error('   Variable name must be exactly: NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.error('   Must select all environments: Production, Preview, Development')
    console.error('   After updating, you must redeploy the project')
    
    throw new Error('配置错误：缺少 Supabase 密钥。请联系管理员。')
  }
  
  // 验证密钥格式
  if (key.length < 10) {
    console.warn('⚠️ Supabase key seems too short, please verify it is correct')
  }
  
  return key
}

/**
 * 清理错误消息，移除可能包含的技术细节
 * 对应 Android 的 sanitizeErrorMessage
 */
function sanitizeErrorMessage(message: string | null): string {
  if (!message) return '请打开网络后再尝试'
  const lowerMessage = message.toLowerCase()
  if (
    lowerMessage.includes('supabase') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('unable to resolve host') ||
    lowerMessage.includes('failed to connect') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('no address associated with hostname')
  ) {
    return '请打开网络后再尝试'
  }
  return message
}

/**
 * 发送验证码
 * 对应 Android 的 SupabaseService.sendVerificationCode
 */
export async function sendVerificationCode(
  email: string,
  channelCode: string = 'channelA'
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const anonKey = getSupabaseAnonKey()
    const edgeFunctionsUrl = getEdgeFunctionsBaseUrl()
    console.log('Sending verification code to:', edgeFunctionsUrl + 'send-verification-code')
    
    const response = await fetch(`${edgeFunctionsUrl}send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({
        email,
        channel_code: channelCode,
      }),
    })

    const statusCode = response.status
    const contentType = response.headers.get('Content-Type') || ''

    let responseData: any
    let responseText: string = ''
    
    try {
      responseText = await response.text()
      responseData = JSON.parse(responseText)
      console.log('Verification code response:', { statusCode, responseData })
    } catch (e) {
      console.error('Failed to parse JSON response:', { statusCode, responseText })
      
      // 检查是否是 JWT 错误
      if (responseText.includes('Invalid JWT') || responseText.includes('JWT') || responseText.includes('jwt')) {
        console.error('Invalid JWT error detected in response')
        return {
          success: false,
          error: '配置错误：Supabase 密钥不正确。请联系管理员。',
        }
      }
      
      if (statusCode === 500) {
        return {
          success: false,
          error: '服务器错误，请稍后重试',
        }
      }
      return {
        success: false,
        error: '服务器响应格式错误，请稍后重试',
      }
    }

    const success = responseData.success ?? false
    const message = responseData.message || responseData.error || ''
    const code = responseData.code

    // 检查 JWT 相关错误
    if (message && (message.includes('Invalid JWT') || message.includes('JWT') || message.includes('jwt'))) {
      console.error('Invalid JWT error detected in message')
      console.error('This usually means the Supabase anon key is incorrect')
      return {
        success: false,
        error: '配置错误：Supabase 密钥不正确。请联系管理员。',
      }
    }

    if (statusCode === 429) {
      return {
        success: false,
        error: message || '请求过于频繁，请稍后再试',
      }
    }

    if (statusCode === 401 || statusCode === 403) {
      // 认证错误，可能是密钥问题
      console.error('Authentication error:', { statusCode, message })
      return {
        success: false,
        error: '配置错误：Supabase 密钥不正确。请联系管理员。',
      }
    }

    if (statusCode >= 400 && statusCode < 500) {
      // 客户端错误，返回具体错误消息
      return {
        success: false,
        error: message || '发送验证码失败，请检查邮箱地址',
      }
    }

    if (statusCode >= 500) {
      // 服务器错误，显示更详细的信息
      console.error('Server error:', { statusCode, message, responseData })
      return {
        success: false,
        error: message || '服务器错误，请稍后重试',
      }
    }

    if (!success) {
      return {
        success: false,
        error: message || '发送验证码失败',
      }
    }

    if (success) {
      // 如果消息中包含验证码（开发模式），提取出来
      let extractedCode = code
      if (!extractedCode && message) {
        const codeMatch = message.match(/(\d{6})/)
        extractedCode = codeMatch ? codeMatch[1] : null
      }

      return {
        success: true,
        data: {
          success: true,
          message: message || '验证码已发送到您的邮箱',
          code: extractedCode,
        },
      }
    } else {
      return {
        success: false,
        error: sanitizeErrorMessage(message || '发送验证码失败'),
      }
    }
  } catch (error: any) {
    console.error('Send verification code error:', error)
    // 网络错误或其他异常
    if (error.message && (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('network')
    )) {
      return {
        success: false,
        error: '网络连接失败，请检查网络后重试',
      }
    }
    return {
      success: false,
      error: error.message || '发送失败，请稍后重试',
    }
  }
}

/**
 * 验证验证码
 * 对应 Android 的 SupabaseService.verifyCode
 */
export async function verifyCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const anonKey = getSupabaseAnonKey()
    const edgeFunctionsUrl = getEdgeFunctionsBaseUrl()
    console.log('Verifying code at:', edgeFunctionsUrl + 'verify-code')
    
    const response = await fetch(`${edgeFunctionsUrl}verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({
        email,
        code,
      }),
    })

    const statusCode = response.status
    let responseData: any
    
    try {
      responseData = await response.json()
      console.log('Verify code response:', { statusCode, responseData })
    } catch (e) {
      const text = await response.text()
      console.error('Failed to parse JSON response:', { statusCode, text })
      
      // 检查是否是 JWT 错误
      if (text.includes('Invalid JWT') || text.includes('JWT')) {
        return {
          success: false,
          error: '配置错误：Supabase 密钥不正确。请联系管理员。',
        }
      }
      
      return {
        success: false,
        error: '服务器响应格式错误，请稍后重试',
      }
    }

    const success = responseData.success ?? false
    const message = responseData.message

    // 检查 JWT 相关错误
    if (message && (message.includes('Invalid JWT') || message.includes('JWT'))) {
      console.error('Invalid JWT error detected')
      console.error('This usually means the Supabase anon key is incorrect')
      console.error('Please check: Supabase Dashboard -> Settings -> API -> anon public key')
      return {
        success: false,
        error: '配置错误：Supabase 密钥不正确。请联系管理员。',
      }
    }

    if (statusCode === 401 || statusCode === 403) {
      return {
        success: false,
        error: '配置错误：Supabase 密钥不正确。请联系管理员。',
      }
    }

    if (success) {
      return { success: true }
    } else {
      return {
        success: false,
        error: sanitizeErrorMessage(message || '验证码错误'),
      }
    }
  } catch (error: any) {
    console.error('Verify code error:', error)
    
    // 检查是否是 JWT 相关错误
    if (error.message && error.message.includes('JWT')) {
      return {
        success: false,
        error: '配置错误：Supabase 密钥不正确。请联系管理员。',
      }
    }
    
    return {
      success: false,
      error: sanitizeErrorMessage(error.message || '验证失败：网络连接异常'),
    }
  }
}

/**
 * 保存注册信息到 localStorage
 * 对应 Android 的 RegistrationManager.saveRegistration
 */
export function saveRegistration(email: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('axiselect_registered_email', email)
    localStorage.setItem('axiselect_registration_time', Date.now().toString())
  }
}

/**
 * 获取已注册的邮箱
 * 对应 Android 的 RegistrationManager.getRegisteredEmail
 */
export function getRegisteredEmail(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('axiselect_registered_email')
  }
  return null
}

/**
 * 检查是否需要重新验证（7天后需要重新验证）
 * 对应 Android 的 RegistrationManager.needsReVerification
 */
export function needsReVerification(): boolean {
  if (typeof window === 'undefined') return true

  const registrationTime = localStorage.getItem('axiselect_registration_time')
  if (!registrationTime) return true

  const daysSinceRegistration =
    (Date.now() - parseInt(registrationTime)) / (1000 * 60 * 60 * 24)
  return daysSinceRegistration > 7
}

