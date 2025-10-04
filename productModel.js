import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    price: Number,
    description: String,
    image: { type: String }, // 🖼️ new field
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
