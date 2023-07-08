import bcrypt from "bcryptjs";
import { userModel } from "../model/userModel.js";
import { UserOTPVerification } from "../model/userOTPVerifiaction.js"
import nodemailer from "nodemailer";


// Nodemailer Implemention
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'xxxcompany2.0@gmail.com',
    pass: 'siviwmwobcwrbokl',
  },
})


//testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  }
  else {
    console.log("Ready for message")
    console.log(success)
  }
})

export async function createUser(req, res) {
  try {
    // Extracting the username, mobilenumber, and password from the request body
    const { firstName, lastName, userName, phoneNumber, password, email } = req.body;

    // Checking if a user with the same username already exists
    const userExist = await userModel.findOne({ userName });

    if (userExist) {
      // If a user with the same username exists, send an error response
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Creating a new user with the provided username, mobilenumber, and password
    const user = await userModel.create({

      firstName,
      lastName,
      email,
      userName,
      phoneNumber,
      Verified: false,
      password: hashedPassword,
    });

    await sendOTPVerification(user, res)

    // If user creation is successful, send a JSON response with the user's information
    // return res.status(201).json({
    //   success: true,
    //   message: `user created successfully`,
    //   data: user,
    // });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
}



//send OTP verification email
const sendOTPVerification = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // mailOptions
    const mailOptions = {
      from: 'xxxcompany2.0@gmail.com',
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Enter ${otp} </br> in the app to verify your email address and complete the signup process
      <p>This code <b>expires in 1 hour.</b></p>
    </p>`,
    };

    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);

    return res.json({
      status: 'PENDING',
      message: 'Verification OTP email sent',
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'FAILED', message: 'An error occurred' });
  }
};



export async function verifyOTP(req, res) {
  try {
    let { userId, otp } = req.body
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed")
    }
    else {
      const userOTPVerifiactionRecords = await UserOTPVerification.find({ userId })

      if (userOTPVerifiactionRecords.length <= 0) {
        throw new Error("Account record dosen't exist or has already been verified already. Please sign up or log in.")
      } else {

        const { expiresAt } = userOTPVerifiactionRecords[0];
        const hashedOTP = userOTPVerifiactionRecords[0].otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId })
          throw new Error("Code has expired. Please request again")
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP)

          if (!validOTP) {
            throw new Error("Invalid code passed. Check your inbox.")
          }
          else {
            await userModel.updateOne({ _id: userId }, { Verified: true });

            await UserOTPVerification.deleteMany({ userId });

            res.json({
              status: "Verified",
              message: 'User email verified successfully.'
            })
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message
    })
  }
}




export async function resendOTPVerificationCode(req, res) {
  try {
    let { userId, email} = req.body

    if (!userId || !email) {
      throw Error("Empty otp details are not allowed")
    } else {
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerification({ _id: userId, email }, res)
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message
    })
  }
}




export async function handleLogIn(req, res) {
  const { username, password } = req.body;

  // Checking if a user with the same username already exists
  const user = await users.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      mobilenumber: user.mobilenumber,
    });
  } else {
    // If user creation fails, send an error response
    res.status(400);
    throw new Error("There was an error");
  }
}
