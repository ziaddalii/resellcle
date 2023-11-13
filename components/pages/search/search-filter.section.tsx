/* eslint-disable react-hooks/exhaustive-deps */
// noinspection TypeScriptValidateTypes
// noinspection TypeScriptValidateTypes

"use client";

import {Box, Button, Container} from "@mui/material";
import {useEffect, useState} from "react";
import {FormSelect, SelectModel} from "@/components/common/form/select.form";
import {useTranslations} from "next-intl";
import {GlobalInterface} from "@/interfaces/global.interface";
import {CityData, ProvinceData} from "@/app/[locale]/auth/register/page";
import {useZod} from "@/hooks/zod.hooks";
import {z} from "zod";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {LocationModel, SearchFilterForm} from "@/api/interfaces.api";
import {build_query_params, sleep} from "@/util/formatting.util";
import {useRouter} from "next-intl/client";
import {build_search_payload} from "@/api/util.api";
import {Controller} from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import ResellcleConfig from "@/util/config";

interface Props extends GlobalInterface {
    page: number;
    query: string;
    countries: SelectModel[];
    provinces: (SelectModel & { country?: LocationModel })[];
    cities: (SelectModel & { province?: LocationModel })[];
    categories: SelectModel[];
    current_country?: string;
    current_province?: string;
    current_city?: string;
    current_category?: string;
}

export const defaultSearchValues = () => {
    return {
        category: "",
        country: "",
        province: "",
        city: "",
    };
};

export default function SearchFilterSection(
    {
        current_country,
        current_province,
        current_city,
        current_category,
        categories,
        countries,
        provinces,
        cities,
        locale,
        query,
        page,
    }: Props
) {
    
    const t = useTranslations();
    
    const navigate = useRouter();
    
    const [isLoading, setIsLoading] = useState(true);
    
    const [provincesData, setProvincesData] = useState<ProvinceData[]>(provinces);
    const [citiesData, setCitiesData] = useState<CityData[]>([]);
    
    // Handling Form
    const {errors, onSubmit, control, setValue, getValues, watch, reset} = useZod<SearchFilterForm>(
        {
            category: z.optional(z.string()),
            
            country: z.optional(z.string()),
            
            province: z.optional(z.string()),
            
            city: z.optional(z.string()),
        },
        defaultSearchValues(),
        async (validatedData: SearchFilterForm) => {
            
            const {category, country, province, city} = validatedData;
            
            setIsLoading(true);
            
            await toggle_loading(true);
            
            await sleep(2);
            
            navigate.replace(`/ads/search/${query}?${build_query_params(
                build_search_payload({category, country, province, city}, query, page),
            )}`);
            
            setIsLoading(false);
            await toggle_loading(false);
            
        }
    );
    
    //INITIALIZE
    useEffect(() => {
        
        // CATEGORY
        if (
            current_category &&
            categories.findIndex((e) => e.id === current_category) !== -1
        ) {
            setValue("category", current_category);
        }
        
        // COUNTRY
        if (
            current_country &&
            countries.findIndex((e) => e.id === current_country) !== -1
        ) {
            setValue("country", current_country);
            if(ResellcleConfig.ENABLE_REGIONS){
                setProvincesData(
                    provinces.filter((province) => (province.country?.id === current_country)),
                );
            }
        }
        
        // PROVINCE
        if (
            current_province &&
            countries.findIndex((e) => e.id === current_province) !== -1
        ) {
            setValue("province", current_province);
            setCitiesData(
                cities.filter((city) => (city.province?.id === current_province)),
            );
        }
        
        // CITY
        if (
            current_city &&
            cities.findIndex((e) => e.id === current_city) !== -1
        ) {
            setValue("city", current_city);
        }
        
        // ENABLE INPUTS
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        const country = getValues("country");
        
        const filteredProvinces = provinces.filter((province) => {
            return province.country?.id === country;
        });
        if(ResellcleConfig.ENABLE_REGIONS){
            setProvincesData(filteredProvinces);
        }
        
    }, [watch("country")]);
    
    useEffect(() => {
        const province = getValues("province");
        
        const filteredCities = cities.filter((city) => {
            return city.province?.id === province;
        });
        
        setCitiesData(filteredCities);
    }, [watch("province")]);
    
    return (
        <Box component="section" className="bg-secondary-100 !mt-0">
            
            <Container component="form" maxWidth="xl" className="!grid md:!grid-cols-3 !grid-cols-1 gap-4 p-4">
                
                {/*Categories*/}
                <Controller
                    name="category"
                    control={control}
                    render={({field}) => (
                        <FormSelect<string>
                            id="category"
                            field={field}
                            fullWidth
                            label={t("fields.categories")}
                            placeholder={t("placeholders.select_category")}
                            items={categories}
                            variant="outlined"
                            disabled={isLoading || categories.length === 0}
                        />
                    )}
                />
                
                {/*Country*/}
                {ResellcleConfig.ENABLE_REGIONS && (
                <Controller
                name="country"
                control={control}
                render={({field}) => (
                    <FormSelect<string>
                        id="country"
                        field={field}
                        fullWidth
                        label={t("fields.region")}
                        placeholder={t("placeholders.select_region")}
                        items={countries}
                        variant="outlined"
                        disabled={isLoading || countries.length === 0}
                    />
                )}
            />
                )}

                
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
                            items={provincesData}
                            variant="outlined"
                            disabled={isLoading || provincesData.length === 0}
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
                            items={citiesData}
                            variant="outlined"
                            disabled={isLoading || citiesData.length === 0}
                        />
                    )}
                />
                
                <Button
                    disabled={isLoading}
                    variant="contained"
                    onClick={onSubmit}
                    endIcon={<SearchIcon/>}
                    sx={{color: "white"}}
                >
                    {t("fields.search")}
                </Button>
            
            </Container>
        
        </Box>
    );
};
