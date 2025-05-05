import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "./UserModel.js";

const connectString =
  "mongodb+srv://DesignerLink:12345@designerlink.g6zl1qr.mongodb.net/DesignerLink?retryWrites=true&w=majority&appName=DesignerLink";

mongoose
  .connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const randomUsers = [
  { name: "Designer1", email: "designer1@DesignerLink.com", password: "12345" },
  { name: "Designer2", email: "designer2@DesignerLink.com", password: "12345" },
  { name: "Designer3", email: "designer3@DesignerLink.com", password: "12345" },
  { name: "Designer4", email: "designer4@DesignerLink.com", password: "12345" },
  { name: "Designer5", email: "designer5@DesignerLink.com", password: "12345" },
  { name: "Designer6", email: "designer6@DesignerLink.com", password: "12345" },
  { name: "Designer7", email: "designer7@DesignerLink.com", password: "12345" },
  { name: "Designer8", email: "designer8@DesignerLink.com", password: "12345" },
  { name: "Designer9", email: "designer9@DesignerLink.com", password: "12345" },
  { name: "Designer10", email: "designer10@DesignerLink.com", password: "12345" },
];

const addRandomDesigners = async () => {
  try {
    for (const user of randomUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        userType: "designer",
      });
    }
    console.log("10 random designer users added successfully.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error adding random designers:", error);
    mongoose.disconnect();
  }
};

addRandomDesigners();