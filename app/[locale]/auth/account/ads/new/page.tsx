import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {getTranslator} from "next-intl/server";
import {get_ads_add} from "@/api/requests.api";
import {TLocale} from "@/interfaces/global.interface";
import AddNewAdForm from "@/components/common/form/add-new-ad.form";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.new_ad")]);
}

interface Props {
    params: {
        locale: TLocale;
    };
}

export default async function NewAdPage({params: {locale}}: Props) {
    
    const t = await getTranslator(locale);
    
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
                value: descriptor.id,
            }
        );
    });
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: t("ads.add_new_ads"), link: "/auth/account/ads/new"}]}/>
            
            {/*Title / Description Section*/}
            {/*<TitleDescriptionSection locale={locale}/>*/}
            
            {/*Add New Form*/}
            <Container>
                
                <AddNewAdForm
                    locale={locale}
                    categories={categories_data}
                    descriptors={descriptors_data}
                    countries={countries_data}
                    provinces={provinces_data}
                    cities={cities_data}
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
