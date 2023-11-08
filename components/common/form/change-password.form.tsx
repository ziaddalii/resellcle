// noinspection TypeScriptValidateTypes

"use client";
import {Box, Button, TextField} from "@mui/material";
import {z} from "zod";
import {useZod} from "@/hooks/zod.hooks";
import {GlobalInterface} from "@/interfaces/global.interface";
import {getError, hasError, minLengthMsg} from "../validations/util";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {ChangePasswordForm} from "@/api/interfaces.api";
import {Controller} from "react-hook-form";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {post_update_profile} from "@/api/requests.api";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {passwordConfirmMsg} from "@/components/common/validations/util";
import {useRouter} from "next-intl/client";
import {scroll_to_top} from "@/components/common/buttons/floating-arrow.button";
import {isString} from "lodash-es";

function build_form_data(validatedData: ChangePasswordForm) {
    const form_data = new FormData();
    form_data.append("old_password", validatedData.old_password);
    form_data.append("password", validatedData.password);
    form_data.append("confirm_password", validatedData.confirm_password);

    return form_data;
}

interface Props extends GlobalInterface {
}

const ChangePasswordForm = ({locale}: Props) => {
    const t = useTranslations();
    const navigate = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const {errors, onSubmit, control, getValues, reset} = useZod<ChangePasswordForm>(
            {
                old_password: z.string().min(8, minLengthMsg(8, "fields.old_password", t)),
                password: z.string().min(8, minLengthMsg(8, "fields.new_password", t)),
                confirm_password: z.string()
                        .min(6, minLengthMsg(8, "fields.confirm_password", t))
                        .refine(
                                (arg: string) => {
                                    const password: string = getValues("password");
                                    return arg === password;
                                },
                                passwordConfirmMsg("fields.confirm_password", t),
                        ),
            },
            {
                old_password: "",
                password: "",
                confirm_password: "",
            },
            async (validatedData: ChangePasswordForm) => {

                setIsLoading(true);

                await toggle_loading(true);

                scroll_to_top();

                const result = await post_update_profile(
                        build_form_data(validatedData),
                        locale!,
                );

                if (isString(result)) {
                    notify(true, result);
                } else {
                    notify(false, t("fields.operation_completed"));
                    setTimeout(() => {
                        // navigate.replace("/auth/account");
                        // reset();
                        window.location.replace("/auth/account");
                    }, 1000);
                }

                await toggle_loading(false);
                setIsLoading(false);
            }
    );

    return (
            <Box className="space-y-8" onSubmit={onSubmit} component="form">

                {/*Old Password*/}
                <Controller
                        name="old_password"
                        control={control}
                        render={({field}) => (
                                <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        id="old_password"
                                        type="password"
                                        label={t("fields.old_password")}
                                        title={t("fields.old_password")}
                                        placeholder={t("placeholders.enter_password")}
                                        error={hasError(errors, "old_password")}
                                        helperText={getError(errors, "old_password")}
                                        disabled={isLoading}
                                />
                        )}
                />

                {/*New Password*/}
                <Controller
                        name="password"
                        control={control}
                        render={({field}) => (
                                <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        id="password"
                                        type="password"
                                        label={t("fields.new_password")}
                                        title={t("fields.new_password")}
                                        placeholder={t("placeholders.enter_password")}
                                        error={hasError(errors, "password")}
                                        helperText={getError(errors, "password")}
                                        disabled={isLoading}
                                />
                        )}
                />

                {/*Confirm Password*/}
                <Controller
                        name="confirm_password"
                        control={control}
                        render={({field}) => (
                                <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        id="confirm_password"
                                        type="password"
                                        label={t("fields.confirm_password")}
                                        placeholder={t("placeholders.enter_confirm_password")}
                                        error={hasError(errors, "confirm_password")}
                                        helperText={getError(errors, "confirm_password")}
                                        disabled={isLoading}
                                />
                        )}
                />

                <Button disabled={isLoading} type="submit" variant="contained" sx={{color: "white"}}>
                    {t("fields.submit")}
                </Button>

            </Box>
    );
};

export default ChangePasswordForm;
