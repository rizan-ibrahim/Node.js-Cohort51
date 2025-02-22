import express from "express";
import path from "path";
import fs from "fs";

// Initialize the app
const app = express();

// Set blog directory and port
const blogsDir = path.join(__dirname, "blogs");
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Ensure the blogs directory exists
if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir, { recursive: true });
  console.log("Blogs directory created!");
} else {
  console.log("Blogs directory already exists.");
}

// Handle requests
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Submit a blog
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send({ message: "Title and content are required." });
  }

  const filePath = path.join(blogsDir, `${title}.txt`);

  try {
    fs.writeFileSync(filePath, content);
    res.status(200).send({ message: "Blog is submitted successfully." });
  } catch (err) {
    console.error("Error writing file:", err);
    res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }
});

// Update a blog
app.put("/blogs/:title", (req, res) => {
  const { content } = req.body;
  const title = req.params.title;

  if (!content) {
    return res.status(400).send({ message: "Content is required." });
  }

  const filePath = path.join(blogsDir, title);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: "Blog is not found." });
  }

  try {
    fs.writeFileSync(filePath, content);
    res.status(201).send({ message: "Blog is updated successfully" });
  } catch (err) {
    console.error("Error updating file:", err);
    res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }
});

// Delete a blog
app.delete("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const filePath = path.join(blogsDir, title);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: "Blog is not found." });
  }

  try {
    fs.unlinkSync(filePath);
    res.status(200).send({ message: "Blog is deleted successfully." });
  } catch (err) {
    console.error("Error deleting file:", err);
    res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }
});

// Read a blog
app.get("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const filePath = path.join(blogsDir, title);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: "Blog is not found." });
  }

  try {
    const blog = fs.readFileSync(filePath, "utf-8");
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(blog);
  } catch (err) {
    console.error("Error reading file:", err);
    res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }
});

// BONUS: Get all blogs
app.get("/blogs", (req, res) => {
  try {
    const blogs = fs.readdirSync(blogsDir);
    const blogTitles = blogs.map((blog) => ({ title: blog }));
    res.status(200).send(blogTitles);
  } catch (err) {
    console.error("Error reading directory:", err);
    res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
