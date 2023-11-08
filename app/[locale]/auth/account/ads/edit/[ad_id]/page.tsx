import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {getTranslator} from "next-intl/server";
import {get_ads_add, get_edit_ad} from "@/api/requests.api";
import {TLocale} from "@/interfaces/global.interface";
import {notFound} from "next/navigation";
import EditAdForm from "@/components/common/form/edit-ad.form";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.edit_ad")]);
}

interface Props {
    params: {
        locale: TLocale;
        ad_id: string;
    };
}

export default async function EditAdPage({params: {locale, ad_id}}: Props) {
    
    const t = await getTranslator(locale);
    
    if (!ad_id) {
        notFound();
    }
    
    const ad = await get_edit_ad(ad_id);
    
    if (!ad.id) {
        notFound();
    }
    
    const {categories, locations, descriptors} = await get_ads_add();
    
    // LOCATIONS
    const countries_data = locations.countries.map(
        (region) => ({
            id: region.id,
            name: region.names[locale!],
            value: region.id,
        }),
    );
    
    const provinces_data = locations.provinces.map(
        (province) => ({
            id: province.id,
            name: province.names[locale!],
            value: province.id,
            country: province.country,
        }),
    );
    
    const cities_data = locations.cities.map(
        (city) => ({
            id: city.id,
            name: city.names[locale!],
            value: city.id,
            province: city.province,
        }),
    );
    
    const categories_data = categories.map(
        (category) => ({
            id: category.id,
            name: category.names[locale!],
            value: category.id,
            sub_categories: category.sub_categories,
            filters_choices: category.filters_choices,
            filters_extras: category.filters_extras,
        }),
    );
    
    const descriptors_data = descriptors.data.map((descriptor) => {
        return (
            {
                id: descriptor.id,
                name: descriptor.names[locale!],
                value: "",
            }
        );
    });
    
    const selected_category = categories.find((e) => e.id === ad.categories[0]?.id);
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: t("ads.edit_ad"), link: "/auth/account/ads/new"}]}/>
            
            {/*Title / Description Section*/}
            {/*<TitleDescriptionSection locale={locale}/>*/}
            
            {/*Add New Form*/}
            <Container>
                
                <EditAdForm
                    locale={locale}
                    categories={categories_data}
                    descriptors={descriptors_data}
                    countries={countries_data}
                    provinces={provinces_data}
                    cities={cities_data}
                    default_values={
                        {
                            id: ad.id,
                            name: ad.names.en, //OR AR BOTH SAME VALUE
                            description: ad.descriptions.en, //OR AR BOTH SAME VALUE
                            price: ad.price.toString(),
                            seo_tags: ad.seo_tags,
                            
                            region: ad.location.country.id,
                            province: ad.location.province.id,
                            city: ad.location.city.id,
                            
                            photo_card: ad.card_url,
                            photos: ad.photos,
                            photos_full: ad.photos_full ?? [],
                            photos_add: [],
                            photos_update: [],
                            photos_delete: [],
                            
                            categories: ad.categories.map((e) => e.id),
                            category: ad.categories[0]?.id ?? "",
                            sub_category: ad.categories[1]?.id ?? "",
                            
                            filters_choices: ad.filters_choices?.map((e) => {
                                const full_filter_choice = selected_category.filters_choices.find((f) => f.id === e.choice.id);
                                
                                return {
                                    id: e.choice.id,
                                    name: e.choice.names[locale!],
                                    links: full_filter_choice?.links ?? [],
                                    value: e.selected.id ?? "",
                                    values: full_filter_choice?.values.map((value) => ({
                                        id: value.id,
                                        name: value.values[locale!],
                                        value: value.id,
                                    })) ?? [],
                                };
                            }),
                            
                            filters_extras: ad.filters_extras?.map(
                                (e) => ({
                                    id: e.id,
                                    name: e.names[locale!],
                                    value: e.id,
                                }),
                            ) ?? [],
                            
                            selected_filters_extras: new Set(ad.filters_extras?.map((e) => e.id) ?? []),
                            
                            descriptors: ad.descriptors?.map((e) =>
                                ({
                                    _id: e.id,
                                    id: e.descriptor_id,
                                    name: e.names[locale!],
                                    value: e.values?.en ?? "",  //OR AR BOTH SAME VALUE
                                    en_value: e.values?.en ?? "",
                                    ar_value: e.values?.ar ?? "",
                                })
                            ) ?? [],
                        }
                    }
                />
                
                {/*Submit  Section*/}
                {/* <SubmitSection locale={locale}/> */}
            
            </Container>
            
            {/*Adsense Space*/}
            {/*<AdsenseAd*/}
            {/*    id={`adsense-${AdsensePositions.ADS_NEW_BOTTOM}`}*/}
            {/*    tags_body={ad_sense.tags.body}*/}
            {/*    photo_url={ad_sense.photo_url}*/}
            {/*    width={ad_sense.width}*/}
            {/*    height={ad_sense.height}*/}
            {/*is_visible={ad_sense.is_visible}*/}
            {/*/>*/}
        
        </Box>
    );
}
