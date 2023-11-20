const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    campusID: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema({
  campusID: {
    type: String,
    required: true,
  },
});

const viewsSchema = new mongoose.Schema({
  campusID: {
    type: String,
    required: true,
  },
});

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainPhoto: {
      type: String,
      required: true,
    },
    secPhoto: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    searchTerms: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    fixer: {
      type: String,
    },
    location: {
      type: String,
      default: "campus",
    },
    resolved: {
      type: String,
      default: "no",
    },

    comments: [commentSchema],
    likes: [likeSchema],
    views: [viewsSchema],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
