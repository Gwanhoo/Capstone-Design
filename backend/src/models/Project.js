import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
    createdBy: {
      type: String,
      default: 'local-user',
      trim: true,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
