/* eslint-disable react-hooks/exhaustive-deps */
// noinspection TypeScriptValidateTypes

"use client";

import {Box, Button, TextField} from "@mui/material";
import SectionLabelText from "@/components/common/texts/section-label.text";
import {useTranslations} from "use-intl";
import {Controller} from "react-hook-form";
import {useEffect, useState} from "react";
import {useZod} from "@/hooks/zod.hooks";
import {getError, hasError, minLengthMsg, passwordConfirmMsg} from "@/components/common/validations/util";
import {post_register_form} from "@/api/requests.api";
import {FormSelect, SelectModel} from "@/components/common/form/select.form";
import {RegisterFormModel} from "@/api/interfaces.api";
import {GlobalInterface} from "@/interfaces/global.interface";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {CityData, ProvinceData} from "@/app/[locale]/auth/register/page";
import InputImage from "@/components/common/inputs/image.inputs";
import {zPhoto} from "@/components/common/validations/photo";
import {z} from "zod";
import {useRouter} from "next-intl/client";
import {scroll_to_top} from "@/components/common/buttons/floating-arrow.button";
import {zPhoneNumber} from "@/components/common/validations/phone";
import {toLower} from "lodash-es";

export const defaultRegisterValues = () => {
    return {
        photo: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
        region: "",
        province: "",
        city: "",
    };
};

interface Props extends GlobalInterface {
    countries: SelectModel[];
    provinces: ProvinceData[];
    cities: CityData[];
}

function build_form_data(validatedData: RegisterFormModel) {
    const form_data = new FormData();
    
    if (validatedData.photo) {
        form_data.append("photo", validatedData.photo);
    }
    
    form_data.append("first_name", validatedData.first_name);
    form_data.append("last_name", validatedData.last_name);
    form_data.append("email", toLower(validatedData.email));
    form_data.append("phone_number", validatedData.phone_number);
    form_data.append("password", validatedData.password);
    // form_data.append("confirm_password", validatedData.confirm_password);
    // form_data.append("region", validatedData.region);
    // form_data.append("province", validatedData.province);
    
    if (validatedData.city) {
        form_data.append("city", validatedData.city);
    }
    
    return form_data;
}

export function RegisterFormSection({countries, provinces, cities, locale}: Props) {
    const t = useTranslations();
    const navigate = useRouter();
    
    const [isLoading, setIsLoading] = useState(false);
    const [provincesData, setProvincesData] = useState<ProvinceData[]>([]);
    const [citiesData, setCitiesData] = useState<CityData[]>([]);
    
    const [locationMinLength, setLocationMinLength] = useState<number>(0);
    
    // const recaptchaRef = useRef<HTMLElement | null>(null);
    // const [captcha, set_captcha] = useState<boolean>();
    
    // Handling Form
    const {errors, onSubmit, control, getValues, setValue, watch, reset} = useZod<RegisterFormModel>(
        {
            photo: zPhoto(false, "fields.photo", t),
            
            first_name: z.string().min(3, minLengthMsg(3, "fields.first_name", t)),
            
            last_name: z.string().min(3, minLengthMsg(3, "fields.last_name", t)),
            
            email: z.string().min(3, minLengthMsg(3, "fields.email", t)).email(),
            
            phone_number: zPhoneNumber("fields.phone", t),
            
            region: z.string().min(locationMinLength, minLengthMsg(locationMinLength, "fields.region", t)),
            
            province: z.string().min(locationMinLength, minLengthMsg(locationMinLength, "fields.province", t)),
            
            city: z.string().min(locationMinLength, minLengthMsg(locationMinLength, "fields.city", t)),
            
            password: z.string().min(8, minLengthMsg(8, "fields.password", t)),
            
            confirm_password: z
                .string()
                .min(6, minLengthMsg(8, "fields.confirm_password", t))
                .refine((arg: string) => {
                    const password: string = getValues("password");
                    return arg === password;
                }, passwordConfirmMsg("fields.confirm_password", t)),
        },
        defaultRegisterValues(),
        async (validatedData: RegisterFormModel) => {
            
            setIsLoading(true);
            
            await toggle_loading(true);
            scroll_to_top();
            
            const result = await post_register_form(build_form_data(validatedData), locale!);
            
            if (result) {
                notify(true, result);
            } else {
                notify(false, t("fields.operation_completed"));
                setTimeout(() => {
                    reset();
                    navigate.replace("/auth/login");
                }, 1000);
            }
            
            await toggle_loading(false);
            setIsLoading(false);
        }
    );
    
    useEffect(() => {
        const region = getValues("region");
        const filteredProvinces = provinces.filter((province) => {
            return province.country.id === region;
        });
        setProvincesData(filteredProvinces);
    }, [watch("region")]);
    
    useEffect(() => {
        const province = getValues("province");
        const filteredCities = cities.filter((city) => {
            return city.province.id === province;
        });
        setCitiesData(filteredCities);
    }, [watch("province")]);
    
    const onImageSubmit = (file: File): void => {
        control._formValues.photo = file;
    };
    
    useEffect(() => {
        const region = getValues("region");
        region !== "" ? setLocationMinLength(1) : setLocationMinLength(0);
    }, [watch("region")]);
    
    useEffect(() => {
        locationMinLength === 0 && setValue("province", "");
        setValue("city", "");
    }, [locationMinLength]);
    return (
        <Box className="space-y-4" onSubmit={onSubmit} component="form">
            {/*Personal Info Section*/}
            <SectionLabelText label={t("register.your_personal_details")}/>
            
            {/*InputImage*/}
            <Controller
                name="photo"
                control={control}
                render={() => (
                    <InputImage
                        t={t}
                        id="register_image"
                        init=""
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
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        title={t("fields.first_name")}
                        fullWidth
                        id="first_name"
                        type="text"
                        label={t("fields.first_name")}
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
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        title={t("fields.last_name")}
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
            
            {/*Email*/}
            <Controller
                name="email"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        title={t("fields.email")}
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
            
            {/*Phone Number*/}
            <Controller
                name="phone_number"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        title={t("fields.phone")}
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
            
            {/*Password Section*/}
            <SectionLabelText label={t("fields.your_password")}/>
            
            {/*Password*/}
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
            
            {/*Confirm Password*/}
            <Controller
                name="confirm_password"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        title={t("fields.confirm_password")}
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
            
            {/*Location Section*/}
            <SectionLabelText label={t("register.your_location")}/>
            
            {/*Country*/}
            <Controller
                name="region"
                control={control}
                render={({field}) => (
                    <FormSelect<string>
                        id="region"
                        field={field}
                        fullWidth
                        label={t("fields.region")}
                        placeholder={t("placeholders.select_region")}
                        items={countries}
                        variant="outlined"
                        disabled={isLoading}
                        error={hasError(errors, "region")}
                    />
                )}
            />
            
            {/*Province*/}
            <Controller
                name="province"
                control={control}
                render={({field}) => (
                    <FormSelect<string>
                        id="province"
                        field={field}
                        fullWidth
                        label={t("fields.province")}
                        placeholder={t("placeholders.select_service_type")}
                        items={provincesData}
                        variant="outlined"
                        disabled={isLoading || provincesData.length === 0}
                        error={hasError(errors, "province")}
                    />
                )}
            />
            
            {/*City*/}
            <Controller
                name="city"
                control={control}
                render={({field}) => (
                    <FormSelect<string>
                        id="city"
                        field={field}
                        fullWidth
                        label={t("fields.city")}
                        placeholder={t("placeholders.select_service_type")}
                        items={citiesData}
                        variant="outlined"
                        disabled={isLoading || citiesData.length === 0}
                        error={hasError(errors, "city")}
                    />
                )}
            />
            
            {/*Recaptcha*/}
            {/*<ReCAPTCHA*/}
            {/*    sitekey={process.env.RECAPTCHA_SITE_KEY}*/}
            {/*    ref={recaptchaRef}*/}
            {/*    onChange={setCaptcha}*/}
            {/*/>*/}
            
            {/*/!*Submit*!/*/}
            <Button disabled={isLoading} type="submit" variant="contained" sx={{color: "white"}}>
                {t("fields.submit")}
            </Button>
        
        </Box>
    );
}
