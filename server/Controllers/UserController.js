import UserModel from "../Models/userModels.js";
import bcrypt from 'bcrypt'

export const getUser=async (req,res)=>{
    const id=req.params.id;
    try {
        const user=await UserModel.findById(id);
        if(!user) res.status(404).json("User Not Found !!");
        else{
        const {password,...otherDetails}=user._doc;
        res.status(200).json(otherDetails)}
    } catch (error) {
        res.status(500).json("Internal server error!!")
    }   
}

//get Users

export const getUsers=async (req,res)=>{

    try {
        const users=await UserModel.find();
        users.map((user)=>{
            return user.password=null;
            
        })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error)
        
    }
    
    
}

//Update user
export const updateUser=async (req,res)=>{
    const id=req.params.id;
    const {currentUserId,currentUserAdminStatus,password}=req.body;

    if(id==currentUserId || currentUserAdminStatus){
        try {
            if(password){
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(password,salt);
            }

            const user=await UserModel.findByIdAndUpdate(id,req.body,{new:true});

            res.status(200).json(user);
            
        } catch (error) {
            res.status(500).json("Something Went Wrong !!")
        }
    }

}



//Delete user
export const deleteUser=async (req,res)=>{
    const id=req.params.id;
    const {currentUserId,currentUserAdminStatus}=req.body;

    if(id==currentUserId || currentUserAdminStatus){
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User Deleted Successfully !!");
             
        } catch (error) {
            res.status(500).json("Something Went Wrong !!")
        }
    }
}



//Follow a User
export const followUser=async (req,res)=>{
    const id=req.params.id;

    const {currentUserId}=req.body;

    if(currentUserId===id){
        res.status(403).json("Action Forbidden !!");

    }
    else{
        try {

            const followUser=await UserModel.findById(id);
            const followingUser=await UserModel.findById(currentUserId);

            if(!followUser.followers.includes(currentUserId))
            {
               await followUser.updateOne({$push:{followers:currentUserId}});

               await followingUser.updateOne({$push:{followings:id}});

                res.status(200).json("User Followed !");
            }
            else{
                res.status(403).json("User is Already Followed By You !!")
            }
            
        } catch (error) {
            res.status(500).json({
                message:error.message
            })
        }
    }

}




//Unfollow User

export const unFollowUser=async (req,res)=>{
    const id=req.params.id;

    const {currentUserId}=req.body;

    if(currentUserId===id){
        res.status(403).json("Action Forbidden !!");

    }
    else{
        try {

            const followUser=await UserModel.findById(id);
            const followingUser=await UserModel.findById(currentUserId);

            if(followUser.followers.includes(currentUserId))
            {
               await followUser.updateOne({$pull:{followers:currentUserId}});

               await followingUser.updateOne({$pull:{followings:id}});

                res.status(200).json("User Unfollowed !");
            }
            else{
                res.status(403).json("User is Already Unfollowed By You !!")
            }
            
        } catch (error) {
            res.status(500).json({
                message:error.message
            })
        }
    }

}