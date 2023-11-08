import {useEffect, useState} from "react";
import SocketIoHandler from "@/util/socket-io-handler.api";
import {SocketEventCallback} from "@/classes/socket-event-callback.class";
import {Socket} from "socket.io-client";

/** Hook for socket io */
export const useSocket = (
        url: string,
        path = "",
        headers = {},
        onConnect?: () => void,
        onConnectError?: () => void,
        onDisconnect?: () => void,
        events?: SocketEventCallback<any>[],
    ) => {
        const [socket, set_socket] = useState<Socket>(
            SocketIoHandler.build(url, path, headers),
        );
        const [isConnected, setIsConnected] = useState<boolean>(false);
        
        useEffect(() => {
            //RUN ONCE
            if (!isConnected) {
                //START CONNECTION
                socket.connect();
                setIsConnected(true);
                
                if (onConnect) {
                    SocketIoHandler.onConnect(socket, onConnect);
                }
                
                if (onConnectError) {
                    SocketIoHandler.onConnectError(socket, onConnectError);
                }
                
                if (onDisconnect) {
                    SocketIoHandler.onDisconnect(socket, onDisconnect);
                }
                
                //LISTEN
                if (events) {
                    events.forEach(e => {
                        socket.on(e.event, e.callback);
                    });
                }
            }
            
            //AUTO DISCOUNT WITH COMPONENT UNMOUNT
            return () => {
                if (!socket.disconnected) {
                    socket.disconnect();
                    setIsConnected(false);
                }
            };
        }, [isConnected, socket, set_socket, onConnect, onConnectError, onDisconnect, events]);
        
        const rebuild = (
            new_url?: string,
            new_path = "",
            new_headers = {},
            // new_on_connect?: () => void,
            // new_on_connectError?: () => void,
            // new_on_disconnect?: () => void,
            // new_events?: SocketEventCallback<any>[],
        ) => {
            
            set_socket(
                SocketIoHandler.build(
                    new_url ?? url,
                    new_path ?? path,
                    new_headers ?? headers,
                ),
            );
            setIsConnected(false);
        };
        
        return {
            socket,
            rebuild,
        };
    }
;
