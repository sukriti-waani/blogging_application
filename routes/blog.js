const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

// Show form to add new blog
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// Display single blog with comments
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // ✅ Fetch comments and populate user info
    const comments = await Comment.find({ blogId: req.params.id })
      .populate("createdBy")
      .sort({ createdAt: -1 });

    console.log("Comments fetched:", comments);

    return res.render("blog", {
      blog,
      comments,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// Add comment to a blog
router.post("/:blogId/comment", async (req, res) => {
  try {
    console.log("Incoming comment:", req.body.content);
    console.log("User info:", req.user);

    // ✅ Prevent empty comment
    if (!req.body.content || req.body.content.trim() === "") {
      return res.redirect(`/blog/${req.params.blogId}`);
    }

    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user ? req.user._id : null, // ✅ Allows anonymous if no user
    });

    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Create new blog
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      title,
      body,
      coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
      createdBy: req.user ? req.user._id : null,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
