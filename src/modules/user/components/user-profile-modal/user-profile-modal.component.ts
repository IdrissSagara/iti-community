import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../user.model';

export class UserProfileForm {
  id: string;
  username: string;
  photoUrl?: string;
  photo: File | undefined;
  user: User;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.photoUrl = user.photoUrl;
    this.user = user;
  }

  get file() {
    return this.photo;
  }

  set file(file: File | undefined) {
    this.photo = file;
    if (file) {
      this.toBase64(file).then(s => {
        this.photoUrl = s;
      })
    }
  }

  toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  hasChanged(): boolean {
    return !!this.file || this.username !== this.user.username
  }
}

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.less']
})
export class UserProfileModalComponent implements OnInit {
  @Input()
  user: User;

  @ViewChild("f")
  form: NgForm;
  supportedTypes = "";
  isVisible: boolean = false;
  model: UserProfileForm;

  constructor(private userService: UserService, private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.model = new UserProfileForm(this.user);
  }

  get photoUrl(): SafeResourceUrl | undefined {
    if (this.model.photoUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.model.photoUrl);
    }
  }

  async onOk() {
    // TODO vérifier si le formulaire est valide
      if (this.model.hasChanged()) {
        // TODO mettre à jour l'utilisateur via le service
        await this.userService.update(this.model).then(res => {
          console.log('updated--', res);

          this.close();
        }).catch( error => {
          console.log("user form error", error);
        });
    }

    this.close();
  }

  onFileUpload = (file: File) => {
    this.model.file = file;
    return false;
  }

  onCancel() {
    this.close();
  }

  open() {
    this.model = new UserProfileForm(this.user);
    this.form.resetForm(this.model);
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
