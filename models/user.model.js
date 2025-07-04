import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    password: String,
    email: {
        type: String,
        unique: true,
        required: true,
        validate: /^\S+@\S+\.\S+$/
    },
    question: [{
        type: mongoose.Types.ObjectId,
        ref: 'questions'
    }]
})

userSchema.pre('save', function(){
    this.password = bcrypt.hashSync(this.password, 12)
})

const Users = mongoose.model('users', userSchema)

export default Users