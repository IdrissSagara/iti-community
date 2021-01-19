import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  roomId$: Observable<string | undefined>;

  rooms: Room[];

  constructor(private feedStore: FeedStore, private queries: RoomQueries, private route: ActivatedRoute,
              private roomService: RoomService, private router: Router) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {
     //===================================================
    // On récupere le dernier room visiter.
    //===================================================
    let lastRoom = localStorage.getItem('LastRoomSee');
    this.rooms = await this.queries.getAll();    

    var roomSee  =  this.rooms.find(w=>w.id===lastRoom);
    
    if(roomSee == undefined){
      this.goToRoom(this.rooms[0]);
    }else{
      this.goToRoom(roomSee);
    }
  }

  goToRoom(room: Room) {
    //===================================================
    // Sauvegarde le dernier room consulter.
    //===================================================
    localStorage.setItem('LastRoomSee', room.id);
    // TODO naviguer vers app/[id de la room]
    this.router.navigate([`/${room.id}`]);
  }

  /**
   * Methode qui rajoute un nouvel room dans la liste.
   * @param room 
   */
  RefreshRooms(room: Room){
    this.rooms.push(room);
  }
  

}
