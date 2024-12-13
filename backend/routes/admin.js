import express from "express";
import jwt from "jsonwebtoken";
import { Admin, Blog, WorkoutPlan, User } from "../db/mongoose.js";
import { verifyAdmin } from "../middleware/adminAuthMiddleware.js";

const admin = express.Router();

    const JWT_SECRET = "aldkfj34e4wefkj";

admin.get("/", verifyAdmin, (req, res) => {
    return res.json({
        message: "This is admin route"
    });
});

admin.post("/signin", async (req, res) => { 
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({email});

        if( !admin || password !== admin.password ) {
            return res.status(401).json({
                error: "Incorrect username or password"
            });
        }

        // logic for creating jwt token
        const token = jwt.sign(
            { id: admin._id, email: admin.email, isAdmin: true }, // Payload
            JWT_SECRET);

        return res.status(200).json({
            token
        });

    }
    catch (error) {
        return res.status(500).json({
            error: "An error occurred while signing in"
        });
    }
});

admin.post("/addworkout", verifyAdmin, async (req, res) => {

    const { title, level, goal, type, workout, diet } = req.body;

    console.log(title, level, goal, type, workout, diet);

    try {
        // Validate the request body
        if (!title || !level || !goal || !type || !workout || !diet) {
            return res.status(400).json({
                error: "All fields are required. Please provide complete workout and diet details.",
            });
        }

        const result = await WorkoutPlan.create({
            title,
            level,
            goal,
            type,
            workout,
            diet,
        });

        console.log(result);

        return res.status(200).json({
            message: "Workout plan addedd successfully!"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "An error occurred while adding new workout plan"
        });
    }
});

admin.post("/blog", verifyAdmin, async (req, res) => {
    const {title, content} = req.body;

    try {
        await Blog.create({
            title,
            content
        });

        return res.status(200).json({
            message: "Blog created successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            error: "An error occurred while adding new blog " + error
        });
    }
});

admin.get("/workouts", verifyAdmin, async (req, res) => {
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

admin.get("/blogs", verifyAdmin, async (req, res) => {
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

admin.get("/blog/:id", verifyAdmin, async (req, res) => {
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

admin.delete("/blog/:id", verifyAdmin, async (req, res) => {
    const blogId = req.params.id;

    try {
        const result = await Blog.deleteOne({_id: blogId});

        return res.status(200).json({
            message: "Blog deleted successfully!"
        })
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while deleting the blog",
        });
    }
});

admin.get("/users", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({}, { email: 1, name: 1, _id: 1 }); // Projection: email, name, _id
        return res.status(200).json({
            users,
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while fetching users",
        });
    }
});

admin.get("/user/:id", verifyAdmin, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId, { name: 1, email: 1, currentActivity: 1 }); // Projection
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({
            user,
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while fetching the user",
        });
    }
});

admin.delete("/user/:id", verifyAdmin, async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await User.deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while deleting the user",
        });
    }
});


export default admin;