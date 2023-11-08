"use client";
import {Box, Button, TextField} from "@mui/material";
import {z} from "zod";
import {useZod} from "@/hooks/zod.hooks";
import {GlobalInterface} from "@/interfaces/global.interface";
import {emailMsg, getError, hasError, minLengthMsg} from "../validations/util";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {PersonalInfoForm, PersonalInfoModel} from "@/api/interfaces.api";
import {Controller} from "react-hook-form";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {post_update_profile} from "@/api/requests.api";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {zPhoto} from "../validations/photo";
import InputImage from "../inputs/image.inputs";
import {isString} from "lodash-es";
import {useRouter} from "next-intl/client";
import {scroll_to_top} from "@/components/common/buttons/floating-arrow.button";

interface Props extends GlobalInterface {
    original_personal_info: PersonalInfoModel;
}

function build_form_data(validatedData: PersonalInfoForm, original_personal_info: PersonalInfoModel) {
    const form_data = new FormData();

    if (validatedData.photo && validatedData.photo instanceof File) {
        form_data.append("photo", validatedData.photo);
    }

    if (validatedData.first_name !== original_personal_info.names.first) {
        form_data.append("first_name", validatedData.first_name);
    }

    if (validatedData.last_name !== original_personal_info.names.last) {
        form_data.append("last_name", validatedData.last_name);
    }

    if (validatedData.email !== original_personal_info.username) {
        form_data.append("username", validatedData.email);
    }

    if (validatedData.phone !== original_personal_info.phone) {
        form_data.append("phone_number", validatedData.phone);
    }

    return form_data;
}

const PersonalInfoForm = ({ original_personal_info, locale }: Props) => {
    const t = useTranslations();
    const navigate = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { errors, onSubmit, control, reset } = useZod<PersonalInfoForm>(
        {
            photo: zPhoto(false, "fields.photo", t),
            first_name: z.string().min(3, minLengthMsg(3, "fields.first_name", t)),
            last_name: z.string().min(3, minLengthMsg(3, "fields.last_name", t)),
            email: z.string().email(emailMsg("fields.email", t)),
            phone: z.string().min(11, minLengthMsg(11, "fields.phone", t)).regex(/^\d+$/),
        },
        {
            photo: original_personal_info.photoUrl,
            first_name: original_personal_info.names.first,
            last_name: original_personal_info.names.last,
            email: original_personal_info.username,
            phone: original_personal_info.phone,
        },
        async (validatedData: PersonalInfoForm) => {
            setIsLoading(true);

            await toggle_loading(true);

            scroll_to_top();

            const result = await post_update_profile(build_form_data(validatedData, original_personal_info), locale!);

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

    const onImageSubmit = (file: File): void => {
        control._formValues.photo = file;
    };

    return (
        <Box className="space-y-8" onSubmit={onSubmit} component="form">
            {/* Photo */}
            <Controller
                name="photo"
                control={control}
                render={() => (
                    <InputImage
                        t={t}
                        id="personal_info_image"
                        init={original_personal_info.photoUrl}
                        disabled={isLoading}
                        hasError={hasError(errors, "photo")}
                        error={getError(errors, "photo")}
                        onImageSubmit={onImageSubmit}
                    />
                )}
            />

            {/*First Name*/}
            <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        id="first_name"
                        type="text"
                        label={t("fields.first_name")}
                        title={t("fields.first_name")}
                        placeholder={t("placeholders.enter_first_name")}
                        error={hasError(errors, "first_name")}
                        helperText={getError(errors, "first_name")}
                        disabled={isLoading}
                    />
                )}
            />

            {/*Last Name*/}
            <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        id="last_name"
                        type="text"
                        label={t("fields.last_name")}
                        placeholder={t("placeholders.enter_last_name")}
                        error={hasError(errors, "last_name")}
                        helperText={getError(errors, "last_name")}
                        disabled={isLoading}
                    />
                )}
            />

            {/*E-mail*/}
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        id="email"
                        type="text"
                        label={t("fields.email")}
                        placeholder={t("placeholders.enter_email")}
                        error={hasError(errors, "email")}
                        helperText={getError(errors, "email")}
                        disabled={isLoading}
                    />
                )}
            />
            {/* Phone Number */}
            <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        id="phone"
                        type="text"
                        label={t("fields.phone")}
                        placeholder={t("placeholders.enter_phone")}
                        error={hasError(errors, "phone")}
                        helperText={getError(errors, "phone")}
                        disabled={isLoading}
                    />
                )}
            />

            <Button disabled={isLoading} type="submit" variant="contained" sx={{ color: "white" }}>
                {t("fields.submit")}
            </Button>
        </Box>
    );
};

export default PersonalInfoForm;
