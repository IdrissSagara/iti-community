import { Injectable } from '@angular/core';
import { PostData } from '../post.model';
@Injectable()
export abstract class PostCommands {
/* prof  abstract create(roomId: string, message: string, file?: File): Promise<PostData>;
  abstract like(roomId: string, postId: string): Promise<void>;
  */
    abstract create(roomId: string, message: string, file?: File): Promise<{ id: string }>;
    abstract comment(postId: string, comment: string): Promise<void>;
    abstract like(roomId: string, postId: string, newValue: boolean): Promise<void>;
}
