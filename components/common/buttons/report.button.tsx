"use client";

import DetailsActionButton from "@/components/common/buttons/details-action.button";
import {useTranslations} from "use-intl";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import {useState} from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {Controller} from "react-hook-form";
import {getError, hasError, minLengthMsg} from "@/components/common/validations/util";
import {z} from "zod";
import {useZod} from "@/hooks/zod.hooks";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {scroll_to_top} from "@/components/common/buttons/floating-arrow.button";
import {post_ad_report} from "@/api/requests.api";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {AdReportModel} from "@/api/interfaces.api";
import {GlobalInterface} from "@/interfaces/global.interface";
import {isString} from "lodash-es";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import { IconButton } from "@mui/material";

interface Props extends GlobalInterface {
    ad_id: string;
}

export function ReportButton({locale, ad_id}: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    const t = useTranslations();
    
    const {errors, onSubmit, control, reset} = useZod<AdReportModel>(
        {
            reason: z.string().min(8, minLengthMsg(8, "fields.report", t)),
        },
        {
            reason: "",
        },
        async (validatedData: AdReportModel) => {
            
            setIsLoading(true);
            await toggle_loading(true);
            scroll_to_top();
            
            const body = {reason: validatedData.reason};
            const result = await post_ad_report(body, ad_id, locale!);
            if (isString(result)) {
                notify(true, result);
            } else {
                notify(false, t("fields.operation_completed"));
                reset();
                setOpen(false);
            }
            await toggle_loading(false);
            setIsLoading(false);
        }
    );
    return (
        <>
            <Button
                color="error"
                label={t!("fields.report_ad")}
                onClick={handleClickOpen}
                className="!text-xs"
                startIcon={<EmojiFlagsIcon/>}
            >{t("fields.report_ad")}</Button>
            
            <Dialog open={open} onClose={handleClose}>
                
                <DialogTitle> {t("fields.report_ad")}</DialogTitle>
                
                <DialogContent>
                    <Controller
                        name="reason"
                        control={control}
                        render={({field}) => (
                            <TextField
                                {...field}
                                multiline
                                minRows={1}
                                maxRows={8}
                                variant="outlined"
                                fullWidth
                                autoFocus
                                margin="dense"
                                id="reason"
                                type="text"
                                label={t("fields.report_ad")}
                                placeholder={t("placeholders.enter_reason")}
                                error={hasError(errors, "reason")}
                                helperText={getError(errors, "reason")}
                                disabled={isLoading}
                            />
                        )}
                    />
                </DialogContent>
                
                <DialogActions>
                    <Button disabled={isLoading} onClick={handleClose}>{t("fields.cancel")}</Button>
                    <Button disabled={isLoading} onClick={onSubmit}>{t("fields.send")}</Button>
                </DialogActions>
                
            </Dialog>
        </>
    );
}
