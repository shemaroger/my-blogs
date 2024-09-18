const Blog = require('../models/blog'); // Adjust the path as necessary

// Function to get dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    // Total number of blogs
    const totalBlogs = await Blog.countDocuments();

    // Total number of comments
    const totalComments = await Blog.aggregate([
      { $unwind: "$comments" },
      { $count: "totalComments" }
    ]).then(result => (result[0] ? result[0].totalComments : 0));

    // Total number of likes
    const totalLikes = await Blog.aggregate([
      { $project: { likesCount: { $size: "$likes" } } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } }
    ]).then(result => (result[0] ? result[0].totalLikes : 0));

    // Prepare data for blog engagement chart
    const engagementData = await Blog.aggregate([
      { $project: { month: { $month: "$date" }, likesCount: { $size: "$likes" }, commentsCount: { $size: "$comments" } } },
      { $group: { _id: "$month", likes: { $sum: "$likesCount" }, comments: { $sum: "$commentsCount" } } },
      { $sort: { _id: 1 } }
    ]);

    // Format data for the chart
    const labels = engagementData.map(data => `Month ${data._id}`);
    const likes = engagementData.map(data => data.likes);
    const comments = engagementData.map(data => data.comments);

    // Send the data as JSON response
    res.json({
      totalBlogs,
      totalComments,
      totalLikes,
      engagementData: {
        labels,
        likes,
        comments
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
