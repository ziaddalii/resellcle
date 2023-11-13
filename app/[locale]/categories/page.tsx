import CategoryCard from "@/components/common/cards/category.card";
import {Box, Container} from "@mui/material";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {Metadata} from "next";
import {build_meta_data} from "@/app/[locale]/layout";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {get_categories} from "@/api/requests.api";
import {getTranslator} from "next-intl/server";
import {TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({params: {locale}}: Props): Promise<Metadata> {
    
    const t = await getTranslator(locale);
    
    const {categories} = await get_categories();
    
    const categories_names = categories.map((e) => (e.name)).join(" - ");
    const filters_choices = categories.map((e) => (e.filters_choices.map((f) => (f.name)).join(" - "))).join(" - ");
    const categories_icons = categories.map((e) => ({
        url: e.icon_url,
        alt: e.name,
    }));
    
    return {
        ...(await build_meta_data(locale, [t("pages.categories")])),
        description: categories_names,
        openGraph: {
            title: categories_names,
            description: filters_choices,
            url: `https://resellcle.com/${locale}/categories`,
            locale,
            images: categories_icons,
            siteName: t("app.name"),
            tags: [categories_names, filters_choices].join(" - "),
        },
        twitter: {
            title: categories_names,
            description: filters_choices,
            images: categories_icons,
            card: "summary_large_image",
            site: "www.resellcle.com",
        },
    };
}

interface Props {
    params: {
        locale: TLocale;
    };
}

export default async function CategoriesPage({params: {locale}}: Props) {
    
    const response_data = await get_categories();
    
    return (
        <Container component="main" maxWidth="xl">
            
            {/*Categories Cards*/}
            <Box className="!grid justify-start lg:!grid-cols-4 grid-cols-2 gap-2">
                {response_data.categories.map((category) => {
                    return (
                        <CategoryCard
                            key={category.id} 
                            locale={locale}
                            name={category.names[locale]}
                            photo_url={category.icon_url}
                            sub_categories={category.sub_categories}
                            category={category}
                        />
                    );
                })}
            </Box>
            
            {/* AdSense */}
            <AdsenseAd
                id={`adsense-${AdsensePositions.CATEGORY_BOTTOM}`}
                tags_body={response_data.ad_sense.tags.body}
                photo_url={response_data.ad_sense.photo_url}
                width={response_data.ad_sense.width}
                height={response_data.ad_sense.height}
                is_visible={response_data.ad_sense.is_visible}
            />
        
        </Container>
    );
}
