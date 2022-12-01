import UserModel from "../Models/userModels.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
//Register new user
export const registerUser=async (req,res)=>{
    const {username,password,firstname,lastname}=req.body;
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const data={
        username,
        password:hashedPassword,
        firstname,
        lastname
    }
    const newUser=new UserModel(data);

    try {
       const user= await newUser.save();
        const token=jwt.sign({
            username:user.username,
            id:user._id
        },process.env.JWT_KEY,{expiresIn:'1h'})
        res.status(200).json({newUser,token});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//Login user

export const loginUser=async (req,res)=>{
    const {username,password}=req.body;

    try {
        const user=await UserModel.findOne({username:username})
       
        if(user){
            const isValid=await bcrypt.compare(password,user.password);
            
           if(!isValid){res.status(400).json("Wrong Password !!")
           }
           else{
            const token=jwt.sign({
                username:user.username,
                id:user._id
            },process.env.JWT_KEY,{expiresIn:'1h'});
            res.status(200).json({user,token})
           }

        }
        else{
            res.status(404).json("User does not exist !")
        }
        
    } catch (error) {
    res.send(404).json({
        message:error.message
    }
    )
    }
}