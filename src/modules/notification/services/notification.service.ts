import {Injectable} from '@angular/core';
import {NotificationStore} from '../notification.store';
import {NotificationCommands} from './notification.commands';
import {NotificationQueries} from './notification.queries';
import {HttpNotificationQueries} from './platform/http/notification.queries.http';
import {HttpNotificationCommands} from './platform/http/notification.commands.http';

@Injectable()
export class NotificationService {
  constructor(
    private store: NotificationStore,
    private notificationQueries: HttpNotificationQueries,
    private notificationCommands: HttpNotificationCommands,
  ) {
  }

  async fetch() {
    const notifications = await this.notificationQueries.getNotifications();
    this.store.mutate(s => {
      return {
        ...s,
        notifications
      }
    });
  }

  async markAsViewed() {
    await this.notificationCommands.view();
    await this.fetch();
  }

}
