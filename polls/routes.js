const express = require("express");
const router = express.Router();
const services = require("./services");
const postSchema = require("./schemas");
const voteSchema = require("./schemas");
// const ObjectId = require("mongodb").ObjectId;
// const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});

//#1Implementar um endpoint que permita obter os detalhes de uma poll (por ID).
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

//#v1- 2Implementar um endpoint que permita criar uma poll. Uma poll é constituida por uma pergunta e uma lista de opções.
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

//teste- Implementar um endpoint que permita criar uma poll. Uma poll é constituida por uma pergunta e uma lista de opções.
router.post("/", async (req, res) => {
  const { question, options } = req.body;

  // usar array.map para transformar array req.body.options
  try {
    const pollsQuestions = [
      {
        question: "que ano é?",
        options: [
          { name: "2000", votes: 0 },
          { name: "2002", votes: 0 },
        ],
      },
      {
        question: "como estás?",
        options: [
          { name: "bem", votes: 0 },
          { name: "mal", votes: 0 },
        ],
      },
    ];
    await services.createPolls(pollsQuestions); //req.body
    res.status(200).json({ message: "Polls created" });
  } catch (error) {
    res.status(404).json({ error: "Polls not created" });
  }
});

//#3Implementar um endpoint que permita votar numa opção de uma poll.
router.post("/:id/vote", async (req, res) => {
  try {
    const pollId = req.params.id;
    const option = req.body.option;
    await services.votePoll(pollId, option);
    res.status(200).json({ message: "Option voted" });
  } catch (error) {
    res.status(500).json({ error: "failed to vote" });
  }
});

//delete
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

module.exports = router;
