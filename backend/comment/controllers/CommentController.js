
const {CommentService} = require("../../services");

module.exports = {
  create: async (req, res) => {
    try {
      const comment = await CommentService.createComment(req.body);
      res.status(201).send({ message: "Comment created", comment });
    } catch (error) {
      console.log(error);
    }
  },

 getById: async (req, res) => {
  try {
    const comment = await CommentService.getCommentById(req.params.id);
    res.status(200).send(comment);
  } catch (error) {
    console.log(error);
  }
  },
};
