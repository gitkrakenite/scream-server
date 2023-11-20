const Report = require("../models/reportModel");
const User = require("../models/userModel");

// create report
const createReport = async (req, res) => {
  const {
    title,
    description,
    mainPhoto,
    creator,
    category,
    secPhoto,
    fixer,
    location,
    searchTerms,
  } = req.body;

  if (!title || !mainPhoto || !creator || !description || !category) {
    res.status(404).send("Details missing");
    return;
  }

  try {
    const report = await Report.create({
      title,
      description,
      mainPhoto,
      secPhoto,
      creator,
      category,
      fixer,
      location,
      searchTerms,
    });

    if (report) {
      res.status(201).send(report);
      return;
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

const fetchAllReports = async (req, res, next) => {
  try {
    const report = await Report.find().sort({ $natural: -1 });
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Function to shuffle an array randomly
// function shuffleArray(array) {
//   const shuffled = [...array];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled;
// }

// const fetchFood = async (req, res, next) => {
//   try {
//     // Get all food items from the database
//     const allFood = await Food.find();

//     // Randomly shuffle the array of food items
//     const shuffledFood = shuffleArray(allFood);

//     res.status(200).send(shuffledFood);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

const deleteReport = async (req, res, next) => {
  // check if report exist
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(400).json({ message: "report not found" });
    return;
  }

  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: "Could not delete report" });
  }
  // console.log(req.params);
};

const fetchReportBasedOnSth = async (req, res) => {
  const { category } = req.body;
  try {
    const report = await Report.find({
      category,
    });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).send(error);
  }
};

const fetchResolvedReports = async (req, res) => {
  const { resolved } = req.body;
  try {
    const report = await Report.find({
      resolved,
    });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).send(error);
  }
};

const commentOnReport = async (req, res) => {
  try {
    const { campusID, comment } = req.body;

    // Find the post by ID
    const report = await Report.findById(req.params.id);

    // find if the user exists
    const user = await User.findOne({ campusID });

    // If the post doesn't exist, return an error
    if (!report) {
      return res.status(404).json({ error: "report not found" });
    }

    // If the user doesn't exist, return an error
    if (!user) {
      // console.log(user);
      // console.log(campusID);
      return res.status(404).json({ error: "user not found" });
    }

    // Create a new comment
    const newComment = {
      campusID,
      comment,
    };

    // Add the comment to the post's comments array
    report.comments.push(newComment);

    // Save the updated post with the new comment
    await report.save();
    res.status(201).send(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed To Comment" });
  }
};

const deleteCommentOnReport = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the post by ID
    const report = await Report.findById(req.params.id);

    // If the post doesn't exist, return an error
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Find the index of the comment in the comments array
    const commentIndex = report.comments.findIndex(
      (comment) => comment._id == commentId
    );

    // If the comment doesn't exist, return an error
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Remove the comment from the comments array
    report.comments.splice(commentIndex, 1);

    // Save the updated post without the deleted comment
    await report.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

const likeReport = async (req, res) => {
  try {
    const { campusID } = req.body;

    // Find the report item by ID
    const report = await Report.findById(req.params.id);

    // If the report doesn't exist, return an error
    if (!report) {
      return res.status(404).json({ error: "report not found" });
    }

    // Find if the username exists
    const user = await User.findOne({ campusID });
    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has already liked this report
    const hasLiked = report.likes.some((like) => like.campusID === campusID);

    if (hasLiked) {
      // If the user has already liked it, remove their like
      report.likes = report.likes.filter((like) => like.campusID !== campusID);
      await report.save();
      res.status(200).json({ message: "Unliked successfully" });
    } else {
      // If the user hasn't liked it yet, add their like
      const newLike = {
        campusID,
      };
      report.likes.push(newLike);
      await report.save();
      res.status(201).json({ message: "Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Like" });
  }
};

const AddViewOnReport = async (req, res) => {
  try {
    const { campusID } = req.body;

    // Find the report item by ID
    const report = await Report.findById(req.params.id);

    // If the report doesn't exist, return an error
    if (!report) {
      return res.status(404).json({ error: "report not found" });
    }

    // Find if the username exists
    const user = await User.findOne({ campusID });
    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has already viwes this report
    const hasViewed = report.views.some((view) => view.campusID === campusID);

    if (hasViewed) {
      // If the user has already viewd it
      res.status(200).json({ message: "Already viewed" });
    } else {
      // If the user hasn't viewed it yet, add their view
      const newView = {
        campusID,
      };
      report.views.push(newView);
      await report.save();
      res.status(201).json({ message: "View added successfully" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const fetchSpecificReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id });
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send("Action Failed");
  }
};

const fetchAllMyReports = async (req, res) => {
  const { campusID } = req.body;

  if (!campusID) {
    return res.status(500).send("ID not sent");
  }

  try {
    const report = await Report.findOne({ creator: campusID });
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send("Action Failed");
  }
};

const updateSpecificReport = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAllReports = async (req, res, next) => {
  try {
    // Delete all reports
    await Report.deleteMany({});
    res.json({ message: "All reports have been deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting reports." });
  }
};

module.exports = {
  createReport,
  fetchAllReports,
  likeReport,
  fetchReportBasedOnSth,
  deleteReport,
  commentOnReport,
  fetchSpecificReport,
  updateSpecificReport,
  fetchResolvedReports,
  deleteAllReports,
  fetchAllMyReports,
  AddViewOnReport,
  deleteCommentOnReport,
};
