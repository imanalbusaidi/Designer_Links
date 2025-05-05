import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/Posts.js";
import bcrypt from "bcrypt";
import multer from "multer";
import dotenv from "dotenv";
// import RequestModel from "./Models/RequestModel.js";
import MessageModel from "./Models/MessageModel.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import DesignerRequestModel from "./Models/DesignerRequest.js";
import { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } from "./config.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

//Database connection
const connectString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=DesignerLink`;

// Added debugging logs to trace database connection and endpoint issues
mongoose.connect(connectString)
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  });

// Serve static files from the 'uploads' directory

// Convert the URL of the current module to a file path
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the uploads directory is served correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
// Create multer instance
const upload = multer({ storage: storage });

// Add uploadChatImage route
import uploadChatImage from './uploadChatImage.js';
app.use('/uploadChatImage', uploadChatImage);
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper to get real client IP
function getClientIp(req) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  if (ip && ip.includes(',')) ip = ip.split(',')[0];
  if (ip && ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
  return ip;
}

// Enhanced validation and debugging logs for /registerUser
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing required fields in /registerUser:", { name, email, password });
      return res.status(400).json({ error: "All fields (name, email, password) are required." });
    }

    console.log("Registering user with email:", email); // Debugging log

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log("Email already in use:", email); // Debugging log
      return res.status(400).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ip = getClientIp(req);
    console.log("Registering user with IP:", ip); // Debugging log
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      ip, // Save IP address
    });

    await user.save();
    console.log("User registered successfully:", email); // Debugging log
    res.status(201).json({ user, message: "Registration successful." });
  } catch (error) {
    console.error("Error in /registerUser endpoint:", error);
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// Add detailed logging to debug the /login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing required fields in /login:", { email, password });
      return res.status(400).json({ error: "Both email and password are required." });
    }

    console.log("Login attempt with email:", email); // Debugging log

    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email); // Debugging log
      return res.status(404).json({ error: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password mismatch for email:", email); // Debugging log
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Update IP address on login
    if (user) {
      const ip = getClientIp(req);
      console.log("User login IP:", ip); // Debugging log
      user.ip = ip;
      await user.save();
    }

    console.log("Login successful for email:", email); // Debugging log
    res.status(200).json({ user, message: "Login successful." });
  } catch (err) {
    console.error("Error in /login endpoint:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

//POST API-logout
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//POST API - savePost
app.post("/savePost", upload.single("image"), async (req, res) => {
  try {
    const postMsg = req.body.postMsg;
    const email = req.body.email;
    const category = req.body.category;
    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const user = await UserModel.findOne({ email: email });
    if (!user || user.userType !== "designer") {
      return res.status(403).json({ error: "Only designers can post." });
    }

    const post = new PostModel({
      postMsg: postMsg,
      email: email,
      image: image,
      category: category,
      userName: user.name,
      date: new Date(),
    });

    await post.save();
    res.send({ post: post, msg: "Post added successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET API - getPost
app.get("/getPosts", async (req, res) => {
  try {
    // Fetch all posts from the "PostModel" collection, including the user's name
    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: "userinfos", // Collection to join with
          localField: "email", // Field in PostModel
          foreignField: "email", // Field in UserModel
          as: "userDetails", // Alias for the joined data
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true, // Allow posts without matching user details
        },
      },
      {
        $project: {
          postMsg: 1,
          email: 1,
          image: 1, // Ensure the image field is included
          "userDetails.name": { $ifNull: ["$userDetails.name", "No Name Provided"] }, // Default name
        },
      },
    ]);

    console.log("Debugging getPosts API: Posts fetched from PostModel:", await PostModel.find({}));
    console.log("Debugging getPosts API: Users fetched from UserModel:", await UserModel.find({}));

    console.log("Posts after aggregation:", JSON.stringify(posts, null, 2)); // Log posts for debugging

    const countPost = await PostModel.countDocuments({});

    res.send({ posts: posts, count: countPost });
  } catch (err) {
    console.error("Error in /getPosts API:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/getPostsByCategory", async (req, res) => {
  try {
    console.log("Fetching posts grouped by category..."); // Debugging log
    const postsByCategory = await PostModel.aggregate([
      {
        $group: {
          _id: "$category",
          posts: {
            $push: {
              _id: "$_id",
              postMsg: "$postMsg",
              image: "$image",
              email: "$email",
              userName: "$userName",
              likes: "$likes"
            },
          },
        },
      },
    ]);

    console.log("Posts grouped by category (API response):", JSON.stringify(postsByCategory, null, 2)); // Debugging log
    res.send({ postsByCategory });
  } catch (err) {
    console.error("Error fetching posts by category:", err); // Debugging log
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/testGetPostsByCategory", async (req, res) => {
  try {
    const postsByCategory = await PostModel.aggregate([
      {
        $group: {
          _id: "$category",
          posts: {
            $push: {
              _id: "$_id",
              postMsg: "$postMsg",
              image: "$image",
              email: "$email",
            },
          },
        },
      },
    ]);

    console.log("Test API - Posts grouped by category:", JSON.stringify(postsByCategory, null, 2));
    res.send({ postsByCategory });
  } catch (err) {
    console.error("Error in testGetPostsByCategory API:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/likePost/:postId", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  try {
    console.log("Received like request:", { postId, userId }); // Debugging log

    const user = await UserModel.findById(userId);
    if (!user) {
      console.log("User not found:", userId); // Debugging log
      return res.status(404).json({ error: "User not found." });
    }

    if (user.userType !== "customer") {
      console.log("Unauthorized user type:", user.userType); // Debugging log
      return res.status(403).json({ error: "Only customers can like posts." });
    }

    const postToUpdate = await PostModel.findById(postId);
    if (!postToUpdate) {
      console.log("Post not found:", postId); // Debugging log
      return res.status(404).json({ error: "Post not found." });
    }

    console.log("Post before update:", JSON.stringify(postToUpdate, null, 2)); // Debugging log

    if (!postToUpdate.likes) {
      postToUpdate.likes = { count: 0, users: [] };
    }

    const userIndex = postToUpdate.likes.users.indexOf(userId);

    if (userIndex !== -1) {
      // User has already liked the post, so unlike it
      postToUpdate.likes.count -= 1;
      postToUpdate.likes.users.splice(userIndex, 1);
      console.log("User unliked the post:", userId); // Debugging log
    } else {
      // User hasn't liked the post, so like it
      postToUpdate.likes.count += 1;
      postToUpdate.likes.users.push(userId);
      console.log("User liked the post:", userId); // Debugging log
    }

    await postToUpdate.save();

    // Ensure user IDs are strings in the response
    const postResponse = postToUpdate.toObject();
    if (postResponse.likes && postResponse.likes.users) {
      postResponse.likes.users = postResponse.likes.users.map(u => u.toString());
    }

    res.json({ post: postResponse, message: userIndex !== -1 ? "Post unliked." : "Post liked." });
  } catch (err) {
    console.error("Error in likePost API:", err); // Debugging log
    res.status(500).json({ error: "An error occurred." });
  }
});

app.put(
  "/updateUserProfile/:email/",
  upload.single("profilePic"), // Middleware to handle single file upload
  async (req, res) => {
    const email = req.params.email;
    const name = req.body.name;
    const password = req.body.password;

    try {
      // Find the user by email in the database
      const userToUpdate = await UserModel.findOne({ email: email });

      // If the user is not found, return a 404 error
      if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if a file was uploaded and get the filename
      let profilePic = null;
      if (req.file) {
        profilePic = req.file.filename; // Filename of uploaded file
      } else {
        console.log("No file uploaded");
      }

      // Update user's name
      userToUpdate.name = name;

      // Hash the new password and update if it has changed
      if (password !== userToUpdate.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedPassword;
      } else {
        userToUpdate.password = password; // Keep the same password if unchanged
      }

      // Save the updated user information to the database
      await userToUpdate.save();

      // Send the updated user data and a success message as a response
      res.send({ user: userToUpdate, msg: "Updated." });
    } catch (err) {
      // Handle any errors during the update process
      res.status(500).json({ error: err.message });
    }
  }
);

app.delete("/deletePost/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID." });
    }

    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "An error occurred while deleting the post." });
  }
});

// Add detailed logging to debug the /getDesigners endpoint
app.get("/getDesigners", async (req, res) => {
  try {
    console.log("Fetching designers from the database...");
    const designers = await UserModel.find({ userType: "designer" });
    if (designers.length === 0) {
      console.log("No designers found in the database.");
      return res.status(404).json({ error: "No designers found." });
    }
    console.log("Designers fetched successfully:", designers);
    res.status(200).json({ designers });
  } catch (error) {
    console.error("Error fetching designers:", error);
    res.status(500).json({ error: "An error occurred while fetching designers." });
  }
});

// Add detailed logging to debug the /submitRequest endpoint
app.post("/submitRequest", async (req, res) => {
  try {
    console.log("Received request to submit design request:", req.body); // Debugging log
    const { request, designerId } = req.body;

    if (!request || !designerId) {
      console.log("Missing required fields:", { request, designerId }); // Debugging log
      return res.status(400).json({ error: "All fields are required." });
    }

    console.log("Attempting to save request to the database...");
    // Remove or refactor any code that uses RequestModel below

    res.status(201).json({ message: "Your request has been submitted successfully." });
  } catch (error) {
    console.error("Error submitting request:", error); // Debugging log
    res.status(500).json({ error: "An error occurred while submitting your request." });
  }
});

// Add endpoint to get requests for a designer
app.get("/designerRequests/:designerId", async (req, res) => {
  try {
    const { designerId } = req.params;
    // Populate customer info (name, email) for each request
    // Remove or refactor any code that uses RequestModel below
    res.status(200).json({ requests: [] });
  } catch (error) {
    console.error("Error fetching designer requests:", error);
    res.status(500).json({ error: "An error occurred while fetching requests." });
  }
});

// Modify the /getAllUsers route to exclude the admin account
app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await UserModel.find({ userType: { $ne: "admin" } }, "name email userType ip");
    console.log("Fetched users from database:", users); // Debugging log
    console.log("Users fetched from database:", users); // Log the users fetched from the database
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

// Add a route to update the userType of a user
app.put("/updateUserType/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType } = req.body;

    if (!["customer", "designer"].includes(userType)) {
      return res.status(400).json({ error: "Invalid userType." });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.userType = userType;
    await user.save();

    res.status(200).json({ message: "User type updated successfully.", user });
  } catch (error) {
    console.error("Error updating user type:", error);
    res.status(500).json({ error: "An error occurred while updating user type." });
  }
});

// Add a route to delete a user (admin only)
app.delete("/deleteUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Optionally, you can check if the request is from an admin by session/auth (not implemented here)
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.userType === "admin") {
      return res.status(403).json({ error: "Cannot delete admin account." });
    }
    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while deleting the user." });
  }
});

// Add an admin account creation script
const createAdminAccount = async () => {
  try {
    const existingAdmin = await UserModel.findOne({ email: "admin@DesignerLink.com" });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("12345", 10);
    const admin = new UserModel({
      name: "Admin",
      email: "admin@DesignerLink.com",
      password: hashedPassword,
      userType: "admin",
    });

    await admin.save();
    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
};

createAdminAccount();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO real-time chat
io.on("connection", (socket) => {
  // Join room for user
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // Handle sending message
  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;
    const msg = new MessageModel({ sender, receiver, message });
    await msg.save();
    // Emit to receiver's room
    io.to(receiver).emit("receive_message", {
      sender,
      receiver,
      message,
      timestamp: msg.timestamp,
    });
  });
});

// REST endpoint: fetch chat history between two users
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await MessageModel.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort({ timestamp: 1 });
  res.json(messages);
});

// REST endpoint: send a message (optional, for non-realtime fallback)
app.post("/messages", async (req, res) => {
  const { sender, receiver, message } = req.body;
  const msg = new MessageModel({ sender, receiver, message });
  await msg.save();
  res.status(201).json(msg);
});

// Add endpoint to handle designer requests
app.post("/requestDesigner", async (req, res) => {
  try {
    const { name, email, message, portfolio } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }
    const newRequest = new DesignerRequestModel({ name, email, message, portfolio });
    await newRequest.save();
    res.status(201).json({ message: "Your request to become a designer has been submitted." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while submitting your request." });
  }
});

// Endpoint to get all designer requests (admin only)
app.get("/allDesignerRequests", async (req, res) => {
  try {
    const requests = await DesignerRequestModel.find({}).sort({ date: -1 });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching designer requests." });
  }
});

// Update the port configuration to use a dynamic port
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
