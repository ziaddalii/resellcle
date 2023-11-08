"use client";
import {MessageCard} from "../../common/cards/message.card";
import {TLocale} from "@/interfaces/global.interface";
import {useEffect, useMemo, useState} from "react";
import {ROOT_URL} from "@/api/constants.api";
import {useSocket} from "@/hooks/socket.hooks";
import {ChatMessage, GetChatMessages} from "@/api/interfaces.api";
import {SocketEventCallback} from "@/classes/socket-event-callback.class";
import {SocketEvents} from "@/enums/socket-events.enum";
import SendMessageInput from "../../common/inputs/send-message.inputs";
import {Box} from "@mui/material";
import DefaultAvatar from "@/public/seller/default_avatar.webp";
import {useTranslations} from "use-intl";
import {format_duration_diff_from_months_to_seconds} from "@/util/formatting.util";
import {getCookie} from "cookies-next";

interface Props {
    locale: TLocale;
    id: string;
    token: string;
    ad_chat: GetChatMessages;
}

const SOCKET_PATH = "/v1/ws";

const ChatLog = ({ ad_chat, id, token, locale }: Props) => {
    const user_id = getCookie("user_id");
    const [current_id, set_current_id] = useState(id);
    const [conversation, set_conversation] = useState<ChatMessage[]>(ad_chat.chat_log);

    // SOCKET INIT
    const socket_url = useMemo(() => ROOT_URL + "/chats?chat=" + id, [current_id]);
    const socket_headers = useMemo(
        () => ({
            Authorization: `Bearer ${token}`,
        }),
        [token]
    );

    const socket_events = useMemo(
        () => [
            new SocketEventCallback(SocketEvents.CHATS, (payload?: ChatMessage) => {
                if (!(payload && payload.id)) {
                    return;
                }

                // Check Id in conversation
                if (conversation.findIndex((e) => e.id === payload.id) !== -1) {
                    return;
                }

                set_conversation([...conversation, payload as ChatMessage]);
            }),
        ],
        [conversation]
    );

    const socket_on_connect = () => {
        console.log("has connected");
    };

    const socket_on_error = () => {
        console.log("connection error");
    };

    const socket_on_disconnect = () => {
        console.log("has disconnected");
    };

    useEffect(() => {
        if (id === current_id) {
            return;
        }

        socket.disconnect();

        set_current_id(id);
        set_conversation(ad_chat.chat_log);

        //RECONNECT NEW ID
        rebuild(socket_url);
    }, [ad_chat]);

    //SOCKET
    const { socket, rebuild } = useSocket(
        socket_url,
        SOCKET_PATH,
        socket_headers,
        socket_on_connect,
        socket_on_error,
        socket_on_disconnect,
        socket_events
    );

    const on_update = (new_conversation: ChatMessage[]) => {
        set_conversation(new_conversation);
    };

    return (
        <Box>
            <section className="bg-secondary-100">
                <div className="flex gap-4 items-center bg-black text-white rounded-lg p-4">
                    <img
                        className="rounded-full w-[40px] h-[40px] bg-white rounded-full border-2 border-white"
                        src={
                            user_id === ad_chat.requester.id
                                ? ad_chat.owner.photoUrl !== ""
                                    ? ad_chat.owner.photoUrl
                                    : DefaultAvatar.src
                                : ad_chat.requester.photoUrl !== ""
                                ? ad_chat.requester.photoUrl
                                : DefaultAvatar.src
                        }
                        alt={user_id === ad_chat.requester.id ? ad_chat.owner.full_name : ad_chat.requester.full_name}
                    />
                    <h2 className="text-lg font-bold capitalize">
                        {user_id === ad_chat.requester.id ? ad_chat.owner.full_name : ad_chat.requester.full_name}
                    </h2>
                </div>

                {
                    <ChatList
                        requester_id={ad_chat.requester.id}
                        owner_id={ad_chat.owner.id}
                        conversation={conversation}
                    />
                }
            </section>

            {/*Message Form*/}
            <section className="space-y-4">
                <SendMessageInput id={id} locale={locale} onUpdate={on_update} />
            </section>
        </Box>
    );
};

function ChatList({ conversation, requester_id, owner_id }) {
    const user_id = getCookie("user_id");

    const t = useTranslations();

    const format_duration = (timestamp: string) => format_duration_diff_from_months_to_seconds(timestamp, t);

    const [sender, setSender] = useState("owner");

    useEffect(() => {
        if (user_id === owner_id) {
            setSender("owner");
        } else if (user_id === requester_id) {
            setSender("requester");
        }
    }, []);

    useEffect(() => {
        const element = document.querySelector(".chat-box");
        element.scrollTo(0, element.scrollHeight);
    }, [conversation]);


    return (
        <article className="h-[70vh] md:h-[60vh] overflow-y-scroll px-4 chat-box">
            {conversation.map((item) => {
                return (
                    <div key={item.id}>
                        <MessageCard
                            message={item.message}
                            date_ago={format_duration(item.created_at, t) === "0 seconds" ? "" : `${format_duration(item.created_at, t)} ${t("fields.ago")}`}
                            color={item.by[sender] ? "#00bf63" : "#002F34"}
                            alignment={item.by[sender] ? "right" : "left"}
                        />
                    </div>
                );
            })}
        </article>
    );
}

export default ChatLog;
