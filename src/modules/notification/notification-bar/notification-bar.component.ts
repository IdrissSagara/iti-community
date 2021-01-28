import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {AnyNotification, AppNotification, PostLikedNotification} from '../notification.model';
import {NotificationStore} from '../notification.store';
import {NotificationQueries} from '../services/notification.queries';
import {LocalNotificationQueries} from '../services/platform/local/notification.queries.local';
import {HttpNotificationQueries} from '../services/platform/http/notification.queries.http';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.less']
})
export class NotificationBarComponent implements OnInit {
  anyNotifications: AnyNotification[];
  postLikedNotif: PostLikedNotification[];

  constructor(private notifService: NotificationService, private notifStore: NotificationStore,
              private notifQueries: HttpNotificationQueries) {

  }

  async ngOnInit() {
    this.anyNotifications = await this.notifQueries.getNotifications();

  }

  async btnNotif() {
    await this.notifQueries.getNotifications().then(res => {
      this.anyNotifications = res;
      console.log('res', res);
    });
    // console.log('any Notif', this.anyNotifications);
  }

  timeConversion(millisec: any) {
    const date = new Date(millisec * 1000);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    const formattedTime = hours + 'h';
    return formattedTime;
  }
}
