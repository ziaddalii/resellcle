"use client";
import {Button, Container, TextField} from "@mui/material";
import {z} from "zod";
import {useZod} from "@/hooks/zod.hooks";
import {GlobalInterface} from "@/interfaces/global.interface";
import {emailMsg, getError, hasError, minLengthMsg} from "../validations/util";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {ContactUsFormModel} from "@/api/interfaces.api";
import {Controller} from "react-hook-form";
import {FormSelect, SelectModel} from "@/components/common/form/select.form";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {post_contact_us} from "@/api/requests.api";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {scroll_to_top} from "@/components/common/buttons/floating-arrow.button";

interface Props extends GlobalInterface {
    service_types: SelectModel[];
}

export const defaultContactUsValues = () => {
    return {
        email: "",
        name: "",
        phone_number: "",
        service_type: "",
        body: "",
    };
};

const ContactUsForm = ({service_types, locale}: Props) => {
    
    const t = useTranslations();
    
    const [isLoading, setIsLoading] = useState(false);
    
    // const recaptchaRef = useRef<HTMLElement | null>(null);
    // const [captcha, set_captcha] = useState<boolean>();
    
    // Handling Form
    const {errors, onSubmit, control, reset} = useZod<ContactUsFormModel>(
        {
            email: z.string().email(emailMsg("fields.email", t)),
            
            name: z.string().min(3, minLengthMsg(3, "fields.name", t)),
            
            phone_number: z.string().min(11, minLengthMsg(11, "fields.phone", t)).regex(/^\d+$/),
            
            service_type: z.string().min(1, minLengthMsg(3, "contact_us.service_type", t)),
            
            body: z.string().min(3, minLengthMsg(3, "contact_us.enquiry", t)),
        },
        defaultContactUsValues(),
        async (validatedData: ContactUsFormModel) => {
            
            // if (!captcha) {
            //     return;
            // }
            
            setIsLoading(true);
            
            await toggle_loading(true);
            scroll_to_top();
            
            const result = await post_contact_us(validatedData, locale!);
            if (result) {
                notify(true, result);
            } else {
                notify(false, t("fields.operation_completed"));
                reset();
            }
            
            await toggle_loading(false);
            setIsLoading(false);
        }
    );
    
    return (
        <Container maxWidth="lg" className="space-y-8" onSubmit={onSubmit} component="form">
            
            {/*Email*/}
            <Controller
                name="email"
                control={control}
                render={({field}) => (
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
            
            {/*Name*/}
            <Controller
                name="name"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        id="name"
                        type="text"
                        label={t("fields.name")}
                        placeholder={t("placeholders.enter_name")}
                        error={hasError(errors, "name")}
                        helperText={getError(errors, "name")}
                        disabled={isLoading}
                    />
                )}
            />
            
            {/*Phone Number*/}
            <Controller
                name="phone_number"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        id="phone_number"
                        type="text"
                        label={t("fields.phone")}
                        placeholder={t("placeholders.enter_phone")}
                        error={hasError(errors, "phone_number")}
                        helperText={getError(errors, "phone_number")}
                        disabled={isLoading}
                    />
                )}
            />
            
            {/*Service Type*/}
            <Controller
                name="service_type"
                control={control}
                render={({field}) => (
                    <FormSelect<string>
                        id="service_type"
                        field={field}
                        fullWidth
                        label={t("contact_us.service_type")}
                        placeholder={t("placeholders.select_service_type")}
                        items={service_types}
                        variant="outlined"
                        locale={locale}
                        disabled={isLoading}
                        error={hasError(errors, "service_type")}
                    />
                )}
            />
            
            {/*Body*/}
            <Controller
                name="body"
                control={control}
                render={({field}) => (
                    <TextField
                        sx={{marginBottom: ".5rem"}}
                        {...field}
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={8}
                        id="outlined-multiline-flexible"
                        type="text"
                        label={t("contact_us.enquiry")}
                        placeholder={t("placeholders.enter_enquiry")}
                        error={hasError(errors, "body")}
                        helperText={getError(errors, "body")}
                        disabled={isLoading}
                    />
                )}
            />

            {/*Recaptcha*/}
            {/*<ReCAPTCHA*/}
            {/*    sitekey={process.env.RECAPTCHA_SITE_KEY}*/}
            {/*    ref={recaptchaRef}*/}
            {/*    onChange={(token) => set_captcha(isString(token))}*/}
            {/*/>*/}
            
            <Button disabled={isLoading} type="submit" variant="contained" sx={{color: "white"}}>
                {t("fields.submit")}
            </Button>
        
        </Container>
    );
};

export default ContactUsForm;
