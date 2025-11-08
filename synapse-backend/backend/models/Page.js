import mongoose from "mongoose"

const PageSchema = new mongoose.Schema({
  title: String,
  url: String,
  formatted: Object, // store the AI formatted JSON
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Page", PageSchema)
