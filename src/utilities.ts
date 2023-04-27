import { notification } from 'antd-notifications-messages';

export const showNotification = (type: any, title: string, message: string) => {
  notification({
    type,
    title,
    message,
  });
};
