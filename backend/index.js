import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import admin from "./routes/admin.js";
import user from "./routes/user.js";

const PORT = 3000;

const app = express();

app.use(cors({}));
app.use(bodyParser.json());
app.use("/admin", admin);
app.use("/user", user);

app.get("/", (req, res) => {
    return res.json({
        message: "Server is up and running fine"
    });
});

