import mongoose from "mongoose";
const schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true, validate: Number.isInteger },
  comment: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });
schema.index({ product: 1, user: 1 }, { unique: true });
export default mongoose.models.Review || mongoose.model("Review", schema);
