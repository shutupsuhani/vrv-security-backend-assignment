const express_validator=require('express-validator')

const registerUser=async(req,res)=>{
    try{

    }catch(err){
        return res.status(400).json({
            success:false,
            msg:err.message
        })
    }
}

module.exports={
    registerUser
}