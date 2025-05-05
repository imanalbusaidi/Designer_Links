import mongoose from "mongoose";

const DesignerRequestSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  portfolio: { type: String },
  date: { type: Date, default: Date.now },
});

const DesignerRequestModel = mongoose.model("designerRequests", DesignerRequestSchema);

export default DesignerRequestModel;
