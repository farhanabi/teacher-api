import { NextFunction, Request, Response } from 'express';
import { NotificationsRequest } from '../validations/notifications';
import { getNotificationRecipients } from '../../services/notification';
import { ApiError } from '../middlewares/error';

export const retrieveForNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacher, notification } = req.body as NotificationsRequest;

    const recipients = await getNotificationRecipients(teacher, notification);
    
    res.status(200).json({ recipients });
    return;
  } catch (error) {
    if (error instanceof Error) {
      return next(new ApiError(400, error.message));
    }
    return next(error);
  }
};
