import { Injectable } from '@angular/core';
import { Room, RoomType } from '../room.model';
import { RoomStore } from '../room.store';
import { HttpRoomCommands } from './plateform/http/room.commands.http';
import { HttpRoomQueries } from './plateform/http/room.queries.http';
import { RoomCommands } from './room.commands';
import { RoomQueries } from './room.queries';

@Injectable()
export class RoomService {
    constructor(private commands: HttpRoomCommands, private queries: HttpRoomQueries, private store: RoomStore) {
    }

    async create(name: string, type: RoomType): Promise<Room> {
        const room = await this.commands.create(name, type);
        this.store.mutate( s => {
            return {
                ...s,
                rooms: [...s.rooms, room]
            }
        })
        return room;
    }
    

    async fetch(): Promise<void> {
        const rooms = await this.queries.getAll();
        console.log(rooms);
        this.store.mutate(s => {
            return {
                ...s,
                rooms
            }
        });
    }
}