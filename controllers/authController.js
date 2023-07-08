const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required'
            })
        }
        const userDetails = await User.findOne({ email })
        if (userDetails) {
            return res.status(403).json({
                success: false,
                message: 'User already exists ! Login to enter'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(200).json({
            success: true,
            message: 'User has been registered successfully'
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error while registering User',
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const userDetails = await User.findOne({ email });
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found ! Register to enter'
            })
        }
        const hashedPassword = userDetails.password
        if (await bcrypt.compare(password, hashedPassword)) {
            const payload = {
                email: userDetails.email,
                id: userDetails._id,
                role: userDetails.role
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })
            userDetails.token = token
            userDetails.password = undefined
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite:'none',
                domain: 'localhost'
            }
            return res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                userDetails,
                message: 'User logged in successfully'
            })
        }
        return res.status(401).json({
            success : false,
            message : 'Password is incorrect'
        })
    }
    catch (error) {
        return res.status(500).json({
            success : false,
            message : 'Error while logging in the user',
            error : error.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
      // Clear the token cookie by setting its expiration to a past date
      res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true,
        sameSite: 'none',
        domain: 'localhost'
      });
  
      return res.status(200).json({
        success: true,
        message: 'User logged out successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error while logging out the user',
        error: error.message
      });
    }
  };
  