import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {AnyNotification} from '../notification.model';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.less']
})
export class NotificationBarComponent implements OnInit {

  anyNotif: AnyNotification;
  notif: any;

  constructor(private notifService: NotificationService) {
  }

  ngOnInit(): void {

  }


}
