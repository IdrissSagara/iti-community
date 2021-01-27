import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Post } from '../../post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit, AfterViewInit {
  @Input()
  post: Post;
  contentMessage: string;

  @ViewChild("anchor")
  anchor: ElementRef<HTMLDivElement>;

  constructor(
    private postService: PostService
  ) {
  }

  ngOnInit(): void {
//    console.log(this.post);
    this.contentMessage = this.link(this.post.message.text.content);

  }

  ngAfterViewInit() {
    this.anchor.nativeElement.scrollIntoView();
  }

  async like() {
    this.post.liked = !this.post.liked;

    //==========================================================
    // TODO like du post
    //==========================================================
    await this.postService.like(this.post);

  }

  /**
   * 
   * @param event 
   */
  playVideo(event: any) {
    event.toElement.play()
  }

  /**
   * 
   * @param text 
   *
   */
  link(text: string): string {
    let replacedText;
    let urlRegex;
    let mentionRegex;

    urlRegex = /http[s]?:\/\/\S+/g;

    mentionRegex =  /\@([\w.\-]+)/g;

    replacedText = text.replace(urlRegex, str => `<a href="${str}" target="_blank">${str}</a>`);

    replacedText = replacedText.replace(mentionRegex, str => `<a>${str}</a>`);

    return replacedText;
  }

}
