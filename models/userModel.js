import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a user must have a name']
    },
    email: {
        type: String,
        required: [true, 'a user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'a user must have a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'a user must have a confirm password'],
        validate: {
            validator: function (ele) {
                return ele === this.password
            },
            message: 'Passwords are not same'
        }

    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12)

    this.confirmPassword = undefined;
    next();

})


userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


const User = mongoose.model('User', userSchema);

export default User;