import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {AnyNotification, NewRoomNotification, PostLikedNotification} from '../notification.model';
import {NotificationStore} from '../notification.store';
import {NotificationQueries} from '../services/notification.queries';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.less']
})
export class NotificationBarComponent implements OnInit {
  anyNotifications: AnyNotification[];

  constructor(private notifService: NotificationService, private notifStore: NotificationStore,
              private notifQueries: NotificationQueries) {

  }

  async ngOnInit() {
    this.anyNotifications = await this.notifQueries.getNotifications();
    console.log('any Notif', this.anyNotifications);

  }

  timeConversion(millisec: any) {
    const date = new Date(millisec * 1000);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
  }
}
