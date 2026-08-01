const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/users')
require('dotenv').config()

const loginController = async (req , res) => {
      if(!req?.body?.username ||  !req?.body?.password){
        return res.status(400).json({message : 'Username or password is required'})
    }
    const {username , password} = req.body;
    const found = await User.findOne({username})
    if(!found){
        return res.status(400).json({message:'no user was found'})
    }
    const match = await bcrypt.compare(password , found.password)
    if(!match){
        return res.status(400).json({message : 'password doesnt  match'})

    }
    const token = jwt.sign(
        {username : found.username , role : found.role , id : found._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : '2h'}
    )
    return res.status(200).json({
        success : true,
        token : token,
        messsage : 'user logged in successfully',
        user : {username : found.username , role : found.role , id : found._id}
    })
     
}
module.exports = loginController;