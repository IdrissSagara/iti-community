import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationStore } from './notification.store';
import { NotificationService } from './services/notification.service';
import { NotificationQueries } from './services/notification.queries';
import {LocalNotificationQueries} from './services/platform/local/notification.queries.local';
import {NotificationBarComponent} from './notification-bar/notification-bar.component';



@NgModule({
  providers: [NotificationStore, NotificationService, {
    provide: NotificationQueries,
    useClass: LocalNotificationQueries
  }],
  imports: [
    CommonModule
  ],
  exports: [
    NotificationBarComponent
  ],
  declarations: [NotificationBarComponent]
})
export class NotificationModule { }
