import {io, ManagerOptions, Socket, SocketOptions} from "socket.io-client";
import CommonUtil from "@/util/common";

export default class SocketIoHandler {

    public static build = (url: string, path = "", headers = {}): Socket => {
        const options: Partial<ManagerOptions & SocketOptions> = {
            autoConnect: false,
            reconnectionDelay: 5000, // 5 SECONDS
            reconnectionAttempts: 10, // 10 TIMES
            reconnection: true,
        };

        if (path) {
            options.path = path;
        }

        if (!CommonUtil.isObjEmpty(headers)) {
            options.extraHeaders = headers;
        }

        return io(url, options);
    };

    public static onConnect = (socket: Socket, callback: () => void) => {
        socket.on("connect", callback);
    };

    public static onDisconnect = (socket: Socket, callback: () => void) => {
        socket.on("disconnect", callback);
    };

    public static onConnectError = (socket: Socket, callback: () => void) => {
        socket.on("connect_error", callback);
    };
}
