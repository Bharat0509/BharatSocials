import PostModel from "../Models/postModels.js";
import mongoose from 'mongoose'
import UserModel from '../Models/userModels.js'


//Create a Post

export const createPost=async (req,res)=>{
    const newPost=new PostModel(req.body);
try {
    const post=await newPost.save();
    res.status(200).json(post);
} catch (error) {
    res.status(500).json({
        message:error.message
    })
}
}

//get posts
export const getPost =async (req,res)=>{
    const id=req.params.id;

    try {
        const post=await PostModel.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
}

// posts
export const getPosts=async (req,res)=>{

    const id=req.params.id;
    try {
        const posts=await PostModel.find({userId:id});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }

}
//edit post
export const updatePost =async (req,res)=>{
    const postId=req.params.id;
    const {userId}=req.body;

    try {
        const post=await PostModel.findById(postId);
        if(post.userId===userId){
            const post=await post.updateOne({$set:req.body});
            res.status(200).json({post});
        }
        else{
            res.status(403).json("Action Forbidden !!")
        }
    } catch (error) {
        res.status(500).json(error);
    }

     
}


//delete posts

export const deletePost =async (req,res)=>{
    const postId=req.params.id;
    const {userId}=req.body;

    try {
        const post=await PostModel.findById(postId);
        if(post.userId===userId){
            await post.deleteOne();
            res.status(200).json("Post Deleted Successfully !!")
        }
        else{
            res.status(403).json("Action Forbidden !!")
        }
    } catch (error) {
        res.status(500).json(error);
    }
}


export const likePost=async (req,res)=>{
    const postId=req.params.id;
    const {userId}=req.body;
    console.log(postId,userId);
    if(!userId) res.status(500).json("Something Went Wrong !")
    try {
        const post=await PostModel.findById(postId);
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{likes:userId}});
            res.status(200).json("Post Liked !!"); 
        } else{
            res.status(403).json("Action Forbidden !!")
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
}

export const dislikePost=async (req,res)=>{
    const postId=req.params.id;
    const {userId}=req.body;
    try {
        const post=await PostModel.findById(postId);
        if(post.likes.includes(userId)){
            await post.updateOne({$pull:{likes:userId}});
            res.status(200).json("Post DisLiked !!"); 
        } else{
            res.status(403).json("Action Forbidden !!")
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
}




//Get TimeLinePosts

export const getTimeLinePosts=async (req,res)=>{
    const userId=req.params.id;

    try {
        const currentUserPosts=await PostModel.find({userId:userId});
        const followingPosts=await UserModel.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(userId)
                },
            },
            {   
                $lookup:{
                    from :"posts",
                    localField:'followings',
                    foreignField:"userId",
                    as:"followingPosts"

                }
                
            },{
                $project:{
                    followingPosts:1,
                    _id:0
                }
            }
        ])
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort(
            (a,b)=>{
                return b.createdAt-a.createAt;
            }
        ).reverse());
        
    } catch (error) {
        res.status(500).json(error);
    }
}