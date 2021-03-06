import { Injectable } from '@angular/core';
import { PageModel } from 'src/modules/common/Pagination';
import { FeedStore } from 'src/modules/feed/feed.store';
import { UserStore } from 'src/modules/user/user.store';
import { Post, PostData } from '../post.model';
import { HttpPostCommands } from './plateform/http/post.commands.http';
import { HttpPostQueries } from './plateform/http/post.queries.http';
import { PostCommands } from './post.commands';
import { PostMapper } from './post.mapper';
import { PostQueries } from './post.queries';

@Injectable()
export class PostService {
    constructor(private commands: HttpPostCommands,
        private queries: HttpPostQueries,
        private userStore: UserStore,
        private mapper: PostMapper,
        private store: FeedStore) {
    }

    async create(roomId: string, message: string, file?: File): Promise<PostData> {
        
        const post = await this.commands.create(roomId, message, file);
        
        return {
            id: post.id,
            likes: 0,
            roomId,
            // comments: [],
            createdAt: new Date().toISOString(),
            createdBy: this.userStore.value.user!,
            liked: false,
            message
        }
    }

    async fetch(roomId: string, page: PageModel): Promise<void> {
        const pageResult = await this.queries.getLast(roomId, page);
        this.store.mutate(state => {
            return {
                ...state,
                posts: pageResult.data.map(d => this.mapper.map(d))
            }
        });
    }

    /**
     *  TODO appeler la méthode like sur PostCommands
     * @param post 
     */
    async like(post: Post): Promise<void> {
        
        await this.commands.like(post.roomId, post.id);
    }


}
