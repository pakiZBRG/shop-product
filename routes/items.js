const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const checkAuth = require('../middleware/check-auth');

// Read
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items));
});

// Create - Private
router.post("/", checkAuth, (req, res) => {
  const newItem = new Item({
    name: req.body.name,
  });

  newItem.save().then((item) => res.json(item));
});

// Delete - Private
router.delete("/:id", checkAuth, (req, res) => {
  Item.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

// Update - Private
router.put("/edit/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  Item.findByIdAndUpdate({ _id: id }, { name: newData.name })
    .then((item) => res.status(200).json({ success: true }))
    .catch((err) => res.status(400).json({ success: false }));
});

module.exports = router;