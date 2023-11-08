"use client";
import {Box, Button, TextField} from "@mui/material";
import {z} from "zod";
import {useZod} from "@/hooks/zod.hooks";
import {GlobalInterface} from "@/interfaces/global.interface";
import {getError, hasError, minLengthMsg} from "../validations/util";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {SellerProfileForm} from "@/api/interfaces.api";
import {Controller} from "react-hook-form";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {post_update_profile} from "@/api/requests.api";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {zPhoto} from "../validations/photo";
import InputImage from "../inputs/image.inputs";
import {useRouter} from "next-intl/client";

interface Props extends GlobalInterface {
    default_values: {
        logo: string;
        en_name: string;
        ar_name: string;
        en_description: string;
        ar_description: string;
    }
};

function build_form_data(default_values: SellerProfileForm, validated_data: SellerProfileForm) {

    const form_data = new FormData();

    if (validated_data.logo instanceof File) {
        form_data.append("seller[logo]", validated_data.logo);
    }

    if (validated_data.en_name !== default_values.en_name) {
        form_data.append("seller[en_name]", validated_data.en_name);
    }

    if (validated_data.ar_name !== default_values.ar_name) {
        form_data.append("seller[ar_name]", validated_data.ar_name);
    }

    if (validated_data.en_description !== default_values.ar_description) {
        form_data.append("seller[en_description]", validated_data.en_description);
    }

    if (validated_data.ar_description !== default_values.ar_description) {
        form_data.append("seller[ar_description]", validated_data.ar_description);
    }

    return form_data;
}

const SellerProfileForm = ({default_values, locale}: Props) => {

    const t = useTranslations();
    const navigate = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    // Handling Form
    const {errors, onSubmit, control, getValues, reset} = useZod<SellerProfileForm>(
            {
                logo: zPhoto(false, "fields.photo", t),
                en_name: z.string().min(3, minLengthMsg(3, "fields.store_name_en", t)),
                ar_name: z.string().min(3, minLengthMsg(3, "fields.store_name_ar", t)),
                en_description: z.string().min(3, minLengthMsg(3, "fields.en_desc", t)),
                ar_description: z.string().min(3, minLengthMsg(3, "fields.ar_desc", t)),
            },
            default_values,
            async (validatedData: SellerProfileForm) => {

                setIsLoading(true);
                await toggle_loading(true);

                const payload = build_form_data(default_values, validatedData);

                //SEND IF PAYLOAD HAVE KEYS
                if (payload.entries().next().done) {
                    window.location.replace("/auth/account");
                }

                const result = await post_update_profile(
                        payload,
                        locale!,
                );

                if (result) {
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

    const on_logo_submit = (file: File): void => {
        control._formValues.logo = file;
    };

    return (
            <Box className="!space-y-4" onSubmit={onSubmit} component="form">

                {/* Logo */}
                <Controller
                        name="logo"
                        control={control}
                        render={() => (
                                <InputImage
                                        t={t}
                                        id="logo"
                                        init={getValues("logo")}
                                        disabled={isLoading}
                                        hasError={hasError(errors, "logo")}
                                        error={getError(errors, "logo")}
                                        onImageSubmit={on_logo_submit}
                                />
                        )}
                />

                <p>{t("fields.extensions_accepted")}</p>

                {/* NAME (EN) */}
                <Controller
                        name="en_name"
                        control={control}
                        render={({field}) => (
                                <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        id="en_name"
                                        type="text"
                                        label={t("fields.store_name_en")}
                                        title={t("fields.store_name_en")}
                                        placeholder={t("placeholders.enter_name")}
                                        error={hasError(errors, "en_name")}
                                        helperText={getError(errors, "en_name")}
                                        disabled={isLoading}
                                />
                        )}
                />

                {/* NAME (AR) */}
                <Controller
                        name="ar_name"
                        control={control}
                        render={({field}) => (
                                <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        id="ar_name"
                                        type="text"
                                        label={t("fields.store_name_ar")}
                                        placeholder={t("placeholders.enter_name")}
                                        error={hasError(errors, "ar_name")}
                                        helperText={getError(errors, "ar_name")}
                                        disabled={isLoading}
                                />
                        )}
                />

                {/* Description (EN) */}
                <Controller
                        name="en_description"
                        control={control}
                        render={({field}) => (
                                <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        id="text"
                                        type="text"
                                        label={t("fields.en_desc")}
                                        placeholder={t("placeholders.enter_description")}
                                        error={hasError(errors, "en_description")}
                                        helperText={getError(errors, "en_description")}
                                        disabled={isLoading}
                                />
                        )}
                />

                {/* Description (AR) */}
                <Controller
                        name="ar_description"
                        control={control}
                        render={({field}) => (
                                <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        id="ar_description"
                                        type="text"
                                        label={t("fields.ar_desc")}
                                        placeholder={t("placeholders.enter_description")}
                                        error={hasError(errors, "ar_description")}
                                        helperText={getError(errors, "ar_description")}
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

export default SellerProfileForm;
