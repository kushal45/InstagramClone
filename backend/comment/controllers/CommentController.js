
const CommentService = require("../services/CommentService");

module.exports = {
  create: async (req, res) => {
    try {
      console.log("req body comment",req.body);
      const comment = await CommentService.createComment({...req.body,userId:req.userId});
      res.status(201).send({ message: "Comment created", comment });
    } catch (error) {
        throw error;
    }
  },

 getById: async (req, res) => {
  try {
    const comment = await CommentService.getCommentById(req.params.id);
    res.status(200).send(comment);
  } catch (error) {
    throw error;
  }
  },
};
