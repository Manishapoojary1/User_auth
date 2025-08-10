import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';
import transporter from '../config/nodemailer.js';

const { JsonWebTokenError } = jwt;

export const register = async(req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.status(400).json({success:false,message:'Missing details'})
    }
    try{
        const existingUser= await userModel.findOne({email});

        if(existingUser){
            return res.json({success:false,message:'User already exists'});

            }
        
     const hashedpassword=await bcrypt.hash(password,10);
     const user= new userModel({name,email,password:hashedpassword});
     await user.save();


     const token=jwt.sign({id:user._id} ,process.env.JWT_SECRET,{expiresIn:'7d'});

     res.cookie('token', token,{
        httpOnly: true,
        secure :process.env.NODE_ENV=='production',
        sameSite:process.env.NODE_ENV=='production' ? 'none':'strict',
        maxAge:7*24*60*60*1000
     });

     //sending welcome email
     const mailOptions={
        from:process.env.SENDER_EMAIL,
        to: email,
        subject:'Welcome to Tailors Touch',
        text:`Welcome to Tailors Touch website.Your account has been created with email id:${email}`
     }

     await transporter.sendMail(mailOptions);

     return res.json({success:true});



    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export const login=async(req,res)=>{
    const{email,password}=req.body;
    if(!email|| !password){
        return res.json({success:false,message:'Email and password are required'})
    }
    try{
        const user=await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:'Invalid email'})
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false,message:'Invalid password'})
        }
        const token=jwt.sign({id:user._id} ,process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token', token,{
            httpOnly: true,
            secure :process.env.NODE_ENV=='production',
            sameSite:process.env.NODE_ENV=='production' ? 'none':'strict',
            maxAge:7*24*60*60*1000
     });
      return res.json({ success: true, isAccountVerified: user.isAccountVerified });



    }catch(error)
    {
        res.json({success: false, message: error.message});
    }
}


export const logout=async(req,res)=>{
    try{
       res.clearCookie('token',{
        httpOnly: true,
        secure :process.env.NODE_ENV=='production',
        sameSite:process.env.NODE_ENV=='production' ? 'none':'strict',
       })
       return res.json({success:true,message:"Logged out"})
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const sendVerifyOtp = async(req,res)=>{
    try{
        const{userId}=req.body;

        const user=await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account already verified"})
        }

       const otp=String(Math.floor( 100000 + Math.random()*900000));
       user.verifyOtp=otp;
       user.verifyOtpExpiresAt=Date.now()+24*60*60*1000;

       await user.save();

       const mailOptions={
        from:process.env.SENDER_EMAIL,
        to: user.email,
        subject:'Account verification OTP',
        text:`Your OTP is ${otp}.Verify your account using this OTP.`
       }
       await transporter.sendMail(mailOptions);

       res.json({success:true,message:'Verification OTP sent on your emai'});
       

    }catch(error){
        return res.json({success: false, message: error.message});

    }
}


export const verifyEmail=async(req,res)=>{
    const{userId,otp}=req.body;

    if(!userId || !otp){
        return res.json({success: false, message: 'Missing Details'});
    }
    try {
        const user=await userModel.findById(userId);
        if(!user){
             return res.json({success:true, message: 'User not found'});
        }
        if(user.verifyOtp==''|| user.verifyOtp!==otp){
             return res.json({success: true, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpiresAt<Date.now()){
            return res.json({success: false, message: 'OTP Expired'});
        }
        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpiresAt=0;await user.save();
        return res.json({success:true,message:'Email verified successfully'})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


//password reset otp

export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;

    if(!email){
        return res.json({success:false,message:'Email is required'})
    }

    try {
        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'User not found'});
        }
        const otp=String(Math.floor( 100000 + Math.random()*900000));
       user.resetOtp=otp;
       user.resetOtpExpiresAt=Date.now()+15*60*1000;

       await user.save();

       const mailOptions={
        from:process.env.SENDER_EMAIL,
        to: user.email,
        subject:'Password reset OTP',
        text:`Your OTP for reseting your password is ${otp}.Use this OTP to procedd with resetting your password.`
       }
       await transporter.sendMail(mailOptions);

       return res.json({success:true,message:'OTP sent to your email'});

      

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    return res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Reset user password
export const resetPassword =async(req,res)=>{
    const {email,otp,newPassword} =req.body;

    if(!email || !otp ||!newPassword){
        return res.json({success:false,message:'Email.OTP and new password are required'});
    }
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'User not found'});
        }
        if(user.resetOtp==""|| user.resetOtp!=otp){
            return res.json({success:false,message:'Invalid OTP'});
        }

        if(user.resetOtpExpiresAt<Date.now()){
            return res.json({success: false, message: 'OTP Expired'});
        }

        const hashedpassword=await bcrypt.hash(newPassword,10);

        user.password=hashedpassword;
        user.resetOtp='';
        user.resetOtpExpiresAt=0;

        await user.save();
        return res.json({success:true,message:'Password has been reset succcessfully'});
  

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}