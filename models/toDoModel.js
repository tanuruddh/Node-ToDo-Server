import mongoose from "mongoose";
import { addHours } from 'date-fns'

function currentDate() {
    const currentDate = new Date().toISOString();
    return addHours(currentDate, 5.5);
}

const toDoSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: [true, 'A review must have a review']
        },
        description: {
            type: String,
            min: 1,
            max: 5,
            required: [true, 'A review must have a rating']
        },
        createdAt: {
            type: Date,
            default: currentDate(),
        },
        user:
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A review must have a user']
        },
        state: {
            type: Boolean,
            default: true,
        }

    }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const ToDo = mongoose.model('ToDo', toDoSchema);
export default ToDo;