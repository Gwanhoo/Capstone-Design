import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';
import { findAccessibleProject } from '../utils/projectAccess.js';
import { getProjectRoomName } from '../sockets/index.js';

const MAX_CONTENT_LENGTH = 1000;

const toMessageDto = (message, sender) => ({
  _id: message._id.toString(),
  projectId: message.project.toString(),
  content: message.content,
  sender: {
    _id: sender._id.toString(),
    name: sender.name,
    email: sender.email,
  },
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

const handleError = (res, error) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }
  return res.status(500).json({ success: false, message: 'mongoose error' });
};

export const getProjectMessages = async (req, res) => {
  const { projectId } = req.params;
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);

  try {
    const { project, allowed, message: accessMessage } = await findAccessibleProject(projectId, req.user?.userId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!allowed) return res.status(403).json({ success: false, message: accessMessage ?? 'forbidden' });

    const messages = await ChatMessage.find({ project: project._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', '_id name email')
      .lean();

    const ordered = messages.reverse().map((msg) => ({
      _id: String(msg._id),
      projectId: String(msg.project),
      content: msg.content,
      sender: {
        _id: String(msg.sender?._id || ''),
        name: msg.sender?.name || '알 수 없음',
        email: msg.sender?.email || '',
      },
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    return res.status(200).json({ success: true, data: ordered });
  } catch (error) {
    return handleError(res, error);
  }
};

export const postProjectMessage = async (req, res) => {
  const { projectId } = req.params;
  const content = String(req.body?.content ?? '').trim();

  if (!content || content.length > MAX_CONTENT_LENGTH) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }

  try {
    const { project, allowed, message: accessMessage } = await findAccessibleProject(projectId, req.user?.userId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!allowed) return res.status(403).json({ success: false, message: accessMessage ?? 'forbidden' });

    const sender = await User.findById(req.user?.userId).select('_id name email');
    if (!sender) return res.status(401).json({ success: false, message: 'unauthorized' });

    const message = await ChatMessage.create({
      project: project._id,
      sender: sender._id,
      content,
    });

    const payload = toMessageDto(message, sender);

    const io = req.app.get('io');
    if (io) io.to(getProjectRoomName(projectId)).emit('chat:message', payload);

    return res.status(201).json({ success: true, data: payload });
  } catch (error) {
    return handleError(res, error);
  }
};
