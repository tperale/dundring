import { User } from '../../../common/types/userTypes';
import fetch from 'node-fetch';
import { Room } from '../../../common/types/wsTypes';

require('dotenv').config();

export const checkSlackConfig = () => {
  if (!process.env.SLACK_USER_CREATION) {
    console.log('[.env]: No Slack service for user creation provided');
  }
  if (!process.env.SLACK_ERRORS) {
    console.log('[.env]: No Slack service for errors provided');
  }
  if (!process.env.SLACK_GROUP_SESSION) {
    console.log('[.env]: No Slack service for group session provided');
  }
  if (!process.env.SLACK_FEEDBACK) {
    console.log('[.env]: No Slack service for feedback provided');
  }
};

enum SlackService {
  USER_CREATION,
  ERRORS,
  GROUP_SESSION,
  FEEDBACK,
}

const getServicePath = (service: SlackService): string | null => {
  switch (service) {
    case SlackService.USER_CREATION:
      return process.env.SLACK_USER_CREATION || null;
    case SlackService.ERRORS:
      return process.env.SLACK_ERRORS || null;
    case SlackService.GROUP_SESSION:
      return process.env.SLACK_GROUP_SESSION || null;
    case SlackService.FEEDBACK:
      return process.env.SLACK_FEEDBACK || null;
  }
};

const getServiceUrl = (service: SlackService): string | null => {
  const path = getServicePath(service);
  if (!path) return null;

  return `https://hooks.slack.com/services/${path}`;
};

const sendSlackMessage = (service: SlackService, message: string) => {
  const url = getServiceUrl(service);
  if (!url) return;

  try {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });
  } catch (e) {
    console.error('[sendSlackMessage]:', e);
  }
};

export const logUserCreation = (user: User) => {
  const message = `New user: *${user.username}* (${user.mail})`;
  sendSlackMessage(SlackService.USER_CREATION, message);
};

export const logRoomJoin = (username: string, room: Room) => {
  const message = `*${username}* joined group session with id *#${room.id}*`;
  sendSlackMessage(SlackService.GROUP_SESSION, message);
};

export const logRoomCreation = (room: Room) => {
  const message = `*${room.creator}* created group session with id *#${room.id}*`;
  sendSlackMessage(SlackService.GROUP_SESSION, message);
};

export const logRoomLeave = (username: string, room: Room) => {
  const message = `*${username}* left group session with id *#${room.id}*.`;
  sendSlackMessage(SlackService.GROUP_SESSION, message);
};

export const logRoomDeletion = (username: string, room: Room) => {
  const message = `*${username}* left group session with id *#${room.id}*. No more users in group session; deleting it.`;
  sendSlackMessage(SlackService.GROUP_SESSION, message);
};
