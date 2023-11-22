import { otpMessage } from "../../mail/otpEmailMessage.js";
import { sendEmail } from "../../mail/sendOtpMail.js";
import { issueOtp, verifyOtp } from "../../workers/otpWork.js";
import { updateUserStatus,deleteOtp } from "../../workers/dbWork.js";
import { generateJwtToken } from "../../utils/utilities.js";
import { findUser} from "../../workers/dbWork.js"



//send otp to user email
export const sendUserOtp = async (userId, email, username, password) => {
  try {
    // generate a new otp
    const otp = await issueOtp(userId, email, username, password);
    const message = otpMessage(otp.userOtp, otp.timeLeft);

    // send mail with otp details
    const emailStatus = await sendEmail(email, message);

    if (emailStatus.accepted) {
      setTimeout(deleteOtp, 120000, email);
      return { status: true };
    }

    if (emailStatus.rejected) {
      return { status: false };
    }

    // Handle other scenarios if needed

  } catch (error) {
    console.error('Error sending OTP:', error);
    return { status: false, error: true, message: 'Server error, please try again later' };
  }
};


//verify otp details
export const verifyUserOtp = async (req, res) => {
  try {
    const { email, otp, userId } = req.body;

    // check for request body
    if (!email || !otp || !userId) {
      return res.status(404).json({
        status: 404,
        message: 'Please enter your otp',
      });
    }

    // Verify user otp
    const validOtp = await verifyOtp(email, otp);

    if (!validOtp.status && !validOtp.otpDetails) {
      return res.status(404).json({
        status: 404,
        message: 'Otp details not found, resend otp',
      });
    }

    if (!validOtp.status && !validOtp.validOtp) {
      return res.status(403).json({
        status: 403,
        message: 'Otp details incorrect',
      });
    }

    if (validOtp.status && validOtp.validOtp) {
      const user = await updateUserStatus(userId);

      if (user) {
        await deleteOtp(email);
        const token = await generateJwtToken(user);
        return res.status(200).json({
          status: 200,
          message: 'User verified',
          data: user,
          token,
        });
      }
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);

    // Delete user from database if necessary

    return res.status(500).json({
      status: 500,
      message: 'Server error, please try again later',
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Check for request body
    if (!email || !userId) {
      return res.status(404).json({
        status: 404,
        message: 'Details cannot be empty',
      });
    }

    // Find user
    const user = await findUser(userId, email);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    // Delete existing OTP
    await deleteOtp(email);

    // Send OTP
    const resendStatus = await sendUserOtp(user._id, user.email, user.username, user.password);

    if (resendStatus.status === true) {
      return res.status(201).json({
        status: 201,
        userId: user._id,
        email: user.email,
        message: 'Otp sent successfully',
      });
    }

    if (resendStatus.status === false) {
      return res.status(400).json({
        status: 400,
        message: 'Failed to send OTP, check email',
      });
    }
  } catch (error) {
    console.error('Error in resendOtp:', error);

    res.status(500).json({
      status: 500,
      message: 'Server error, please try again later, ' + error.message,
    });
  }
};
