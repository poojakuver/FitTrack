import mongoose, { connect, model } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/gym");

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

const WorkoutSchema = new mongoose.Schema({
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        caloriesBurned: { type: Number, required: true },
        done: {type: Boolean, default: false}
});

const DietSchema = new mongoose.Schema({
        type: { type: String, enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'], required: true },
        description: { type: String, required: true },
        calories: { type: Number, required: true },
        done: {type: Boolean, default: false}  
});

const WorkoutPlanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    level: { type: String, required: true },
    goal: { type: String, required: true },
    type: { type: String, required: true },
    workout: [WorkoutSchema],
    diet: [DietSchema]
});

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: String, // Store the formatted date as a string
        default: () => {
            const date = new Date();
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return date.toLocaleDateString('en-US', options).replace(',', '');
        }
    }
});


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    currentActivity: WorkoutPlanSchema,
});

export const Admin = mongoose.model("Admin", AdminSchema);
export const WorkoutPlan = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
export const Blog = mongoose.model("Blog", BlogSchema);
export const User = mongoose.model("User", UserSchema);