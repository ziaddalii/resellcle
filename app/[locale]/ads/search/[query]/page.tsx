import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import PaginationBar from "@/components/common/pagination/pagination";
import SearchFilterSection from "@/components/pages/search/search-filter.section";
import {getTranslator} from "next-intl/server";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {Metadata} from "next";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {GlobalInterface, TLocale} from "@/interfaces/global.interface";
import {post_search} from "@/api/requests.api";
import {build_query_params, format_page_num} from "@/util/formatting.util";
import {AdsList} from "@/components/common/lists/ads.list";
import {build_search_payload} from "@/api/util.api";
import {notFound} from "next/navigation";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.ads-search")]);
}

interface Props extends GlobalInterface {
    params: {
        query: string;
        locale: TLocale;
    };
    searchParams: {
        page: string;
        category?: string;
        country?: string;
        province?: string;
        city?: string;
    };
}

export default async function SearchPage(props: Props) {

    const {locale, query} = props.params;
    const {category, page, country, province, city} = props.searchParams;

    const final_query = build_query_params({
        q: query,
        ...props.searchParams,
    });

    const t = await getTranslator(locale);

    const parsed_page = format_page_num(page);

    const response_data = await post_search(
            build_search_payload(
                    {
                        category,
                        country,
                        province,
                        city,
                    },
                    query,
                    parsed_page,
            ),
            locale,
    );

    const {
        data: {
            ads,
            ad_sense,
            categories,
            locations,
        },
    } = response_data;

    if (!ads) {
        notFound();
    }

    return (
            <Box component="main">

                {/*Nav Header*/}
                <HeaderNavButtons items={[{name: t("fields.search_q", {query}), link: `/ads/search/${query}?${final_query}`}]}/>

                {/*Search Section*/}
                <SearchFilterSection
                        query={query}
                        page={parsed_page}
                        current_country={country}
                        current_province={province}
                        current_city={city}
                        current_category={category}
                        categories={categories.map((category) => ({
                            id: category.id,
                            name: category.names[locale!],
                            value: category.id,
                        }))}
                        countries={locations.countries.map((country) => ({
                            id: country.id,
                            name: country.names[locale!],
                            value: country.id,
                        }))}
                        provinces={locations.provinces.map((province) => ({
                            id: province.id,
                            name: province.names[locale!],
                            value: province.id,
                            country: province.country,
                        }))}
                        cities={locations.cities.map((city) => ({
                            id: city.id,
                            name: city.names[locale!],
                            value: city.id,
                            province: city.province,
                        }))}
                        locale={locale}/>

                <Container component="section" maxWidth="xl" className="space-y-8">

                    {/*Ads List*/}
                    <AdsList t={t} items={ads.data} locale={locale}/>

                    {/*Pagination*/}
                    <PaginationBar
                            base_url={`/ads/search/${query}`}
                            current_page={parsed_page}
                            first_page={ads.first_page}
                            total_pages={ads.last_page}
                            per_page={ads.per_page}
                            total_count={ads.total_count}
                            query_builder={(p) => build_query_params({
                                ...props.searchParams,
                                q: query,
                                page: p,
                            })}
                            t={t}
                    />

                    <AdsenseAd
                            tags_body={ad_sense.tags.body}
                            photo_url={ad_sense.photo_url}
                            width={ad_sense.width}
                            height={ad_sense.height}
                            is_visible={ad_sense.is_visible}
                            id={`adsense-${AdsensePositions.SEARCH_BOTTOM}`}
                    />

                </Container>

            </Box>
    );
}
