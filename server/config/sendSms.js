import https from 'https'

const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_dd064509c77c75f7fbc5b5d7c84bc819c06caa07'
const SENDER_ID = 'QRASAN'

const httpsGet = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { resolve(data) }
      })
    }).on('error', reject)
  })
}

export const sendSms = async (mobile, message) => {
  try {
    const params = new URLSearchParams({
      apikey: STARTMESSAGING_API_KEY,
      senderid: SENDER_ID,
      number: mobile,
      message: message,
      format: 'json'
    })
    const url = `https://api.startmessaging.com/send.php?${params.toString()}`
    const result = await httpsGet(url)
    console.log(`[SMS] ${mobile} → otp sent | Response:`, result)
    return result
  } catch (error) {
    console.error(`[SMS ERROR] ${mobile}:`, error.message)
    return null
  }
}

export const sendOtpSms = async (mobile, otp) => {
  const message = `Your QuickRasan login OTP is ${otp}. Valid for 5 minutes. - QRASAN`
  return sendSms(mobile, message)
}
