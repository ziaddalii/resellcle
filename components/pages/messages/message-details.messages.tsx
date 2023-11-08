"use server";

import { GlobalInterface } from "@/interfaces/global.interface";
import { get_chat_messages } from "@/api/requests.api";
import ChatLog from "@/components/pages/messages/chat.log";
import { cookies } from "next/headers";

interface Props extends GlobalInterface {}

export default async function MessageDetails({ message_id, locale }: Props) {
    const ad_chat = await get_chat_messages(message_id);

    const token = await cookies().get("token");

    return (
        <section>
            {/*Chat Section*/}
            <ChatLog id={message_id} token={token?.value ?? ""} locale={locale} ad_chat={ad_chat} />
        </section>
    );
}
