import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RoomType } from '../../room.model';
import { RoomService } from '../../services/room.service';

export class CreateRoomFormModel {
  name: string = "";
  type: RoomType = RoomType.Text;
}

@Component({
  selector: 'app-room-create-modal',
  templateUrl: './room-create-modal.component.html',
  styleUrls: ['./room-create-modal.component.less']
})
export class RoomCreateModalComponent implements OnInit {
  @ViewChild("f")
  form: NgForm;
  @Output() roomUpdating = new EventEmitter(); 
  isVisible: boolean = false;
  isLoading: boolean = false;
  model = new CreateRoomFormModel();

  constructor(private roomService: RoomService) {

  }

  ngOnInit(): void {
  }

  async onOk() {
    this.form.ngSubmit.emit();
  }

  /**
   * Method for create a new room in storeData.
   */
  async CreateRoom() {
    if (this.form.form.valid) {
      //=================================================================================
      // TODO invoquer la méthode create du RoomService
      //=================================================================================
      this.isLoading = true;
      try {
        await this.roomService.create(this.model.name, this.model.type)
          .then(res => {
            this.roomUpdating.emit(res);
            this.isLoading = false;
            this.close();
          }).catch(error => {

          });
      } catch (error) {

      } finally {
        this.isLoading = false;
      }
    } else {

      return;
    }
  }

  onCancel() {
    this.close();
  }

  open() {
    this.form.resetForm(new CreateRoomFormModel());
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
