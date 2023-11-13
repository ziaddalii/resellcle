/* eslint-disable react-hooks/rules-of-hooks */
import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {getTranslator} from "next-intl/server";
import {build_meta_data} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {get_category} from "@/api/requests.api";
import {AdModel, AdSenseModel} from "@/api/interfaces.api";
import {build_query_params, format_page_num} from "@/util/formatting.util";
import {notFound} from "next/navigation";
import FilterSection from "@/components/pages/categorization/filter.section";
import SortingSection from "@/components/pages/categorization/sorting.section";
import PaginationBar from "@/components/common/pagination/pagination";
import {AdsList} from "@/components/common/lists/ads.list";
import {SortingSelector} from "@/enums/sorting-selector.enum";
import {TLocale} from "@/interfaces/global.interface";
import {FilterData} from "@/app/[locale]/categories/[category]/page";

export async function generateMetadata({params: {locale, category, sub_category, page}}: Props): Promise<Metadata> {
    
    const t = await getTranslator(locale);
    
    const parsed_page = format_page_num(page);
    const {category: cat} = await get_category(sub_category, parsed_page);
    
    return {
        ...(await build_meta_data(locale, [cat.names[locale]])),
        description: cat.name,
        openGraph: {
            title: cat.names[locale],
            description: cat.name,
            url: `https://resellcle.com/${locale}/categories/${encodeURIComponent(category)}/${encodeURIComponent(sub_category)}?page=${parsed_page}`,
            locale,
            images: {
                url: cat.icon_url,
                alt: cat.name,
            },
            siteName: t("app.name"),
            publishedTime: cat.created_at,
            tags: [cat.name, cat.filters_choices.map((e) => (e.name))].join(" "),
        },
        twitter: {
            title: cat.names[locale],
            description: cat.name,
            card: "summary_large_image",
            images: {
                url: cat.icon_url,
                alt: cat.name,
            },
            site: "www.resellcle.com",
        },
    };
}

interface Props {
    params: {
        category: string;
        sub_category: string;
        locale: TLocale;
        page: number;
    };
    searchParams: {
        page: string;
        sort_by?: string;
        per_page?: number;
        country?: string;
        province?: string;
        city?: string;
        filters?: {
            filter: string;
            value: string;
        }[];
    };
    ads: {
        first_page: number | null,
        last_page: number | null,
        per_page: number,
        data: AdModel[]
    },
    ad_sense: {
        category_top: AdSenseModel;
        category_bottom: AdSenseModel;
    }
}

export default async function SubCategoryPage(props: Props) {
    
    const {locale, category, sub_category} = props.params;
    
    const {page, sort_by, country, province, city, ...other_query_filters} = props.searchParams;
    
    const current_query_items = [];
    for (const k of Object.keys(props.searchParams ?? {})) {
        current_query_items.push({
            id: k,
            value: props.searchParams[k],
        });
    }
    
    const current_query_filters = [];
    for (const k of Object.keys(other_query_filters ?? {})) {
        current_query_filters.push({
            id: k,
            value: other_query_filters[k],
        });
    }
    
    const current_base_url = `/categories/${encodeURIComponent(category)}/${encodeURIComponent(sub_category)}/?${build_query_params(props.searchParams)}`;
    
    const parsed_page = format_page_num(page);
    
    const t = await getTranslator(locale);
    
    const response_data = await get_category(
        sub_category,
        parsed_page,
        sort_by as SortingSelector,
        undefined,
        country,
        province,
        city,
        current_query_filters.map((e) => ({
            filter: e.id,
            value: e.value,
        })),
    );
    
    //VALIDATE CATEGORY
    if (response_data.category.id === "") {
        notFound();
    }
    
    const filter_choice_mapper = (filter: AdModel["filters_choices"][0]) => ({
        id: filter.id,
        name: filter.names[locale],
        links: filter.links,
        options_list: filter.values.map((f) => ({
            id: f.id,
            name: f.values[locale],
            value: f.id,
        })),
    });
    
    //MERGE SUPER + SUB FILTERS CHOICES
    const final_filters_choices = [];
    for (const filter of response_data.category.super_category.filters_choices) {
        final_filters_choices.push(filter_choice_mapper(filter));
    }
    for (const filter of response_data.category.filters_choices) {
        
        if (
            final_filters_choices.findIndex(
                (e) => e.id === filter.id
            ) === -1
        ) {
            final_filters_choices.push(filter_choice_mapper(filter));
        }
    }
    
    //SORTING
    const sorting_data: FilterData[] = [
        // {
        //     id: "0",
        //     name: t("placeholders.select_sub_category"),
        // key: "sub_category",
        //     options_list: response_data.category.sub_categories.map((e) => ({
        //         id: e.id,
        //         name: e.names[locale],
        //         value: e.id,
        //     })),
        // },
        {
            id: "1",
            name: t("placeholders.select_sorting"),
            key: "sort_by",
            options_list: [
                {
                    id: "0",
                    name: t("sorting.sort_default"),
                    value: SortingSelector.DEFAULT,
                },
                {
                    id: "1",
                    name: t("sorting.sort_price_low_to_high"),
                    value: SortingSelector.PRICE_LOW,
                },
                {
                    id: "2",
                    name: t("sorting.sort_price_high_to_low"),
                    value: SortingSelector.PRICE_HIGH,
                },
            ],
        },
    ];
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons
                items={
                    [
                        {
                            name: response_data.category.names[locale],
                            link: `/categories/${encodeURIComponent(category)}/${encodeURIComponent(sub_category)}?page=1`,
                        },
                    ]
                }/>
            
            <Container component="section" maxWidth="xl">
                
                {/*Adsense Space*/}
                <AdsenseAd
                    tags_body={response_data.ad_sense.category_top.tags.body}
                    photo_url={response_data.ad_sense.category_top.photo_url}
                    width={response_data.ad_sense.category_top.width}
                    height={response_data.ad_sense.category_top.height}
                    id={`adsense-${AdsensePositions.CATEGORY_TOP}`}
                    is_visible={response_data.ad_sense.category_top.is_visible}
                />
            
            </Container>
            
            {/*Filter Section*/}
            {response_data.category.filters_choices.length > 0 && <FilterSection
                current_category={category}
                current_sub_category={sub_category}
                current_items={current_query_items}
                items={final_filters_choices}
                countries={response_data.locations.countries.map(
                    (region) => ({
                        id: region.id,
                        name: region.names[locale!],
                        value: region.id,
                    }),
                )}
                provinces={response_data.locations.provinces.map(
                    (province) => ({
                        id: province.id,
                        name: province.names[locale!],
                        value: province.id,
                        country: province.country,
                    }),
                )}
                cities={response_data.locations.cities.map(
                    (city) => ({
                        id: city.id,
                        name: city.names[locale!],
                        value: city.id,
                        province: city.province,
                    }),
                )}
                locale={locale}
            />}
            
            {/* SortingSelector Section */}
            <SortingSection
                current_items={current_query_items}
                current_category={category}
                current_sub_category={sub_category}
                items={sorting_data}
                locale={locale}
            />
            
            <Container maxWidth="xl" component="section" className="space-y-8">
                
                {/*Ads List*/}
                <AdsList t={t} items={response_data.ads.data} locale={locale}/>
                
                {/*Pagination*/}
                <PaginationBar
                    t={t}
                    base_url={current_base_url}
                    query_builder={(p) => build_query_params({
                        ...({sort_by, ...other_query_filters}),
                        page: p,
                    })}
                    current_page={parsed_page}
                    first_page={response_data.ads.first_page}
                    total_pages={response_data.ads.last_page}
                    per_page={response_data.ads.per_page}
                    total_count={response_data.ads.total_count}
                />
                
                <AdsenseAd
                    tags_body={response_data.ad_sense.category_bottom.tags.body}
                    photo_url={response_data.ad_sense.category_bottom.photo_url}
                    width={response_data.ad_sense.category_bottom.width}
                    height={response_data.ad_sense.category_bottom.height}
                    id={`adsense-${AdsensePositions.CATEGORY_BOTTOM}`}
                    is_visible={response_data.ad_sense.category_bottom.is_visible}
                />
            
            </Container>
        
        </Box>
    );
}
