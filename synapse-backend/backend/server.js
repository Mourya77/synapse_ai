import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { formatContent } from "./ai/formatter.js"
import { connectDB } from "./db/connect.js"
import Page from "./models/Page.js"

const app = express()
app.use(cors())
app.use(bodyParser.json())

connectDB()

app.post("/api/pages/save", async (req, res) => {
  try {
    const { title, url, content } = req.body
    console.log("✅ Data received:", { title, url, content })

    if (!content) return res.status(400).json({ error: "No content received" })

    const formatted = await formatContent(content)

    const page = new Page({
        title,
        url,
        formatted, // just use it directly
    })

    await page.save()

    res.json({ message: "Data saved successfully", page })
  } catch (err) {
    console.error("❌ Server error:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.get("/api/pages", async (req, res) => {
  const pages = await Page.find().sort({ createdAt: -1 })
  res.json(pages)
})

app.get("/api/pages", async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages); // return JSON array
  } catch (err) {
    console.error("❌ Error fetching pages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(5000, () => console.log("🚀 Server running on port 5000"))
