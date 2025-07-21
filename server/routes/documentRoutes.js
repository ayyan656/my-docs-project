const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const sendShareEmail = require("../utils/mailer");

// 👉 Create a new document
router.post("/", async (req, res) => {
  const { title } = req.body;

  try {
    const doc = await Document.create({
      title: title || "Untitled Document",
      content: "",
      owner: req.user._id,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error creating document", error: err.message });
  }
});

// 👉 Get all documents (owned or shared)
router.get("/", async (req, res) => {
  try {
    const docs = await Document.find({
      $or: [
        { owner: req.user._id },
        { collaborators: req.user._id }
      ]
    }).sort({ updatedAt: -1 });

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err.message });
  }
});

// 👉 Get a single document (access check)
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const isOwner = doc.owner.toString() === req.user._id.toString();
    const isCollaborator = doc.collaborators.includes(req.user._id);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "You don't have access to this document" });
    }

    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Failed to load document", error: err.message });
  }
});

// 👉 Update a document (title or content)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { content, title } = req.body;

    // Validate document ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const userId = mongoose.Types.ObjectId(req.user._id);

    const isOwner = doc.owner.equals(userId);
    const isCollaborator = doc.collaborators.some(collabId =>
      collabId.equals(userId)
    );

    if (!isOwner && !isCollaborator) {
      return res
        .status(403)
        .json({ message: "You don't have permission to edit this document" });
    }

    if (typeof title !== "undefined") {
      doc.title = title;
    }

    if (typeof content !== "undefined") {
      doc.content = content;
    }

    doc.updatedAt = new Date();
    await doc.save();

    res.status(200).json(doc);
  } catch (err) {
    console.error("❌ Error updating document:", err);
    res
      .status(500)
      .json({ message: "Failed to update document", error: err.message });
  }
});

// 👉 Share document with another user (add collaborator)
router.post("/:id/share", async (req, res) => {
  const { email } = req.body;
  const documentId = req.params.id;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!doc.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the owner can share this document" });
    }

    if (!doc.collaborators.includes(user._id)) {
      doc.collaborators.push(user._id);
      await doc.save();
    }

    res.json({ message: "User added as collaborator" });
  } catch (err) {
    res.status(500).json({ message: "Share failed", error: err.message });
  }
});

// 👉 Send document link via email (using nodemailer)
router.post("/:id/share-email", async (req, res) => {
  const { email } = req.body;
  const documentId = req.params.id;

  try {
    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    await sendShareEmail(email, documentId);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
});

// 👉 Delete a document (only owner can delete)
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!doc.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "You are not authorized to delete this document" });
    }

    await doc.deleteOne();
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete document:", err.message);
    res.status(500).json({ message: "Failed to delete document", error: err.message });
  }
});

module.exports = router;
