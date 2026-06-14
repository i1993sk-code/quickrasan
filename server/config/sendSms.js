const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_dd064509c77c75f7fbc5b5d7c84bc819c06caa07'
const BASE_URL = 'https://api.startmessaging.com'

export const sendOtp = async (mobile) => {
  try {
    const phoneNumber = mobile.startsWith('+91') ? `+91${mobile.replace(/^\+91/, '')}` : `+91${mobile}`
    const response = await fetch(`${BASE_URL}/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STARTMESSAGING_API_KEY,
      },
      body: JSON.stringify({ phoneNumber }),
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Failed to send OTP')
    }
    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('[SMS ERROR]', error.message)
    return null
  }
}

export const verifyOtp = async (requestId, otpCode) => {
  try {
    const response = await fetch(`${BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STARTMESSAGING_API_KEY,
      },
      body: JSON.stringify({ requestId, otpCode }),
    })
    if (!response.ok) return { verified: false }
    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('[OTP VERIFY ERROR]', error.message)
    return { verified: false }
  }
}
