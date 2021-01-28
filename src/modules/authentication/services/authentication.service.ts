import { Injectable } from '@angular/core';
import { Bad, Ok } from 'src/modules/common/Result';
import { AuthenticationStore } from '../authentication.store';
import { AuthenticationCommands } from './authentication.commands';
import { HttpAuthenticationCommands } from './plateform/http/authentication.commands.http';

@Injectable()
export class AuthenticationService {
    constructor(
      private commands: AuthenticationCommands,
      private request: HttpAuthenticationCommands,
      private readonly store: AuthenticationStore,
    ) {
    }

    async authenticate(username: string, password: string) {
        //const loginResult = await this.commands.login(username, password);
        const loginResult = await this.request.login(username, password);
        console.log(loginResult);
        if (!loginResult.success) {
            return Bad(loginResult.reason);
        }

        this.store.mutate(s => {
            return {
                ...s,
                userId: loginResult.value.user.id,
                accessToken: loginResult.value.bearer.token,
                expiresAt: loginResult.value.bearer.expiresAt
            }
        });

        return Ok();
    }

    async logout() {
        if (!this.store.value) {
            return Bad("user_not_authenticated");
        }

        //this.commands.logout(this.store.value.userId);
        this.request.logout(this.store.value.userId);
        this.store.set(null);
        return Ok();
    }
}
