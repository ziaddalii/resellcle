import {SocketEvents} from "@/enums/socket-events.enum";

export class SocketEventCallback<T> {
    event: SocketEvents;
    callback: (payload?: T) => void;

    public constructor(event: SocketEvents, callback: (payload?: T) => void) {
        this.event = event;
        this.callback = callback;
    }
}
