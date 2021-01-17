import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserQueries } from '../../services/user.queries';
import { NzMessageService } from 'ng-zorro-antd/message';

class UserRegistrationFormModel {
  username = '';
  password = '';
  confirmPassword = '';
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

  constructor(
    private router: Router,
    private userService: UserService,
    private nzMessageService: NzMessageService,
    private user: UserQueries,
  ) {
  }

  ngOnInit(): void {

  }

  async submit() {

    // =================================================================================
    // TODO  Vérifier que la confirmation de mot de passe correspond au mot de passe
    // =================================================================================
    if (this.form.form.invalid || this.model.password !== this.model.confirmPassword) {
      this.nzMessageService.error('Les mots de passe ne concorde pas.');
      return;
    }

    // ===================================================================
    // TODO Vérification que l'utilisateur n'est pas déjà existant.
    // ===================================================================
    this.user.exists(this.model.username)
      .then(reponse => {
        if (reponse) {
          this.nzMessageService.error('Cet utilisateur existe déjà.');
          return;
        } else {
          try {
            // ===================================================================
            // TODO Enregistrer l'utilisateur via le UserService
            // ===================================================================
            this.userService.register(this.model.username, this.model.password)
              .then(res => {
                this.goToLogin();
              })
              .catch(err => {
                this.nzMessageService.error('Une erreur est survenue. Veuillez réessayer plus tard');
                console.log(err);
                return;
              });

          } catch (e) {
            console.log(e);
            this.nzMessageService.error('Une erreur est survenue. Veuillez réessayer plus tard');
          }
        }
      }).catch(err => {
      console.log(err);
      this.nzMessageService.error('Une erreur est survenue. Veuillez réessayer plus tard');
      return;
    });
  }

  goToLogin() {
    // TODO rediriger l'utilisateur sur "/splash/login"
    this.router.navigate(['/splash/login']);
  }
}
