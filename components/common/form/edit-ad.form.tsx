/* eslint-disable react-hooks/exhaustive-deps */
// noinspection TypeScriptValidateTypes

"use client";
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import {useEffect, useState} from "react";
import {Controller} from "react-hook-form";
import {useZod} from "@/hooks/zod.hooks";
import {getError, hasError, minLengthMsg} from "../validations/util";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {useTranslations} from "next-intl";
import {z} from "zod";
import {post_ads_update} from "@/api/requests.api";
import {GlobalInterface} from "@/interfaces/global.interface";
import SectionLabelText from "@/components/common/texts/section-label.text";
import {EditAdForm, LocationModel, Photo, PhotoFull} from "@/api/interfaces.api";
import {isEqual, isString, sortBy} from "lodash-es";
import {FormSelect, SelectModel} from "@/components/common/form/select.form";
import {CityData, ProvinceData} from "@/app/[locale]/auth/register/page";
import AdImageInput from "@/components/common/inputs/ad-image.inputs";
import {scroll_to_top} from "@/components/common/buttons/floating-arrow.button";
import {zPhoto} from "@/components/common/validations/photo";
import AdEditMultipleImagesInput from "@/components/common/inputs/ad-edit-multi-images.inputs";


interface Props extends GlobalInterface {
    categories: {
        id: string;
        name: string;
        value: string;
        sub_categories: {
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            };
        }[];
        filters_choices: {
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            };
            values: {
                id: string;
                value: string;
                values: {
                    en: string;
                    ar: string;
                };
            }[];
        }[];
    }[];
    descriptors: {
        id: string;
        name: string;
        value: string;
    }[];
    countries: {
        id: string;
        name: string;
        value: string;
    }[];
    provinces: {
        id: string;
        name: string;
        value: string;
        country?: LocationModel;
    }[];
    cities: {
        id: string;
        name: string;
        value: string;
        province?: LocationModel;
    }[];
    default_values: {
        id: string;
        name: string;
        description: string;
        price: number | string;
        seo_tags: string;
        
        region: string;
        province: string;
        city: string;
        
        photo_card: string;
        photos: string[],
        photos_full: Photo[] | PhotoFull[];
        photos_add: File[];
        photos_update: Photo[];
        photos_delete: string[];
        
        categories: string[];
        category: string;
        sub_category: string;
        
        filters_choices: {
            id: string;
            name: string;
            value: string;
            values: {
                id: string;
                name: string;
                value: string;
            }[],
        }[];
        
        filters_extras: {
            id: string;
            name: string;
            value: string;
        }[];
        
        selected_filters_extras: Set<string>;
        
        descriptors: {
            _id: string;
            id: string;
            name: string;
            value: string;
            en_value: string;
            ar_value: string;
        }[];
    };
}

function build_form_data(default_values: Props["default_values"], validated_data: EditAdForm) {
    const form_data = new FormData();
    
    // BASIC INFORMATION
    if (default_values.name !== validated_data.name) {
        form_data.append("name", validated_data.name);
    }
    
    if (default_values.description !== validated_data.description) {
        form_data.append("description", validated_data.description);
    }
    
    if (default_values.price !== validated_data.price) {
        form_data.append("price", validated_data.price);
    }
    
    // if (default_values.seo_tags !== validated_data.seo_tags) {
    //     form_data.append("seo_tags", validated_data.seo_tags);
    // }
    
    // LOCATION
    if (default_values.city !== validated_data.city) {
        form_data.append("city", validated_data.city);
    }
    
    //PHOTOS
    if (validated_data.photo_card instanceof File) {
        form_data.append("photo_card", validated_data.photo_card);
    }
    
    // ADD NEW PHOTOS
    const photos_add_length = validated_data.photos_add?.length ?? 0;
    validated_data.photos_add?.forEach((e, i) => {
        form_data.append(`photos[${i}][id]`, "");
        form_data.append(`photos[${i}][photo]`, e);
    });
    
    // UPDATE PHOTOS
    const photos_update_length = validated_data.photos_update?.length ?? 0;
    validated_data.photos_update?.forEach((e, i) => {
        form_data.append(`photos[${i + photos_add_length}][id]`, e.id);
        form_data.append(`photos[${i + photos_add_length}][photo]`, e.photo);
    });
    
    // DELETE PHOTOS
    validated_data.photos_update?.forEach((e, i) => {
        form_data.append(`photos[${i + photos_add_length + photos_update_length}][id]`, e.id);
    });
    
    //CATEGORIES
    if (default_values.categories[0] !== validated_data.category) {
        form_data.append("categories[]", validated_data.category);
    }
    
    if ((default_values.categories[1] ?? "") !== validated_data.sub_category) {
        form_data.append("categories[]", validated_data.sub_category);
    }
    
    //FILTERS
    if (!isEqual(sortBy(default_values.filters_choices), sortBy(validated_data.filters_choices))) {
        validated_data.filters_choices?.forEach((e, index) => {
            form_data.append(`filters_choices[${index}][id]`, e.id);
            form_data.append(`filters_choices[${index}][value]`, e.value);
        });
    }
    
    if (!isEqual(sortBy(default_values.filters_extras), sortBy(validated_data.filters_extras))) {
        validated_data.filters_extras?.forEach((e) => {
            form_data.append("filters_extras[]", e);
        });
    }
    
    // USING _id TO REFER TO ORIGINAL ID IN LIST
    // id refers to descriptor_id
    //DELETED DESCRIPTORS
    const deleted_descriptors = default_values.descriptors.filter(
        (e) => validated_data.descriptors?.findIndex(
            (f) => f.id === e.id
        ) === -1
    );
    
    deleted_descriptors.forEach((e, i) => {
        form_data.append(`descriptors[${i}][id]`, e._id);
    });
    
    //UPDATED DESCRIPTORS
    const updated_descriptors = validated_data.descriptors?.filter(
        (e) => default_values.descriptors?.findIndex(
            (f) => f.id === e.id
        ) !== -1
    );
    updated_descriptors.forEach((e, i) => {
        
        const found_index = default_values.descriptors?.findIndex((f) => f.id === e.id);
        
        if (
            e.value !== default_values.descriptors[found_index].value
        ) {
            form_data.append(`descriptors[${deleted_descriptors.length + i}][id]`, e.id);
            form_data.append(`descriptors[${deleted_descriptors.length + i}][value]`, e.value);
        }
    });
    
    //NEW DESCRIPTORS
    const new_descriptors = validated_data.descriptors?.filter(
        (e) => default_values.descriptors?.findIndex(
            (f) => f.id === e.id
        ) === -1
    );
    new_descriptors.forEach((e, i) => {
        form_data.append(`descriptors[${updated_descriptors.length + deleted_descriptors.length + i}][id]`, "");
        form_data.append(`descriptors[${updated_descriptors.length + deleted_descriptors.length + i}][descriptor_id]`, e.id);
        form_data.append(`descriptors[${updated_descriptors.length + deleted_descriptors.length + i}][value]`, e.value);
        form_data.append(`descriptors[${updated_descriptors.length + deleted_descriptors.length + i}][value]`, e.value);
    });
 
    return form_data;
}


export default function EditAdForm(
    {
        locale,
        categories,
        descriptors,
        countries,
        provinces,
        cities,
        default_values,
    }: Props
) {
    
    const t = useTranslations();
    
    const [isLoading, setIsLoading] = useState(false);
    
    const {errors, onSubmit, control, getValues, setValue, watch, reset} = useZod<EditAdForm>(
        {
            
            name: z.string().min(3, minLengthMsg(3, "ads.name", t)),
            description: z.string().min(3, minLengthMsg(3, "ads.description", t)),
            price: z.string().min(1, minLengthMsg(1, "fields.price", t)).regex(/^\d+$/),
            // seo_tags: z.optional(z.string()),
            
            region: z.string().min(1, minLengthMsg(1, "fields.region", t)),
            province: z.string().min(1, minLengthMsg(1, "fields.province", t)),
            city: z.string().min(1, minLengthMsg(1, "fields.city", t)),
            
            photo_card: zPhoto(false, "ads.main_ad_image", t),
            
            photos_add: z.array(zPhoto(false, "ads.additional_ad_images", t)),
            photos_update: z.array(zPhoto(false, "ads.additional_ad_images", t)),
            photos_delete: z.array(zPhoto(false, "ads.additional_ad_images", t)),
            
            category: z.string().min(3, minLengthMsg(3, "fields.categories", t)),
            sub_category: z.optional(z.string()),
            
            filters_choices: z.optional(
                z.array(
                    z.object(
                        {
                            id: z.string(),
                            name: z.string(),
                            value: z.string(),
                            values: z.array(
                                z.object({
                                    id: z.string(),
                                    name: z.string(),
                                    value: z.string(),
                                }),
                            ),
                        },
                    ),
                ),
            ),
            
            filters_extras: z.optional(z.array(z.string())),
            
            descriptors: z.optional(
                z.array(
                    z.object(
                        {
                            id: z.string(),
                            name: z.string(),
                            value: z.string().min(1, minLengthMsg(1, "fields.descriptors", t)),
                            en_value: z.string().min(1, minLengthMsg(1, "fields.descriptors", t)),
                            ar_value: z.string().min(1, minLengthMsg(1, "fields.descriptors", t)),
                        },
                    ),
                ),
            ),
        },
        default_values,
        async (validatedData: EditAdForm) => {
            
            setIsLoading(true);
            await toggle_loading(true);
            scroll_to_top();
            
            const payload = build_form_data(default_values, validatedData);
            
            //SEND IF PAYLOAD HAVE KEYS
            if (payload.entries().next().done) {
                window.location.replace("/auth/account/ads");
            }
            
            const result = await post_ads_update(default_values.id, payload, locale!);
            
            if (isString(result)) {
                notify(true, result);
            } else {
                notify(false, t("fields.operation_completed"));
                // reset();
                
                //FULL PAGE RELOAD
                window.location.replace("/auth/account/ads");
            }
            
            await toggle_loading(false);
            setIsLoading(false);
        }
    );
    
    return (
        <Box component={"form"} onSubmit={onSubmit} className="space-y-8">
            
            {/*Basic Information*/}
            <BasicInformationSection
                t={t}
                control={control}
                errors={errors}
                isLoading={isLoading}
            />
            
            {/*Location*/}
            <LocationSection
                t={t}
                control={control}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                isLoading={isLoading}
                countries={countries}
                provinces={provinces}
                cities={cities}
            />
            
            {/*Photos*/}
            <PhotosSection
                t={t}
                errors={errors}
                isLoading={isLoading}
                getValues={getValues}
                setValue={setValue}
            />
            
            {/*Categories / Sub Categories*/}
            <CategoriesSection
                t={t}
                locale={locale}
                control={control}
                getValues={getValues}
                setValue={setValue}
                errors={errors}
                watch={watch}
                disabled={isLoading}
                categories={categories}
            />
            
            {/*Filters Choices*/}
            <FiltersChoicesSection
                t={t}
                locale={locale}
                control={control}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                disabled={isLoading}
                categories={categories}
            />
            
            {/*/!*Filters Extras*!/*/}
            <FiltersExtrasSection
                t={t}
                locale={locale}
                control={control}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                disabled={isLoading}
                categories={categories}
            />
            
            {/*/!*Descriptors*!/*/}
            <DescriptorsSection
                t={t}
                locale={locale}
                control={control}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                disabled={isLoading}
                descriptors={descriptors}
            />
            
            {/*OLD AUTOCOMPLETE*/}
            {/* <Controller
                name="filters_choices"
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={currentFilterChoices}
                        getOptionLabel={(option) => option.name}
                        filterSelectedOptions
                        disabled={disabled || currentFilterChoices.length === 0}
                        onChange={(e, value) => {
                            setValue("filters_choices", value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("fields.filters_choices")}
                                placeholder={t("fields.filters_choices")}
                            />
                        )}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            );
                        }}
                        renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((option, index) => (
                                <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
                            ));
                        }}
                    />
                )}
            /> */}
            
            <Button disabled={isLoading} type="submit" variant="contained" sx={{color: "white"}}>
                {t("fields.submit")}
            </Button>
        
        </Box>
    );
};

function BasicInformationSection({t, control, errors, isLoading}) {
    
    return (
        <>
            <section className="space-y-8">
                <SectionLabelText label={t("fields.basic_information")}/>
                
                <Controller
                    name="name"
                    control={control}
                    render={({field}) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            fullWidth
                            id="ad_name"
                            type="text"
                            label={t("ads.name")}
                            title={t("ads.name")}
                            placeholder={t("placeholders.enter_ad_title")}
                            error={hasError(errors, "name")}
                            helperText={getError(errors, "name")}
                            disabled={isLoading}
                        />
                    )}
                />
                
                <Controller
                    name="description"
                    control={control}
                    render={({field}) => (
                        <TextField
                            {...field}
                            multiline
                            minRows={3}
                            maxRows={8}
                            variant="outlined"
                            fullWidth
                            id="ad_desc"
                            type="text"
                            label={t("ads.description")}
                            title={t("ads.description")}
                            placeholder={t("placeholders.enter_ad_desc")}
                            error={hasError(errors, "description")}
                            helperText={getError(errors, "description")}
                            disabled={isLoading}
                        />
                    )}
                />
                
                <Controller
                    name="price"
                    control={control}
                    render={({field}) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            fullWidth
                            id="price"
                            type="text"
                            label={t("fields.price")}
                            title={t("fields.price")}
                            placeholder={t("placeholders.enter_price")}
                            error={hasError(errors, "price")}
                            helperText={getError(errors, "price")}
                            disabled={isLoading}
                        />
                    )}
                />
                
                {/*<Controller*/}
                {/*        name="seo_tags"*/}
                {/*        control={control}*/}
                {/*        render={({field}) => (*/}
                {/*                <TextField*/}
                {/*                        {...field}*/}
                {/*                        multiline*/}
                {/*                        variant="outlined"*/}
                {/*                        fullWidth*/}
                {/*                        minRows={3}*/}
                {/*                        maxRows={8}*/}
                {/*                        id="seo_tags"*/}
                {/*                        type="text"*/}
                {/*                        label={t("fields.tags")}*/}
                {/*                        label={t("fields.tags")}*/}
                {/*                        placeholder={t("placeholders.enter_tags")}*/}
                {/*                        error={hasError(errors, "seo_tags")}*/}
                {/*                        helperText={getError(errors, "seo_tags")}*/}
                {/*                        disabled={isLoading}*/}
                {/*                />*/}
                {/*        )}*/}
                {/*/>*/}
            
            </section>
        </>
    );
}

function LocationSection({t, control, getValues, watch, setValue, errors, isLoading, countries, provinces, cities}) {
    
    const [provinces_list, set_provinces_list] = useState<ProvinceData[]>(provinces.filter(
        (province) => (province.country?.id === getValues("region"))
    ));
    
    const [cities_list, set_cities_list] = useState<CityData[]>(cities.filter(
        (city) => (city.province?.id === getValues("province"))
    ));
    
    useEffect(() => {
        
        const region = getValues("region");
        
        const filtered_provinces = provinces.filter(
            (province) => (province.country?.id === region)
        );
        
        set_provinces_list(filtered_provinces);
        
        if (filtered_provinces.findIndex((e) => e.id === getValues("province")) === -1) {
            setValue("province", "");
        }
    }, [watch("region")]);
    
    useEffect(() => {
        const province = getValues("province");
        
        const filtered_cities = cities.filter(
            (city) => (city.province?.id === province)
        );
        
        set_cities_list(filtered_cities);
        
        if (filtered_cities.findIndex((e) => e.id === getValues("city")) === -1) {
            setValue("city", "");
        }
        
    }, [watch("province")]);
    
    return (
        <>
            <section className="space-y-8">
                
                <SectionLabelText label={t("fields.location")}/>
                
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
                            placeholder={t("placeholders.select_province")}
                            items={provinces_list}
                            variant="outlined"
                            disabled={isLoading || provinces_list.length === 0}
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
                            placeholder={t("placeholders.select_city")}
                            items={cities_list}
                            variant="outlined"
                            disabled={isLoading || cities_list.length === 0}
                            error={hasError(errors, "city")}
                        />
                    )}
                />
            
            </section>
        </>
    );
}

function PhotosSection({t, errors, getValues, setValue, isLoading}) {
    
    const on_photo_card_submit = (file: File): void => {
        setValue("photo_card", file);
    };
    
    const on_add_photos_submit = (files: File[]): void => {
        setValue("photos_add", files);
    };
    
    const on_update_photos_submit = (updated_photo: Photo): void => {
        const new_photos_update = getValues("photos_update");
        
        //EXISTS BEFORE
        const found_index = new_photos_update.findIndex((e) => e.id === updated_photo.id);
        if (found_index !== -1) {
            new_photos_update[found_index].photo = updated_photo.photo;
        } else {
            new_photos_update.push(updated_photo);
        }
        
        setValue("photos_update", new_photos_update);
    };
    
    const on_delete_photos_submit = (id: string): void => {
        const new_photos_delete = getValues("photos_delete");
        
        new_photos_delete.push(id);
        
        //REMOVE FROM UPDATE LIST IF EXISTS
        const current_photos_update = getValues("photos_update");
        const update_index = current_photos_update.findIndex((e) => e.id === id);
        if (update_index !== -1) {
            current_photos_update.splice(update_index, 1);
            setValue("photos_update", current_photos_update);
        }
        
        setValue("photos_delete", new_photos_delete);
    };
    
    return (
        <>
            <section className="space-y-8">
                
                <SectionLabelText label={t("fields.photos")}/>
                
                <Container className="!flex flex-col justify-center items-center gap-8">
                    
                    {/*Photo Card*/}
                    <AdImageInput
                        t={t}
                        id="ad_photo_card"
                        placeholder={t("ads.main_ad_image")}
                        init={getValues("photo_card")}
                        disabled={isLoading}
                        hasError={hasError(errors, "photo_card")}
                        error={getError(errors, "photo_card")}
                        onImageSubmit={on_photo_card_submit}
                    />
                    
                    {/*Photos*/}
                    <AdEditMultipleImagesInput
                        t={t}
                        id="ad_photos"
                        placeholder={t("fields.add_images")}
                        disabled={isLoading}
                        init={getValues("photos_full")}
                        hasError={
                            hasError(errors, "photos_add") ||
                            hasError(errors, "photos_update") ||
                            hasError(errors, "photos_delete")
                        }
                        error={
                            getError(errors, "photos_add") ||
                            getError(errors, "photos_update") ||
                            getError(errors, "photos_delete")
                        }
                        onImagesAddSubmit={on_add_photos_submit}
                        onImagesUpdateSubmit={on_update_photos_submit}
                        onImagesDeleteSubmit={on_delete_photos_submit}
                    />
                
                </Container>
            
            </section>
        </>
    );
}

function CategoriesSection({t, locale, control, getValues, setValue, errors, watch, isLoading, categories}) {
    
    const [current_sub_categories, set_current_sub_categories] = useState<SelectModel[]>([]);
    
    
    useEffect(() => {
        
        const category = getValues("category");
        
        if (!category) {
            return;
        }
        
        // CATEGORY
        const selected_category = categories.find((e) => e.id === category);
        
        // SUB_CATEGORIES
        const new_sub_categories = selected_category.sub_categories.map(
            (e) => ({
                id: e.id,
                name: e.names[locale!],
                value: e.id,
            }),
        );
        
        set_current_sub_categories(new_sub_categories);
        
        if (
            new_sub_categories.findIndex((e) => e.id === getValues("sub_category")) === -1
        ) {
            setValue("sub_category", "");
        }
        
    }, [watch("category")]);
    
    
    return (
        <>
            
            <section className="space-y-8">
                
                <SectionLabelText label={t("fields.categories")}/>
                
                {/*Categories*/}
                <Controller
                    name="category"
                    control={control}
                    render={({field}) => (
                        <FormSelect<string>
                            locale={locale}
                            id="category"
                            field={field}
                            fullWidth
                            label={t("fields.categories")}
                            placeholder={t("placeholders.select_category")}
                            items={categories}
                            variant="outlined"
                            disabled={isLoading}
                            error={hasError(errors, "category")}
                        />
                    )}
                />
                
                {/* Sub Categories*/}
                {current_sub_categories.length > 0 && <Controller
                    name="sub_category"
                    control={control}
                    render={({field}) => (
                        <FormSelect<string>
                            id="sub_category"
                            field={field}
                            fullWidth
                            label={t("pages.sub_categories")}
                            placeholder={t("placeholders.select_sub_category")}
                            items={current_sub_categories}
                            variant="outlined"
                            disabled={isLoading || current_sub_categories.length === 0}
                            error={hasError(errors, "sub_category")}
                        />
                    )}
                />}
            
            </section>
        </>
    );
}

function FiltersChoicesSection({t, locale, control, getValues, setValue, watch, isLoading, categories}) {
    
    const [current_filters_choices, set_current_filters_choices] = useState([]);
    
    useEffect(() => {
        
        const category = getValues("category");
        
        if (!category) {
            return;
        }
        
        // CATEGORY
        const selected_category = categories.find((e) => e.id === category);
        
        //FILTERS CHOICES
        const new_filters_choices = selected_category.filters_choices.map(
            (e) => ({
                id: e.id,
                name: e.names[locale!],
                links: e.links,
                value: e.values[0].id,
                values: e.values.map((value) => ({
                    id: value.id,
                    name: value.values[locale!],
                    value: value.id,
                })),
            }),
        );
        
        const sub_category = getValues("sub_category");
        if (sub_category) {
            
            const selected_sub_category = selected_category.sub_categories.find((e) => e.id === sub_category);
            
            //FILTERS CHOICES
            selected_sub_category.filters_choices.forEach((e) => {
                
                const found_index = new_filters_choices.findIndex((f) => f.id === e.id);
                if (found_index === -1) {
                    
                    new_filters_choices.push(
                        {
                            id: e.id,
                            name: e.names[locale!],
                            links: e.links,
                            value: e.values[0].id,
                            values: e.values.map((value) => ({
                                id: value.id,
                                name: value.values[locale!],
                                value: value.id,
                            })),
                        }
                    );
                }
                
            });
        }
        
        set_current_filters_choices(new_filters_choices);
        setValue("filters_choices", new_filters_choices);
        
    }, [watch("category"), watch("sub_category")]);
    
    return (
        current_filters_choices.length > 0 && <section className="space-y-8">

            <SectionLabelText label={t("fields.filters_choices")}/>
            
            {current_filters_choices.map((filter) => (
                <FormControl fullWidth key={filter.id} component="fieldset">
                    
                    <FormLabel component="legend">{filter.name}</FormLabel>
                    
                    <Controller
                        rules={{required: true}}
                        control={control}
                        disabled={isLoading}
                        name={filter.name}
                        render={({field}) => (
                            <RadioGroup row {...field} value={field.value || filter.values[0].id}>
                                {filter.values.map((value) => (
                                    <FormControlLabel
                                        disabled={isLoading}
                                        key={value.id}
                                        value={value.id}
                                        onChange={() => {
                                            
                                            const new_filters_choices = [...current_filters_choices];
                                            
                                            const found_index = current_filters_choices.findIndex(
                                                (choice) => choice.id === filter.id
                                            );
                                            
                                            if (found_index === -1) {
                                                return;
                                            }
                                            
                                            new_filters_choices[found_index].value = value.id;
                                            
                                            set_current_filters_choices(new_filters_choices);
                                            setValue("filters_choices", new_filters_choices);
                                        }}
                                        control={<Radio/>}
                                        label={value.name}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                    />
                    
                </FormControl>
            ))}

        </section>
    );
}

function FiltersExtrasSection({t, locale, control, getValues, setValue, watch, isLoading, categories}) {
    
    const [current_filters_extras, set_current_filters_extras] = useState([]);
    const [selected_filters_extras, set_selected_filters_extras] = useState(new Set());
    
    useEffect(() => {
        
        const category = getValues("category");
        
        if (!category) {
            return;
        }
        
        // CATEGORY
        const selected_category = categories.find((e) => e.id === category);
        
        //FILTERS EXTRAS
        const new_filters_extras = selected_category.filters_extras.map(
            (e) => ({
                id: e.id,
                name: e.names[locale!],
                value: e.id,
            }),
        );
        
        const sub_category = getValues("sub_category");
        if (sub_category) {
            
            const selected_sub_category = selected_category.sub_categories.find((e) => e.id === sub_category);
            
            //FILTERS CHOICES
            selected_sub_category.filters_extras.forEach((e) => {
                
                const found_index = new_filters_extras.findIndex((f) => f.id === e.id);
                if (found_index === -1) {
                    
                    new_filters_extras.push(
                        {
                            id: e.id,
                            name: e.names[locale!],
                            value: e.id,
                        }
                    );
                }
                
            });
        }
        
        set_current_filters_extras(new_filters_extras);
        
        const current_selected = new Set((getValues("filters_extras").map((e) => e?.id)));
        
        set_selected_filters_extras(current_selected);
        
        setValue("filters_extras", Array.from(current_selected));
        
    }, [watch("category"), watch("sub_category")]);
    
    const on_select = (id: string) => {
        
        const new_filters_extras_set = new Set(selected_filters_extras);
        
        if (new_filters_extras_set.has(id)) {
            new_filters_extras_set.delete(id);
        } else {
            new_filters_extras_set.add(id);
        }
        
        set_selected_filters_extras(new_filters_extras_set);
        
        const new_filters_extras_list = Array.from(new_filters_extras_set);
        setValue("filters_extras", new_filters_extras_list);
    };
    
    return (
        current_filters_extras.length > 0 && <section className="space-y-8">

            <SectionLabelText label={t("fields.filters_extras")}/>

            <Box className="flex flex-wrap justify-center items-center gap-4">
                
                {current_filters_extras.map((e) => (
                    <Controller
                        key={e.id}
                        name="filters_extras"
                        control={control}
                        render={({field, fieldState}) => (
                            <Chip
                                sx={{
                                    color: selected_filters_extras.has(e.id) ? "white" : "black",
                                }}
                                key={e.id}
                                label={e.name}
                                onClick={() => on_select(e.id)}
                                variant={selected_filters_extras.has(e.id) ? "filled" : "outlined"}
                                color={"primary"}
                                disabled={isLoading}
                            />
                        )}
                    />
                ))}
            </Box>
        </section>
    );
}

function DescriptorsSection({t, locale, control, errors, getValues, setValue, watch, isLoading, descriptors}) {
    
    const [default_descriptors, set_default_descriptors] = useState(getValues("descriptors"));
    
    return (
        <section className="space-y-8">
            
            <SectionLabelText label={t("fields.descriptors")}/>
            
            <Autocomplete
                multiple
                id="ad_descriptors"
                options={descriptors}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                filterSelectedOptions
                disabled={isLoading}
                defaultValue={default_descriptors}
                onChange={(e, value) => {
                    setValue("descriptors", value);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("fields.descriptors")}
                        placeholder={t("placeholders.select_descriptors")}
                    />
                )}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    );
                }}
                renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                        <Chip {...getTagProps({index})} key={option.id}
                              label={option.name}/>
                    ));
                }}
            />
            
            {watch("descriptors").map((descriptor, i) => (
                    <TextField
                        key={`${descriptor.id}-${i}`}
                        className="col-span-1"
                        onChange={(e) => {
                            const new_descriptors = [...getValues("descriptors")];
                            
                            const found_index = new_descriptors.findIndex(
                                (e) => e.id === descriptor.id
                            );
                            
                            if (found_index === -1) {
                                return;
                            }
                            
                            new_descriptors[found_index].value = e.target.value;
                            new_descriptors[found_index].en_value = e.target.value;
                            new_descriptors[found_index].ar_value = e.target.value;
                            
                            setValue("descriptors", new_descriptors);
                        }}
                        variant="outlined"
                        fullWidth
                        id={`descriptor-${descriptor.id}`}
                        type="text"
                        label={descriptor.name}
                        title={descriptor.name}
                        placeholder={descriptor.name}
                        defaultValue={descriptor.value}
                        error={hasError(errors, "descriptors")}
                        helperText={getError(errors, "descriptors")}
                        disabled={isLoading}
                    />
                )
            )}
        
        </section>
    );
}
