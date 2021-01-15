import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from '../../services/user.service';
import {UserQueries} from '../../services/user.queries';

class UserRegistrationFormModel {
  username = "";
  password = "";
  confirmPassword = "";
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {
  @ViewChild('f')
  form: NgForm;

  model = new UserRegistrationFormModel();

  checkUserExiste = false;
  passwordIsNotEquals = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private user: UserQueries,
  ) {
  }

  ngOnInit(): void {
  }

  async submit() {
    if (this.user.exists(this.model.username)) {
      this.checkUserExiste = true;
      return;
    }

    // TODO  Vérifier que la confirmation de mot de passe correspond au mot de passe
    if (this.form.form.invalid || this.model.password !== this.model.confirmPassword) {
      this.passwordIsNotEquals = true;
      return;
    } else {
      this.userService.register(this.model.username, this.model.password);
    }

    // TODO Enregistrer l'utilisateur via le UserService
    this.goToLogin();
  }

  goToLogin() {
    // TODO rediriger l'utilisateur sur "/splash/login"
    this.router.navigate(['/splash/login']);
  }
}
