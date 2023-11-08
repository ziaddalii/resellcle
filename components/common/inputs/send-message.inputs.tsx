import { Box, Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, useEffect, useState } from "react";
import { post_chat_message } from "@/api/requests.api";
import { notify } from "../notifications/global-snackbar.notification";
import { GlobalInterface } from "@/interfaces/global.interface";
import { useTranslations } from "next-intl";
import { isString } from "lodash-es";

interface Props extends GlobalInterface {
    id: string;
    onUpdate: Function;
}

export interface BodyInterface {
    message: string;
}

const SendMessageInput = ({ id, locale, onUpdate }: Props) => {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageValue, setMessageValue] = useState<string>("");

    const handleSend = async (e: ChangeEvent<HTMLInputElement>) => {

        setIsLoading(true);

        const body = {
            message: messageValue,
        };

        const result = await post_chat_message(body, id, locale!);

        if (isString(result)) {
            notify(true, result);
        } else {
            notify(false, t("fields.operation_completed"));
            setMessageValue("");
            onUpdate(result.data.chat_log);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (messageValue === "") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [messageValue]);

    function onEnterKeyPress(event) {
        if (event.key === "Enter") {
            handleSend(event);
        }
    }

    return (
        <Box component={"form"} className="flex" onSubmit={(e) => handleSend(e)} onKeyPress={onEnterKeyPress}>
            <TextField
                id="chat-input"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                multiline
                minRows={1}
                maxRows={8}
                sx={{ borderRadius: 8, backgroundColor: "white" }}
                className="border h-full border-contrast text-gray-900
                text-sm-[4px] focus:border-blue-500 block w-full p-2.5"
                title={t("messages.reply")}
                label={t("messages.reply")}
                placeholder={t("placeholders.enter_reply")}
                variant="outlined"
            />
            <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ borderEndEndRadius: 16, borderStartEndRadius: 16 }}
                className="h-14"
                disabled={isLoading}
            >
                <SendIcon width="256" height="256" />
            </Button>
        </Box>
    );
};

export default SendMessageInput;
