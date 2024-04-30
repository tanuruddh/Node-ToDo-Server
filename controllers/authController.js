import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsnyc.js"
import jwt from 'jsonwebtoken';
import { promisify } from 'util';


// function for sign the token for the user
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIREs_IN })
}
// function for create and sending the token as response
const createSendToken = (user, statusCode, res) => {

    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIREs_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}
// functionfor signup
const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: Date.now(),
    });

    createSendToken(newUser, 201, res);
});

// login function
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or pasword', 401));
    }

    createSendToken(user, 200, res);

})

// portection middleware for protecting routes from unauthorized users
const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of its there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('Your are not logged in! ,please log in to get access ', 401));
    }

    // 2) Verification token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3)Check if user still exist
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        next(new AppError('The user belonging to this token does no longer exists.', 401));
    }

    req.user = currentUser;

    next();
})


export default {
    login,
    signup,
    protect,
}