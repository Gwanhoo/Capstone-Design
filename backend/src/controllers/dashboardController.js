import Task from '../models/Task.js';
import Project from '../models/Project.js';

const priorityRank = { urgent: 0, high: 1, medium: 2, low: 3 };

export const getRecentTasks = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const projects = await Project.find({ $and: [{ $or: [{ createdBy: userId }, { members: userId }] }, { isArchived: { $ne: true } }] }).select('_id name columns');
    const projectMap = new Map(projects.map((project) => [project._id.toString(), project]));

    const tasks = await Task.find({ projectId: { $in: Array.from(projectMap.keys()) } })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    const data = tasks
      .map((task) => {
        const project = projectMap.get(String(task.projectId));
        const column = project?.columns?.find((item) => item.id === task.columnId);
        return {
          _id: String(task._id),
          projectId: String(task.projectId),
          projectName: project?.name || '알 수 없음',
          title: task.title,
          columnId: task.columnId,
          columnTitle: column?.title || task.columnId,
          priority: task.priority,
          updatedAt: task.updatedAt,
        };
      })
      .sort((a, b) => {
        const dateDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
      });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'dashboard error' });
  }
};
