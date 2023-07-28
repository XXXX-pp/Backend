export const otpMessage = (otp, timeLeft)=> {
  let temp = `
      <div style="max-width: 700px;text-align: center;background: #f4f8fd;
       margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="color: #FF7F50;">Welcome to XXXX 2.0</h2>
        <div style="text-align:center ; color:black;"><br>
        <h3 style="color: teal;">Your OTP is ${otp}</h3>
        <h4 style="color: teal;">It expires in ${timeLeft}</h4>
        </div>
     </div>
        `;
  return temp;
}
