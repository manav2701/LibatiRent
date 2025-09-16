const sendEmail = require("../utils/sendEmail");

const otpStore = {}; // { email: { otp, expires } }

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min
  try {
    await sendEmail({
      email,
      subject: "Libati — Your One-Time Verification Code",
      message: `Hello,

You've requested to verify your email address with Libati. Use the code below to complete the verification process:

    ${otp}

This code will expire in 10 minutes. For your security, please do not share this code with anyone. If you did not request this, you can safely ignore this message.

Thanks,
The Libati Team
https://www.libati.com
Email: support@libati.com

-----------------------
Security tips:
- Libati will never ask for your password or OTP via email or phone.
- If you receive an unexpected OTP, contact our support team immediately.
`
    });
    console.log(`OTP sent to ${email}: ${otp}`); // Debug log
    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("Failed to send OTP:", err); // Debug log
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });
  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  delete otpStore[email];
  res.json({ message: "OTP verified" });
};
