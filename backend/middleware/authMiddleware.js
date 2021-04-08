import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

const protect = asyncHandler( async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decode.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error ("Not authorised, token failed")
        }
    }
    if(!token){
        console.log('Not Authorised,Token not found')
            res.status(401)
            throw new Error ("Not authorised, no token")
    }
})

const admin = (req,res,next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error("Not authorised as an admin")
    }
}

export{protect,admin}