import mongoose from 'mongoose';
import Project from '../models/Project.js';
import ProjectInvitation from '../models/ProjectInvitation.js';
import User from '../models/User.js';

const handleError = (res, error) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }
  return res.status(500).json({ success: false, message: 'mongoose error' });
};

export const createInvitation = async (req, res) => {
  const { projectId } = req.params;
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!email) return res.status(400).json({ success: false, message: 'invalid request' });

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (project.createdBy !== req.user?.userId) return res.status(403).json({ success: false, message: 'forbidden' });

    const invitee = await User.findOne({ email });
    if (!invitee) return res.status(404).json({ success: false, message: 'user not found' });
    const inviteeId = invitee._id.toString();

    if (project.members.includes(inviteeId)) return res.status(409).json({ success: false, message: 'already member' });

    const existsPending = await ProjectInvitation.findOne({ project: project._id, invitee: invitee._id, status: 'pending' });
    if (existsPending) return res.status(409).json({ success: false, message: 'already invited' });

    const invitation = await ProjectInvitation.create({
      project: project._id,
      inviter: new mongoose.Types.ObjectId(req.user.userId),
      invitee: invitee._id,
      email,
      status: 'pending',
    });

    return res.status(201).json({ success: true, data: invitation });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMyInvitations = async (req, res) => {
  try {
    const invitations = await ProjectInvitation.find({ invitee: req.user?.userId, status: 'pending' })
      .populate('project', '_id name description isArchived')
      .populate('inviter', '_id name email')
      .sort({ createdAt: -1 })
      .lean();

    const data = invitations.filter((inv) => inv.project?.isArchived !== true).map((inv) => ({
      id: String(inv._id),
      status: inv.status,
      createdAt: inv.createdAt,
      project: {
        _id: String(inv.project?._id || ''),
        name: inv.project?.name || '프로젝트',
        description: inv.project?.description || '',
      },
      inviter: {
        _id: String(inv.inviter?._id || ''),
        name: inv.inviter?.name || '알 수 없음',
        email: inv.inviter?.email || '',
      },
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
};

const processInvitation = async (req, res, nextStatus) => {
  const { invitationId } = req.params;

  try {
    const invitation = await ProjectInvitation.findById(invitationId);
    if (!invitation) return res.status(404).json({ success: false, message: 'invitation not found' });
    if (String(invitation.invitee) !== req.user?.userId) return res.status(403).json({ success: false, message: 'forbidden' });
    if (invitation.status !== 'pending') return res.status(409).json({ success: false, message: 'already processed' });

    invitation.status = nextStatus;
    await invitation.save();

    if (nextStatus === 'accepted') {
      const project = await Project.findById(invitation.project);
      if (!project) return res.status(404).json({ success: false, message: 'project not found' });
      if (project.isArchived === true) return res.status(403).json({ success: false, message: '보관된 프로젝트는 프로젝트 생성자만 접근할 수 있습니다.' });
      const inviteeId = String(invitation.invitee);
      if (!project.members.includes(inviteeId)) {
        project.members.push(inviteeId);
        project.memberCount = project.members.length;
        await project.save();
      }
    }

    return res.status(200).json({ success: true, data: { id: String(invitation._id), status: invitation.status } });
  } catch (error) {
    return handleError(res, error);
  }
};

export const acceptInvitation = async (req, res) => processInvitation(req, res, 'accepted');
export const declineInvitation = async (req, res) => processInvitation(req, res, 'declined');
