"use client";
import {Box, Button, TextField} from "@mui/material";
import {z} from "zod";
import {useZod} from "@/hooks/zod.hooks";
import {GlobalInterface} from "@/interfaces/global.interface";
import {getError, hasError, minLengthMsg} from "../validations/util";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {LoginFormModel} from "@/api/interfaces.api";
import {Controller} from "react-hook-form";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {post_login} from "@/api/requests.api";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {scroll_to_top} from "@/components/common/buttons/floating-arrow.button";
import {set_cookies_after_login} from "@/api/cookies.api";
import {toLower} from "lodash-es";

interface Props extends GlobalInterface {}

export const default_login_form_values = () => {
    return {
        username_or_phone: "",
        password: "",
    };
};

export default function LoginForm({locale}: Props) {
    
    const t = useTranslations();
    
    const [isLoading, setIsLoading] = useState(false);
    
    // Handling Form
    const {errors, onSubmit, control, reset} = useZod<LoginFormModel>(
        {
            username_or_phone: z.string(),
            password: z.string().min(8, minLengthMsg(8, "fields.password", t)),
        },
        default_login_form_values(),
        async (validated_data: LoginFormModel) => {
            
            setIsLoading(true);
            await toggle_loading(true);
            scroll_to_top();
            
            const result = await post_login({
                ...validated_data,
                username_or_phone: toLower(validated_data.username_or_phone),
            }, locale!);
            
            if (typeof result === "string") {
                notify(true, result);
            } else {
                notify(false, t("fields.operation_completed"));
                reset();
    
                set_cookies_after_login(result.token.accessToken, result.token.expiresAt, result.user.seller.id);
                localStorage.setItem("favorites", JSON.stringify(result.user.favorites));

                //FULL PAGE RELOAD
                window.location.replace("/");
            }
            
            await toggle_loading(false);
            setIsLoading(false);
        }
    );
    
    return (
        <Box className="space-y-8" onSubmit={onSubmit} component="form">
            
            {/*Email*/}
            <Controller
                name="username_or_phone"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        id="username_or_phone"
                        type="text"
                        label={t("fields.email_phone")}
                        placeholder={t("placeholders.enter_email_phone")}
                        error={hasError(errors, "username_or_phone")}
                        helperText={getError(errors, "username_or_phone")}
                        disabled={isLoading}
                    />
                )}
            />
            
            <Controller
                name="password"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        title={t("fields.password")}
                        fullWidth
                        id="password"
                        type="password"
                        label={t("fields.password")}
                        placeholder={t("placeholders.enter_password")}
                        error={hasError(errors, "password")}
                        helperText={getError(errors, "password")}
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
