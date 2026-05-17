import mongoose from 'mongoose';
import Project from '../models/Project.js';

const handleError = (res, error) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: 'invalid request',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'mongoose error',
  });
};

export const getProjects = async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'project not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      success: false,
      message: 'invalid request',
    });
  }

  try {
    const project = await Project.create({
      name,
      ...(description !== undefined ? { description } : {}),
    });

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
