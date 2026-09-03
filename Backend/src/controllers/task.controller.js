const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      department,
      sectionId,
      minScore,
      maxScore,
      dueBefore,
      dueAfter,
      search,
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const pageSize = Math.min(Math.max(Number(limit), 1), 100);

    const filter = {
      status: "pending",
    };

    if (department) {
      filter.department = department;
    }

    if (sectionId) {
      filter.sectionId = sectionId;
    }

    if (minScore !== undefined || maxScore !== undefined) {
      filter.criticalityScore = {};

      if (minScore !== undefined) {
        filter.criticalityScore.$gte = Number(minScore);
      }

      if (maxScore !== undefined) {
        filter.criticalityScore.$lte = Number(maxScore);
      }
    }

    if (dueBefore || dueAfter) {
      filter.dueDate = {};

      if (dueAfter) {
        filter.dueDate.$gte = new Date(dueAfter);
      }

      if (dueBefore) {
        filter.dueDate.$lte = new Date(dueBefore);
      }
    }

    if (search) {
      filter.$or = [
        { taskId: { $regex: search, $options: "i" } },
        { assetId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { taskType: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (currentPage - 1) * pageSize;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ criticalityScore: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),

      Task.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
};
