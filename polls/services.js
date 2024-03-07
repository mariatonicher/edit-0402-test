db = require("../db/mongodb");

//task-1
async function getPollById(pollId) {
  try {
    return await db
      .getDB()
      .collection(db.pollsCollection)
      .findOne({ _id: db.toMongoID(pollId) });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getAllPolls() {
  try {
    return await db.getDB().collection(db.pollsCollection).find({}).toArray();
  } catch (error) {
    console.log(error);
    return [];
  }
}

//pré task-1
async function createdPoll(poll) {
  try {
    await db.getDB().collection(db.pollsCollection).insertOne({
      question: poll.question,
      options: poll.options,
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

//task-2
async function createPolls(polls) {
  try {
    await db.getDB().collection(db.pollsCollection).insertMany(polls);
    return polls;
  } catch (error) {
    console.log(error);
    return [];
  }
}

//task-3
async function votePoll(pollId, options) {
  try {
    const updateResult = await db
      .getDB()
      .collection(db.pollsCollection)
      .updateOne(
        {
          _id: ObjectId(pollId),
          options: ObjectId(options),
        },
        {
          $inc: {
            vote: 1,
          },
        }
      );
  } catch (error) {
    console.error(error);
    return [];
  }
}

//task-4

//delete
async function deletePollById(pollId) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .deleteOne({ _id: db.toMongoID(pollId) });

    return result.deletedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getPollById,
  getAllPolls,
  deletePollById,
  createdPoll,
  createPolls,
  votePoll,
};
