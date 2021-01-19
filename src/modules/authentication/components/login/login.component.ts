import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from "ng-zorro-antd/message";
import { LoginCommandResult } from '../../services/authentication.commands';
import { AuthenticationService } from '../../services/authentication.service';

class LoginFormModel {
  username = "";
  password = "";
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  @ViewChild(NgForm, { static: false })
  ngForm: NgForm;

  model = new LoginFormModel();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  goToRegistration() {
    // TODO naviguer vers "/splash/register"
    this.router.navigate(['/splash/register']);
  }

  submit() {
    this.login();
  }

  async login() {
    if (this.ngForm.form.invalid) {
      return;
    }
    try {
      //=========================================================================================================================================
      // TODO vérifier le résultat de l'authentification. Rediriger sur "/" en cas de succès ou afficher une erreur en cas d'échec
      //=========================================================================================================================================
      await this.authService.authenticate(this.model.username, this.model.password)
        .then(Response => {
          console.log(Response);
          var res = Response as LoginCommandResult;
          if (res.success) {
            //this.router.navigate(['/']);
          } else if (res.success) {
            this.nzMessageService.error("");
          }
        })
        .catch(err => {
          this.nzMessageService.error('Une erreur est survenue. Veuillez réessayer plus tard');
        });

    } catch (e) {
      this.nzMessageService.error('Une erreur est survenue. Veuillez réessayer plus tard');
    }
  }
}
