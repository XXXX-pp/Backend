import bcrypt from "bcryptjs";
import { userModel } from "../model/userModel.js";
import { UserOTPVerification } from "../model/userOTPVerifiaction.js";
import nodemailer from "nodemailer";

// Nodemailer Implemention
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "xxxcompany2.0@gmail.com",
    pass: "siviwmwobcwrbokl",
  },
});

//testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message");
    console.log(success);
  }
});

export async function createUser(req, res) {
  try {
    // Extracting the username, mobilenumber, and password from the request body
    const { username, password, email } = req.body;

    // Checking if a user with the same username already exists
    const userExist = await userModel.findOne({ username });

    if (userExist) {
      // If a user with the same username exists, send an error response
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Creating a new user with the provided username, mobilenumber, and password
    const user = await userModel.create({
      username,
      
      password: hashedPassword,
      Verified: false,
      email,
    });

    await sendOTPVerification(user, res);
    // If user creation is successful, send a JSON response with the user's information
    // return res
    //   .status(201)
    //   .json({
    //     success: true,
    //     message: `user created successfully`,
    //     data: user,
    //   });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
}

const sendOTPVerification = async ({ _id, email }, res) => {
  try {
    // Generate a random 4-digit OTP
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // Configure email options for sending the OTP
    const mailOptions = {
      from: "xxxcompany2.0@gmail.com",
      to: email,
      subject: "Verify Your Email",
      // Compose the email body with the generated OTP
      html: `<p>Enter ${otp} </br> in the app to verify your email address and complete the signup process
      <p>This code <b>expires in 1 hour.</b></p>
    </p>`,
    };

    // Hash the OTP for security before storing it in the database
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    // Create a new document in the UserOTPVerification collection with the hashed OTP and other details
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // OTP expires in 1 hour (3600000 milliseconds)
    });

    // Save the OTP verification data to the database
    await newOTPVerification.save();

    // Send the OTP verification email using the configured transporter
    await transporter.sendMail(mailOptions);

    // Return a JSON response indicating that the OTP email was sent successfully
    return res.json({
      status: "PENDING",
      message: "Verification OTP email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    // If an error occurs during the process, log the error and return a 500 error response
    console.error(error);
    return res
      .status(500)
      .json({ status: "FAILED", message: "An error occurred" });
  }
};

export async function verifyOTP(req, res) {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const userOTPVerifiactionRecords = await UserOTPVerification.find({
        userId,
      });

      if (userOTPVerifiactionRecords.length <= 0) {
        throw new Error(
          "Account record dosen't exist or has already been verified already. Please sign up or log in."
        );
      } else {
        const { expiresAt } = userOTPVerifiactionRecords[0];
        const hashedOTP = userOTPVerifiactionRecords[0].otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            await userModel.updateOne({ _id: userId }, { Verified: true });

            await UserOTPVerification.deleteMany({ userId });

            res.json({
              status: "Verified",
              message: "User email verified successfully.",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
}

export async function resendOTPVerificationCode(req, res) {
  try {
    let { userId, email } = req.body;

    if (!userId || !email) {
      throw Error("Empty otp details are not allowed");
    } else {
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerification({ _id: userId, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { identifier, password } = req.body;

    // Checking if a user with the same username or email already exists
    const user = await userModel.findOne({
      $or: [{ userName: identifier }, { email: identifier }],
    });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.json({
          _id: user._id,
          userName: user.username,
          email: user.email,
          
        });
      } else {
        throw new Error('Passwords do not match');
      }
    } else {
      throw new Error('User not found');
    }

  } catch (error) {
    // If user login fails, send an error response
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

