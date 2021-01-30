import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { AnyNotification, AppNotification, PostLikedNotification, RoomAddedNotification } from '../notification.model';
import { NotificationStore } from '../notification.store';
import { NotificationQueries } from '../services/notification.queries';
import { LocalNotificationQueries } from '../services/platform/local/notification.queries.local';
import { HttpNotificationQueries } from '../services/platform/http/notification.queries.http';
import { NotificationSocketService } from '../services/notification.socket.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.less']
})
export class NotificationBarComponent implements OnInit {
  anyNotifications: AnyNotification[];
  postLikedNotif: PostLikedNotification[];

  constructor(private notifService: NotificationService, private notifStore: NotificationStore,
    private notifQueries: HttpNotificationQueries, private socketService: NotificationSocketService, private nzNotification: NzNotificationService) {

  }

  async ngOnInit() {
    this.anyNotifications = (await this.notifQueries.getNotifications()).sort(x => x.timestamp).reverse();
    console.log(this.anyNotifications);
    this.socketService.onNewNotification(notification => {
      this.anyNotifications.push(notification);

      let description = "";
      switch (notification.subject) {
        case 'post_liked':
          description = `Votre post  : ${notification.payload.preview} plait à ${notification.payload.user.username} .`;

          break;
        case 'room_added':
          description = `Nouvelle room ${notification.payload.room.name} ajoutée par  ${notification.payload.user.username}.`;

          break;
        case 'new_user':
          description = `Salut ${notification.payload.username} , il est nouveau :)`;
          break;

        default:
          description = "Vous avez une nouvelle notification !";
          break;
      }
      this.nzNotification.blank(
        'Notification', description

      )
        .onClick.subscribe(() => {
          //console.log('notification clicked!');
        });

    });
  }


}
