import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { NzPopoverComponent, NzPopoverDirective } from 'ng-zorro-antd/popover';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from 'src/modules/user/user.model';
import { MessageSentEventPayload } from '../../input.model';

@Component({
  selector: 'app-feed-input',
  templateUrl: './feed-input.component.html',
  styleUrls: ['./feed-input.component.less']
})
export class FeedInputComponent {
  @Output()
  messageSent: EventEmitter<MessageSentEventPayload> = new EventEmitter();

  @ViewChild(NzPopoverDirective)
  inputPopover: NzPopoverDirective;

  /**
   * Hold the input message
   */
  message: string = "";

  imgURL: any;

  users: User[] = [];

  /**
   * Staging file to upload
   */
  file: File | null = null;

  currentMention?: RegExpMatchArray;

  supportedTypes = "image/png,image/jpeg,image/gif,image/bmp,image/bmp,video/mpeg,audio/mpeg,audio/x-wav,image/webp";

  constructor(
    private userService: UserService
  ) { }

  /**
   * Triggered when the user is selecting a mention in the list.
   * @param user The mentioned user
   */
  chooseMention(user: User) {

    if (this.currentMention) {
      this.message = this.message.substr(0, this.currentMention.index! + 1) + user.username + this.message.substr(this.currentMention.index! + this.currentMention[1].length + 1) + " ";
    }
    this.hideMentionList();
  }


  /**
   * Display the mention list
   * @param mentionMatch The mention regexp match
   */
  showMentionList(mentionMatch: RegExpMatchArray) {
    this.currentMention = mentionMatch;
    this.inputPopover.show();
  }

  /**
   * Hide the mention list
   */
  hideMentionList() {
    this.inputPopover.hide();
    this.currentMention = undefined;
  }


  /**
   * Message change evetn handler
   * @param message
   */
  onMessageChanged(message: string) {
    this.message = message;
  }

  /**
   * Close tag event handler. Trigger when the user wants to remove a file.
   */
  onCloseTag() {
    this.setFile(null);
  }

  /**
  * Event handler
  * @param file the file privded by the user
  */
  onFileUpload = (file: File) => {
    this.setFile(file);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
    return false;
  }

  /**
   * InputKeyDown event handler. Used to watch "Enter" key press
   * @param e
   */
  onInputKeyDown(e: KeyboardEvent) {
    // True if "Enter" is pressed without th shift or CTRL key pressed
    if (e.key.toLowerCase() === "enter" && !e.shiftKey && !e.ctrlKey) {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();

      this.send();
    }

  }

  /**
   * InputKeyUp event handler. Use to watch arrows key press to know when to show mention list
   * @param e
   */


  getCurrentWordSelected(currentSelected: number): string {
    let wordCurrent = "";
    let position = currentSelected - 1;
    while (this.message[position] != " " && position != -1) {
      wordCurrent = this.message[position] + wordCurrent;
      position--;
    }

    const longText = this.message.split("").length;
    if (currentSelected < longText) {
      position = currentSelected;
      while (this.message[position] != " " && currentSelected < longText) {
        wordCurrent = wordCurrent + this.message[position];
        position++;
      }
    }
    return wordCurrent;
  }

  startMatching(word: string) {
    if (word.length > 0) {
      const mentionRegex = /\B\@([\w\-]+)/im;
      const match = word.match(mentionRegex);

      if (match !== null) {

        const buildRegex = "\\B\\@(" + word.replace("@", "") + ")";
        const mentionWordRegex = new RegExp(buildRegex, 'mi');
        const matchWord = this.message.match(mentionWordRegex);

        if (matchWord !== null) {

          this.showMentionList(matchWord);
          this.searchMentionedUsers(matchWord[1]);
        }

      } else {
        this.hideMentionList();
      }
    }
  }

  onInputKeyUp(e: KeyboardEvent, input: any) {
    let wordSelectionned = "";

    wordSelectionned = this.getCurrentWordSelected(input.selectionStart);
    this.startMatching(wordSelectionned);

  }

  onInputClick(input: any) {
    let wordSelectionned = "";

    wordSelectionned = this.getCurrentWordSelected(input.selectionStart);
    this.startMatching(wordSelectionned);

    input.focus();
  }

  async searchMentionedUsers(search: string) {
    if (!search) {
      this.users = [];
    } else {
      this.users = await this.userService.search(search);
    }
  }



  /**
   * Send the input message
   */
  send() {
    if (!this.message && !this.file) {
      return;
    }

    this.fireMessageSent();
    this.clear();
    // TODO émettre  l'évènement "messageSent" via la méthode fireMessageSent
    // TODO vider la zone de saise avec la méthode clear
  }

  /**
   * Set an allowed file to send with the input message
   * @param file The file to send with the message
   */
  setFile(file: File | null) {
    this.file = file;
    if (file == null) {
      this.imgURL = "";
    }
  }

  /**
   * Emit the "messageSent" event
   */
  fireMessageSent() {
    // TODO émettre l'évènement "messageSent"
    this.messageSent.emit({
      message: this.message,
      file: this.file!!,
      date: new Date()
    });
  }

  /**
   * Clear the message to reset the input
   */
  clear() {
    this.message = "";
    this.setFile(null);
    this.inputPopover.hide();
  }
}
