import { NextFunction, Request, Response } from 'express';
import { notificationsSchema } from '../validations/notifications';
import { getNotificationRecipients } from '../../services/notification';

export const retrieveForNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacher, notification } = notificationsSchema.parse(req.body);
    
    const recipients = await getNotificationRecipients(teacher, notification);
    
    res.status(200).json({ recipients });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
