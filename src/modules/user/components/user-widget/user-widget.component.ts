import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/modules/authentication/services/authentication.service';
import { UserService } from '../../services/user.service';
import { User } from '../../user.model';
import { NotificationStore } from 'src/modules/notification/notification.store';
import {UserStore} from '../../user.store';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-user-widget',
  templateUrl: './user-widget.component.html',
  styleUrls: ['./user-widget.component.less']
})
export class UserWidgetComponent implements OnInit {
  @Output()
  toggleNotifications: EventEmitter<void> = new EventEmitter();

  user$: Observable<User | undefined>;
  photoUrl$: Observable<string | undefined>;
  hasUnread$: Observable<boolean>;
  user: User | undefined;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NzModalService,
    private notificationStore: NotificationStore,
    private store: UserStore,
    private sanitizer: DomSanitizer
  ) {
    this.user$ = store.user$;
    this.photoUrl$ = store.get(s => s.user && s.user.photoUrl ? s.user.photoUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg");
    this.hasUnread$ = notificationStore.hasUnread$;
  }

  get photoUrl(): SafeResourceUrl | undefined {
    if (this.user?.photoUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.user.photoUrl);
    }
  }

  fireToggleNotificaions() {
    this.toggleNotifications.emit();
  }

  ngOnInit(): void {
    this.user$.subscribe(res => {
      this.user = res;
    });
  }

  logout() {
    this.modalService.confirm({
      nzTitle: "Déconnexion",
      nzContent: "Êtes-vous sûr(e) de vouloir déconnecter votre session ?",
      nzOkText: "Déconnexion",
      nzOnOk: () => {
        // TODO logout puis rediriger vers "/splash/login"
        this.authService.logout().then(res => {
          this.router.navigate(['/splash/login']);
        });
      }
    });
  }
}
