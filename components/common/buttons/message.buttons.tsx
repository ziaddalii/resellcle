"use client";

import DetailsActionButton from "@/components/common/buttons/details-action.button";
import { useTranslations } from "use-intl";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Controller } from "react-hook-form";
import { getError, hasError, minLengthMsg } from "@/components/common/validations/util";
import { z } from "zod";
import { useZod } from "@/hooks/zod.hooks";
import { toggle_loading } from "@/components/common/notifications/global-progress-bar.notification";
import { post_ad_message } from "@/api/requests.api";
import { notify } from "@/components/common/notifications/global-snackbar.notification";
import { MessageFormModel } from "@/api/interfaces.api";
import { GlobalInterface } from "@/interfaces/global.interface";
import EmailIcon from "@mui/icons-material/Email";
import { isString } from "lodash-es";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {useRouter} from "next-intl/client";

interface Props extends GlobalInterface {
    ad_id: string;
}

export const default_chat_form_values = () => {
    return {
        message: "",
    };
};

export default function MsgButton({ locale, ad_id }: Props) {
    const navigate = useRouter();

    const [show, set_show] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClickOpen = () => {
        set_show(true);
    };

    const on_close = () => {
        set_show(false);
    };

    const t = useTranslations();

    const { errors, onSubmit, control, reset } = useZod<MessageFormModel>(
        {
            message: z.string().min(1, minLengthMsg(1, "messages.message", t)),
        },
        default_chat_form_values(),
        async (validatedData: MessageFormModel) => {
            setIsLoading(true);
            await toggle_loading(true);

            const result = await post_ad_message(validatedData, ad_id, locale!);

            if (isString(result)) {
                // notify(true, result);
                navigate.push("/auth/login");
            } else {
                notify(false, t("fields.operation_completed"));
                reset();
                set_show(false);
            }

            await toggle_loading(false);
            setIsLoading(false);
        }
    );

    return (
        <>
            <Button onClick={handleClickOpen} variant="outlined" className="flex gap-2" fullWidth>
            <QuestionAnswerIcon fontSize="small"/>
            {t("messages.send_message")}
            </Button>

            <Dialog open={show} onClose={on_close}>
                <DialogTitle> {t("messages.send_message")}</DialogTitle>

                <DialogContent>
                    <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                multiline
                                minRows={1}
                                maxRows={8}
                                variant="outlined"
                                fullWidth
                                autoFocus
                                margin="dense"
                                id="message"
                                type="text"
                                label={t("messages.message")}
                                placeholder={t("placeholders.enter_message")}
                                error={hasError(errors, "message")}
                                helperText={getError(errors, "message")}
                                disabled={isLoading}
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <Button disabled={isLoading} onClick={on_close}>
                        {t("fields.cancel")}
                    </Button>

                    <Button disabled={isLoading} onClick={onSubmit}>
                        {t("fields.send")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
