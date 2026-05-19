import mongoose from 'mongoose';

const projectInvitationSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    inviter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    invitee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending', index: true },
  },
  { timestamps: true },
);

projectInvitationSchema.index({ project: 1, invitee: 1, status: 1 });

const ProjectInvitation = mongoose.model('ProjectInvitation', projectInvitationSchema);

export default ProjectInvitation;
