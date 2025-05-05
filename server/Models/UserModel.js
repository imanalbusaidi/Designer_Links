import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["customer", "designer", "admin"],
    default: "customer",
  },
  ip: {
    type: String,
    default: null,
  },
});

const UserModel = mongoose.model("userInfos", UserSchema);

export default UserModel;
