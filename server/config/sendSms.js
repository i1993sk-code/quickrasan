import axios from 'axios'

const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_dd064509c77c75f7fbc5b5d7c84bc819c06caa07'
const SENDER_ID = 'QRASAN'

export const sendSms = async (mobile, message) => {
  try {
    const url = `https://api.startmessaging.com/send.php`
    const params = {
      apikey: STARTMESSAGING_API_KEY,
      senderid: SENDER_ID,
      number: mobile,
      message: message,
      format: 'json'
    }
    const response = await axios.get(url, { params, timeout: 10000 })
    console.log(`[SMS] ${mobile} → ${message} | Response:`, response.data)
    return response.data
  } catch (error) {
    console.error(`[SMS ERROR] ${mobile}:`, error.message)
    return null
  }
}

export const sendOtpSms = async (mobile, otp) => {
  const message = `Your QuickRasan login OTP is ${otp}. Valid for 5 minutes. - QRASAN`
  return sendSms(mobile, message)
}
