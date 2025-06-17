import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    //send by ai
    question: String,
    options: Array,
    answer: String,
    // send after
    usersAnswer: String,
    //send by 
    userId: String,
    testName: {
        type: String,
        unique: true
    },
    time: Number
})

const Questions = mongoose.model('questions',questionSchema)

export default Questions