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
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useZod } from "@/hooks/zod.hooks";
import { getError, hasError, minLengthMsg } from "../validations/util";
import { toggle_loading } from "@/components/common/notifications/global-progress-bar.notification";
import { notify } from "@/components/common/notifications/global-snackbar.notification";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { GlobalInterface } from "@/interfaces/global.interface";
import SectionLabelText from "@/components/common/texts/section-label.text";
import { AddNewAdForm, AdModel, LocationModel, ResponseGet } from "@/api/interfaces.api";
import { FormSelect, SelectModel } from "@/components/common/form/select.form";
import { CityData, ProvinceData } from "@/app/[locale]/auth/register/page";
import { zPhoto } from "@/components/common/validations/photo";
import AdImageInput from "@/components/common/inputs/ad-image.inputs";
import AdMultipleImagesInput from "@/components/common/inputs/ad-multi-images.inputs";
import { scroll_to_top } from "@/components/common/buttons/floating-arrow.button";
import { POST_ADS_ADD } from "@/api/constants.api";
import { getCookie } from "cookies-next";
import { get_request_errors } from "@/util/formatting.util";
import ResellcleConfig from "@/util/config";

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
}

function build_form_data(validated_data: AddNewAdForm) {
    const form_data = new FormData();

    // BASIC INFORMATION
    form_data.append("name", validated_data.name);
    form_data.append("description", validated_data.description);
    form_data.append("price", validated_data.price);
    // form_data.append("seo_tags", validated_data.seo_tags);

    // LOCATION
    form_data.append("city", validated_data.city);

    //PHOTOS
    form_data.append("photo_card", validated_data.photo_card);
    validated_data.photos.forEach((e) => form_data.append("photos[]", e));

    //CATEGORIES
    form_data.append("categories[]", validated_data.category);
    if (validated_data.sub_category) {
        form_data.append("categories[]", validated_data.sub_category);
    }

    //FILTERS
    validated_data.filters_choices.forEach((e, index) => {
        form_data.append(`filters_choices[${index}][id]`, e.id);
        form_data.append(`filters_choices[${index}][value]`, e.value);
    });

    validated_data.filters_extras.forEach((e) => {
        form_data.append("filters_extras[]", e);
    });

    validated_data.descriptors.forEach((e, index) => {
        form_data.append(`descriptors[${index}][id]`, e.id);
        form_data.append(`descriptors[${index}][en_value]`, e.value);
        form_data.append(`descriptors[${index}][ar_value]`, e.value);
    });

    return form_data;
}

const defaultAdValues = () => {
    return {
        name: "",
        description: "",
        price: "",
        // seo_tags: "",

        region: "",
        province: "",
        city: "",

        photo_card: "",
        photos: [],

        category: "",
        sub_category: "",

        filters_choices: [],

        filters_extras: [],

        descriptors: [],
    };
};

const AddNewAdForm = ({ locale, categories, descriptors, countries, provinces, cities }: Props) => {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const { errors, onSubmit, control, getValues, setValue, watch, reset } = useZod<AddNewAdForm>(
        {
            name: z.string().min(3, minLengthMsg(3, "ads.name", t)),
            description: z.string().min(3, minLengthMsg(3, "ads.description", t)),
            price: z.string().min(1, minLengthMsg(1, "fields.price", t)).regex(/^\d+$/),
            // seo_tags: z.optional(z.string()),

            region: z.string().min(1, minLengthMsg(1, "fields.region", t)),
            province: z.string().min(1, minLengthMsg(1, "fields.province", t)),
            city: z.string().min(1, minLengthMsg(1, "fields.city", t)),

            photo_card: zPhoto(true, "ads.main_ad_image", t),
            photos: z
                .array(zPhoto(true, "ads.additional_ad_images", t))
                .min(1, minLengthMsg(1, "ads.additional_ad_images", t)),

            category: z.string().min(3, minLengthMsg(3, "fields.categories", t)),
            sub_category: z.optional(z.string()),

            filters_choices: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    value: z.string(),
                    values: z.array(
                        z.object({
                            id: z.string(),
                            name: z.string(),
                            value: z.string(),
                        })
                    ),
                })
            ),

            filters_extras: z.array(z.string()).min(1, minLengthMsg(1, "fields.filters_extras", t)),

            descriptors: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    value: z.string().min(1, minLengthMsg(1, "fields.descriptors", t)),
                    en_value: z.string().min(1, minLengthMsg(1, "fields.descriptors", t)),
                    ar_value: z.string().min(1, minLengthMsg(1, "fields.descriptors", t)),
                })
            ),
        },
        defaultAdValues(),
        async (validated_data: AddNewAdForm) => {
            setIsLoading(true);
            await toggle_loading(true);
            scroll_to_top();

            const token = getCookie("token");

            fetch(POST_ADS_ADD, {
                method: "POST",
                headers: {
                    "Accept-Language": locale,
                    Authorization: `Bearer ${token}`,
                },
                body: build_form_data(validated_data),
            })
                .then(async (response: Response) => {
                    const body: ResponseGet<AdModel> = await response.json();

                    if (response.status !== 200) {
                        throw new DOMException(get_request_errors(body, locale));
                    }

                    notify(false, t("fields.operation_completed"));
                    reset();

                    //FULL PAGE RELOAD
                    window.location.replace("/auth/account/ads");
                })
                .catch(async (e) => {
                    console.log(e);

                    notify(true, e.message);

                    await toggle_loading(false);
                    setIsLoading(false);
                });
        }
    );

    return (
        <Box component={"form"} onSubmit={onSubmit} className="space-y-8">
            {/*Basic Information*/}
            <BasicInformationSection t={t} control={control} errors={errors} isLoading={isLoading} />

            {/*Location*/}
            <LocationSection
                t={t}
                control={control}
                errors={errors}
                getValues={getValues}
                watch={watch}
                isLoading={isLoading}
                countries={countries}
                provinces={provinces}
                cities={cities}
            />

            {/*Photos*/}
            <PhotosSection t={t} errors={errors} isLoading={isLoading} setValue={setValue} />

            {/*Categories / Sub Categories*/}
            <CategoriesSection
                t={t}
                locale={locale}
                control={control}
                getValues={getValues}
                setValue={setValue}
                errors={errors}
                watch={watch}
                isLoading={isLoading}
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
                isLoading={isLoading}
                categories={categories}
            />

            {/*Filters Extras*/}
            <FiltersExtrasSection
                t={t}
                locale={locale}
                control={control}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                isLoading={isLoading}
                categories={categories}
            />

            {/*Descriptors*/}
            <DescriptorsSection
                t={t}
                locale={locale}
                control={control}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                isLoading={isLoading}
                descriptors={descriptors}
            />

            <Button disabled={isLoading} type="submit" variant="contained" sx={{ color: "white" }}>
                {t("fields.submit")}
            </Button>
        </Box>
    );
};

function BasicInformationSection({ t, control, errors, isLoading }) {
    return (
        <>
            <section className="space-y-8">
                <SectionLabelText label={t("fields.basic_information")} />

                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
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
                    render={({ field }) => (
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
                    render={({ field }) => (
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
            </section>
        </>
    );
}

function LocationSection({ t, control, getValues, watch, errors, isLoading, countries, provinces, cities }) {
    const [provinces_list, set_provinces_list] = useState<ProvinceData[]>(provinces);

    const [cities_list, set_cities_list] = useState<CityData[]>([]);
    useEffect(() => {
        const region = getValues("region");

        const filtered_provinces = provinces.filter((province) => province.country?.id === region);

        if(ResellcleConfig.ENABLE_REGIONS){
            set_provinces_list(filtered_provinces);
        }
    }, [watch("region")]);

    useEffect(() => {
        const province = getValues("province");

        const filtered_cities = cities.filter((city) => city.province?.id === province);

        set_cities_list(filtered_cities);
    }, [watch("province")]);

    return (
        <>
            <section className="space-y-8">
                <SectionLabelText label={t("fields.location")} />

                {/*Country*/}

                {ResellcleConfig.ENABLE_REGIONS && (
                    <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
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
                )}

                {/*Province*/}
                <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
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
                    render={({ field }) => (
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

function PhotosSection({ t, errors, setValue, isLoading }) {
    const on_photo_card_submit = (file: File): void => {
        setValue("photo_card", file);
    };

    const on_photos_submit = (files: File[]): void => {
        setValue("photos", files);
    };

    return (
        <>
            <section className="space-y-8">
                <SectionLabelText label={t("fields.photos")} />

                <Container className="!flex flex-col justify-center items-center gap-8">
                    {/*Photo Card*/}
                    <AdImageInput
                        t={t}
                        id="ad_photo_card"
                        placeholder={t("ads.main_ad_image")}
                        disabled={isLoading}
                        hasError={hasError(errors, "photo_card")}
                        error={getError(errors, "photo_card")}
                        onImageSubmit={on_photo_card_submit}
                    />

                    {/*Photos*/}
                    <AdMultipleImagesInput
                        t={t}
                        id="ad_photos"
                        placeholder={t("ads.additional_ad_images")}
                        disabled={isLoading}
                        hasError={hasError(errors, "photos")}
                        error={getError(errors, "photos")}
                        onImagesSubmit={on_photos_submit}
                    />
                </Container>
            </section>
        </>
    );
}

function CategoriesSection({ t, locale, control, getValues, setValue, errors, watch, isLoading, categories }) {
    const [current_sub_categories, set_current_sub_categories] = useState<SelectModel[]>([]);

    useEffect(() => {
        const category = getValues("category");

        if (!category) {
            return;
        }

        // CATEGORY
        const selected_category = categories.find((e) => e.id === category);

        // SUB_CATEGORIES
        set_current_sub_categories(
            selected_category.sub_categories.map((e) => ({
                id: e.id,
                name: e.names[locale!],
                value: e.id,
            }))
        );

        setValue("sub_category", "");
    }, [watch("category")]);

    return (
        <>
            <section className="space-y-8">
                <SectionLabelText label={t("fields.categories")} />

                {/*Categories*/}
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
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
                <Controller
                    name="sub_category"
                    control={control}
                    render={({ field }) => (
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
                />
            </section>
        </>
    );
}

function FiltersChoicesSection({ t, locale, control, getValues, setValue, watch, isLoading, categories }) {
    const [current_filters_choices, set_current_filters_choices] = useState([]);

    useEffect(() => {
        const category = getValues("category");

        if (!category) {
            return;
        }

        // CATEGORY
        const selected_category = categories.find((e) => e.id === category);

        //FILTERS CHOICES
        const new_filters_choices = selected_category.filters_choices.map((e) => ({
            id: e.id,
            name: e.names[locale!],
            links: e.links,
            value: "",
            // value: e.values[0].id,
            values: e.values.map((value) => ({
                id: value.id,
                name: value.values[locale!],
                value: value.id,
            })),
        }));

        const sub_category = getValues("sub_category");
        if (sub_category) {
            const selected_sub_category = selected_category.sub_categories.find((e) => e.id === sub_category);

            //FILTERS CHOICES
            selected_sub_category.filters_choices.forEach((e) => {
                const found_index = new_filters_choices.findIndex((f) => f.id === e.id);
                if (found_index === -1) {
                    new_filters_choices.push({
                        id: e.id,
                        name: e.names[locale!],
                        links: e.links,
                        value: e.values[0].id,
                        values: e.values.map((value) => ({
                            id: value.id,
                            name: value.values[locale!],
                            value: value.id,
                        })),
                    });
                }
            });
        }

        set_current_filters_choices(new_filters_choices);
        setValue("filters_choices", new_filters_choices);

        //INITIAL FIRST FILTER IN SELECTED FILTERS
        const first_filter = new_filters_choices[0];
        set_selected_items([first_filter]);
        set_selected_values([]);
    }, [watch("category"), watch("sub_category")]);

    useEffect(() => {
        set_full_options_list(current_filters_choices.map((e) => e.values));
        set_current_options_list(current_filters_choices.map((e) => e.values));
    }, [current_filters_choices]);

    const [full_options_list, set_full_options_list] = useState(current_filters_choices.map((e) => e.values));

    const [current_options_list, set_current_options_list] = useState(current_filters_choices.map((e) => e.values));
    const [selected_values, set_selected_values] = useState({});
    const [selected_items, set_selected_items] = useState([]);

    const on_change = (id: string, index: number, value: string) => {
        const new_selected_values = { ...selected_values };
        const new_selected_items = [...selected_items];

        let found_index = new_selected_items.findIndex((e) => e.id === id);

        if (found_index !== -1) {
            new_selected_items[found_index].value = value;
        } else {
            new_selected_items.push({
                id,
                value: value,
            });
        }
        new_selected_values[id] = value;

        //SET OPTIONS FOR LINKS
        const full_filter_choice = current_filters_choices.find((e) => e.id === id);
        const new_current_options_list = [...current_options_list];
        if (full_filter_choice.links.length > 0) {
            //FILTER ON SELECTED VALUE IF EXISTS
            const filtered_links = full_filter_choice.links.filter(
                (e) => e.filter_choice_value === new_selected_values[id]
            );

            //SET OPTIONS LIST FOR EACH ASSOCIATED FILTER WITH VALUE
            const updated_indices = [];
            filtered_links.forEach((e) => {
                const found_index = current_filters_choices.findIndex((f) => f.id === e.filter_choice);

                if (found_index !== -1) {
                    updated_indices.push(found_index);
                    new_current_options_list[found_index] = full_options_list[found_index].filter((f) =>
                        e.items.includes(f.id!)
                    );
                }
            });

            //RESET OTHER FILTERS
            // for (let i = 0; i < current_options_list.length; i++) {
            //     if (!updated_indices.includes(i)) {
            //         new_current_options_list[i] = full_options_list[i];
            //     }
            // }
        }

        set_current_options_list(new_current_options_list);

        //NEXT FILTER CHECK TO ADD TO SELECTED
        const next_filter = current_filters_choices[index + 1];
        if (next_filter && new_selected_items.findIndex((e) => e.id === next_filter.id) === -1) {
            next_filter.value = "";
            new_selected_items.push(next_filter);
        }

        set_selected_items(new_selected_items);

        set_selected_values(new_selected_values);

        //SET FORM VALUE
        const new_filters_choices = [...current_filters_choices];

        found_index = current_filters_choices.findIndex((choice) => choice.id === id);

        if (found_index === -1) {
            return;
        }

        new_filters_choices[found_index].value = value;

        // set_current_filters_choices(new_filters_choices);
        setValue("filters_choices", new_filters_choices);
    };

    return (
        current_filters_choices.length > 0 && (
            <section className="space-y-8">
                <SectionLabelText label={t("fields.filters_choices")} />

                {selected_items.map((item, index) => {
                    const original_index = current_filters_choices.findIndex((e) => e.id === item.id);
                    const filter = current_filters_choices[original_index];

                    const values =
                        current_options_list.length !== 0 ? current_options_list[original_index] : filter.values;

                    return values.length < 8 ? (
                        <FormControl fullWidth key={filter.id} component="fieldset">
                            <FormLabel component="legend">{filter.name}</FormLabel>

                            <RadioGroup
                                row
                                onChange={(e, value) => on_change(filter.id, index, value)}
                                value={selected_values[filter.id] ?? ""}
                            >
                                {values.map((value) => (
                                    <FormControlLabel
                                        disabled={isLoading}
                                        key={value.id}
                                        value={value.id}
                                        control={<Radio />}
                                        label={value.name}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    ) : (
                        <FormSelect<string>
                            key={filter.id}
                            id={`${filter.name}-${index}`}
                            locale={locale}
                            fullWidth
                            label={filter.name}
                            value={selected_values[filter.id]}
                            onChange={(e) => on_change(filter.id, index, e.target.value)}
                            placeholder={filter.name}
                            items={values}
                            variant="outlined"
                            disabled={isLoading}
                        />
                    );
                })}
            </section>
        )
    );
}

function FiltersExtrasSection({ t, locale, control, getValues, setValue, watch, isLoading, categories }) {
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
        const new_filters_extras = selected_category.filters_extras.map((e) => ({
            id: e.id,
            name: e.names[locale!],
            value: e.id,
        }));

        const sub_category = getValues("sub_category");
        if (sub_category) {
            const selected_sub_category = selected_category.sub_categories.find((e) => e.id === sub_category);

            //FILTERS CHOICES
            selected_sub_category.filters_extras.forEach((e) => {
                const found_index = new_filters_extras.findIndex((f) => f.id === e.id);
                if (found_index === -1) {
                    new_filters_extras.push({
                        id: e.id,
                        name: e.names[locale!],
                        value: e.id,
                    });
                }
            });
        }

        set_current_filters_extras(new_filters_extras);
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
        current_filters_extras.length > 0 && (
            <section className="space-y-8">
                <SectionLabelText label={t("fields.filters_extras")} />

                <Box className="flex flex-wrap justify-start items-center gap-4">
                    {current_filters_extras.map((e) => (
                        <Controller
                            key={e.id}
                            name="filters_extras"
                            control={control}
                            render={({ field, fieldState }) => (
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
        )
    );
}

function DescriptorsSection({ t, locale, control, errors, getValues, setValue, watch, isLoading, descriptors }) {
    return (
        <>
            <section className="space-y-8">
                <SectionLabelText label={t("fields.descriptors")} />

                <Controller
                    name="descriptors"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            multiple
                            id="ad_descriptors"
                            options={descriptors}
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            disabled={isLoading}
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
                                    <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
                                ));
                            }}
                        />
                    )}
                />

                {watch("descriptors").map((descriptor) => (
                    <Controller
                        name={descriptor.name}
                        key={descriptor.id}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                className="col-span-1"
                                {...field}
                                onChange={(e) => {
                                    const new_descriptors = [...getValues("descriptors")];

                                    const found_index = new_descriptors.findIndex((e) => e.id === descriptor.id);

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
                                error={hasError(errors, "descriptors")}
                                helperText={getError(errors, "descriptors")}
                                disabled={isLoading}
                            />
                        )}
                    />
                ))}
            </section>
        </>
    );
}

export default AddNewAdForm;
