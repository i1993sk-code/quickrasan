import axios from "axios";

const sendSMSStartMessaging = async (mobile, otp) => {
  try {
    const apiKey = process.env.STARTMESSAGING_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ STARTMESSAGING_API_KEY missing - SMS not sent");
      return { success: false, message: "API key missing" };
    }

    const cleanMobile = mobile.toString().replace(/\D/g, "").slice(-10);

    const response = await axios.post(
      "https://api.startmessaging.com/otp/send",
      {
        phoneNumber: `+91${cleanMobile}`,
        variables: {
          otp: otp,
          appName: "QuickRasan"
        }
      },
      {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const requestId = response.data?.data?.requestId || response.data?.requestId || 'unknown';
      console.log(`✅ StartMessaging OTP sent to +91${cleanMobile}: ${requestId}`);
      return { success: true, requestId, data: response.data };
    } else {
      console.error("❌ StartMessaging API Error:", response.data);
      return { success: false, error: response.data };
    }

  } catch (error) {
    console.error("❌ StartMessaging Send Failed:", error.response?.data || error.message);
    return { success: false, message: error.message };
  }
};

export default sendSMSStartMessaging;
