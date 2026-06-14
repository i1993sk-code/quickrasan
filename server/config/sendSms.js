import https from 'https'

const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_dd064509c77c75f7fbc5b5d7c84bc819c06caa07'
const BASE_URL = 'api.startmessaging.com'

const request = (method, path, body) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : ''
    const options = {
      hostname: BASE_URL,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STARTMESSAGING_API_KEY,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }
    const req = https.request(options, (res) => {
      let chunks = ''
      res.on('data', (chunk) => (chunks += chunk))
      res.on('end', () => {
        try {
          const parsed = JSON.parse(chunks)
          if (res.statusCode >= 400) {
            reject(new Error(parsed.message || `HTTP ${res.statusCode}`))
          } else {
            resolve(parsed.data)
          }
        } catch {
          reject(new Error(chunks))
        }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

export const sendOtp = async (mobile) => {
  try {
    const phoneNumber = mobile.startsWith('+91')
      ? `+91${mobile.replace(/^\+91/, '')}`
      : `+91${mobile}`
    const result = await request('POST', '/otp/send', { phoneNumber })
    return result
  } catch (error) {
    console.error('[SMS ERROR]', error.message)
    return null
  }
}

export const verifyOtp = async (requestId, otpCode) => {
  try {
    const result = await request('POST', '/otp/verify', { requestId, otpCode })
    return result
  } catch (error) {
    console.error('[OTP VERIFY ERROR]', error.message)
    return { verified: false }
  }
}
