import {Injectable} from '@angular/core';
import {User} from '../user.model';
import {UserStore} from '../user.store';
import {UserCommands} from './user.commands';
import {UserQueries} from './user.queries';
import {HttpUserQueries} from './platform/http/user.queries.http';
import {HttpUserCommands} from './platform/http/user.commands.http';

@Injectable()
export class UserService {
  constructor(
    private queries: HttpUserQueries,
    private commands: HttpUserCommands,
    private store: UserStore,
  ) {
  }

  async register(username: string, password: string): Promise<void> {
    await this.commands.register(username, password);
  }

  async update(user: {
    id: string,
    username?: string,
    photo?: File
  }): Promise<void> {
    const usr = await this.commands.update(user);
    this.store.mutate(s => {
      return {
        user: usr
      }
    });
  }

  async fetchInfo(): Promise<void> {
    const user = await this.queries.getUserInfo();
    this.store.mutate(s => {
      return {
        ...s,
        user
      };
    })
  }

  search(token: string): Promise<User[]> {
    return this.queries.search(token);
  }
}
