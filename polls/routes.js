const express = require("express");
const router = express.Router();
const services = require("./services");
const postSchema = require("./schemas");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});

router.get("/:id", async (req, res) => {
  const pollId = req.params.id;
  const details = await services.getPollById(pollId);
  const { question, options } = req.body;
  if (details) {
    res.status(200).json(details);
  } else {
    res.status(404).json({ error: "Poll not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  const deleted = await services.deletePollById(pollId);
  if (!deleted) {
    return res.status(500).json({ error: "failed to delete poll" });
  }

  res.status(200).json({ message: "poll deleted successfully" });
});

router.post("/", async (req, res) => {
  const { error, value } = postSchema.createPollSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  try {
    await services.createdPoll(value);
    res.status(201).json({ message: "Polls collection created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
