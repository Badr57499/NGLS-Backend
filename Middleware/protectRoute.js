const express = require('express')
const jwt = require('jsonwebtoken')
const protect = (req, res, next) => {
        const authHeader = req.headers['authorization']
        if(!authHeader){
            return res.status(400).json({message:'No authorization header found'})
        }
        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'unAuthorized' })
        }
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'unAuthorized' })
            }
            req.user = decoded
            next()
        })
    }
    
    const authorize = (...roles) => {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(401).json({ message: 'unAuthorized' })
            }
            next()
        }
    }
    
    module.exports = { protect, authorize }
