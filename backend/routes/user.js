import express from "express";
import jwt from "jsonwebtoken";
import { Blog, User, WorkoutPlan } from "../db/mongoose.js";
import { verifyUser } from "../middleware/userAuthMiddleware.js";

const user = express.Router();

const JWT_SECRET = "aldkfj34e4wefkj";

user.get("/", (req, res) => {
    return res.json({
        message: "This is user route"
    })
})


user.post("/signup", async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const user = await User.create({
            email,
            name,
            password
        });      

        // logic for creating jwt token
        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: false }, // Payload
            JWT_SECRET);

        return res.status(200).json({
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "An error occurred while signup"
        });
    }
});

user.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});  

        if( !user || password !== user.password ) {
            return res.status(401).json({
                error: "Incorrect username or password"
            });
        }

        // logic for creating jwt token
        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: false }, // Payload
            JWT_SECRET);

        return res.status(200).json({
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "An error occurred while signin" + error
        });
    }
});

user.get("/workouts", verifyUser, async (req, res) => {
    try {
        const result = await WorkoutPlan.find({});

        return res.status(200).json({
            plans: result
        });
    }
    catch(error) {
        return res.status(500).json({
            error: "An error occurred while fetching the workouts" 
        })
    }
});

user.post("/subscribe/:id", verifyUser, async (req, res) => {
    const workoutPlanId = req.params.id;
    const userId = req.user.id;

    try {
        const plan = await WorkoutPlan.findById({_id: workoutPlanId});
        await User.findOneAndUpdate({_id: userId}, {currentActivity: plan});

        return res.status(200).json({
            message: "Workoutplan updated successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            error: "An error occurred while subscribing the workout" 
        });
    }
});

user.get("/current-activity", verifyUser, async (req, res) => {
    const userId = req.user.id;
    try {
        const currentActivity = await User.findOne({_id: userId}, {currentActivity: 1});

        res.status(200).json({
            currentActivity
        });
    }
    catch(error) {
        return res.status(500).json({
            error: "An error occurred while fetching current activity "+ error
        });
    }
});

user.patch("/update-status", verifyUser, async (req, res) => {
    const userId = req.user.id; // Retrieve the user ID from the token
    const { workoutIds, dietIds } = req.body; // IDs of items to mark as done
    console.log("Workout: ", workoutIds);
    console.log("Diet: ", dietIds);
    
    try {
        // Fetch the user
        const user = await User.findById({_id: userId});
        
        if (!user || !user.currentActivity) {
            return res.status(404).json({ error: "Current activity not found" });
        }

        // Update the `done` status in workouts
        if (workoutIds) {
            workoutIds.forEach(({ id, done }) => {
                const workout = user.currentActivity.workout.find(w => w._id.toString() === id);
                if (workout) {
                    workout.done = done; // Directly update with the provided state
                }
            });
        }
        
        // Update the `done` status in diets
        if (dietIds) {
            dietIds.forEach(({ id, done }) => {
                const diet = user.currentActivity.diet.find(d => d._id.toString() === id);
                if (diet) {
                    diet.done = done; // Directly update with the provided state
                }
            });
        }
        
        // Save the updated user
        const result = await user.save();
        
        return res.status(200).json({
            message: "Status updated successfully",
            currentActivity: user.currentActivity,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "An error occurred while updating the status",
        });
    }
});


user.get("/blogs", verifyUser, async (req, res) => {
    try {
        const blogs = await Blog.find({});

        return res.status(200).json({
            blogs
        })
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while fetching the blogs",
        });
    }
});

user.get("/blog/:id", verifyUser,async (req, res) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findById({_id: blogId});

        return res.status(200).json({
            blog
        });

    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while fetching blog",
        });
    }
});

export default user;