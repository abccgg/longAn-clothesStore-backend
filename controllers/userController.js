import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs"
import validator from "validator";
import jwt from "jsonwebtoken"



const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}
const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if (!user){
            return res.json({success:false,message:"User doesn't exist"})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (isMatch){
            const token = createToken(user._id)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
const registerUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const exists = await userModel.findOne({email});
        if (exists){
            return res.json({success:false,message:"User already exists"})
        }
        if (!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email!"})
        }
        if (password.length < 8){
            return res.json({success:false,message:"Please enter a strong password"})
        }
        const salt = await bcrypt.genSalt(10)
        const harsedPassword = await bcrypt.hash(password,salt)
        const newUser = new userModel({
            name,
            email,
            password:harsedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

const adminLogin = async(req,res) => {
    try {
        const { email,password } = req.body
        if ( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const detailsUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findOne({
            _id: id
        })
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        console.log('user:', user); // Nếu cần dùng thông tin từ body

        res.json({success:true,user})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL
        const updatedData = req.body; // Lấy dữ liệu cập nhật từ body

        const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, { 
            new: true, // Trả về dữ liệu đã cập nhật
            runValidators: true // Đảm bảo dữ liệu tuân thủ schema
        })
        res.json({ success: true, message: "User Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, detailsUser, updateUser}