import mongoose from 'mongoose';


const columnSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

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
      required: true,
      trim: true,
    },
    members: {
      type: [String],
      default: [],
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    columns: {
      type: [columnSchema],
      default: undefined,
    },
    docs: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
