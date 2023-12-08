// noinspection TypeScriptValidateTypes

import {Box, Container, Grid} from "@mui/material";
import {Metadata} from "next";
import {build_meta_data} from "@/app/[locale]/layout";
import {getTranslator} from "next-intl/server";
import {get_ad_details} from "@/api/requests.api";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {notFound} from "next/navigation";
import DetailsMainSection from "@/components/pages/details/main-section";
import DetailsSideSection from "@/components/pages/details/side-section";
import {TLocale} from "@/interfaces/global.interface";
import {cookies} from "next/headers";

export async function generateMetadata({ params: { locale, ad_id, other } }: Props): Promise<Metadata> {
    const t = await getTranslator(locale);

    const { ad } = await get_ad_details(ad_id);

    const images = ad.photos.map((e) => ({ url: e, alt: ad.description }));

    return {
        ...(await build_meta_data(locale, [ad.names[locale]])),
        description: ad.descriptions[locale],
        openGraph: {
            title: ad.names[locale],
            description: ad.descriptions[locale],
            url: `https://resellcle.com/${locale}/ads/details/${ad.slug}`,
            locale,
            images: [
                {
                    url: ad.card_url,
                    alt: ad.description,
                },
                ...images,
            ],
            siteName: t("app.name"),
            publishedTime: ad.created_at,
            authors: ad.seller.names[locale],
            tags: ad.seo_tags,
        },
        twitter: {
            title: ad.names[locale],
            description: ad.descriptions[locale],
            card: "summary_large_image",
            images,
            creator: ad.seller.names[locale],
            site: "www.resellcle.com",
        },
    };
}

interface Props {
    params: {
        ad_id: string;
        other: string[];
        locale: TLocale;
    };
}

export default async function AdDetailsPage({ params: { locale, ad_id, other } }: Props) {
    const { ad, related_ads, side_bar, ad_sense } = await get_ad_details(ad_id);
    const user_id = cookies().get("user_id")?.value ?? "";

    //VALIDATE AD EXISTS
    if (!ad.id) {
        notFound();
    }

    const t = await getTranslator(locale);

    return (
        <Box component="main">
            {/*Nav Header*/}
            <HeaderNavButtons
                items={[{ name: ad.names[locale], link: `/ads/details/${ad.slug}` }]}
            />

            {/*Adsense Space*/}
            <Container component="section" maxWidth="xl">
                <AdsenseAd
                    tags_body={ad_sense.ad_details_top.tags.body}
                    photo_url={ad_sense.ad_details_top.photo_url}
                    width={ad_sense.ad_details_top.width}
                    height={ad_sense.ad_details_top.height}
                    id={`adsense-${AdsensePositions.AD_DETAILS_TOP}`}
                    is_visible={ad_sense.ad_details_top.is_visible}
                />
            </Container>

            {/*Main Section / Side Section*/}
            <Container maxWidth="xl">
                <Grid container component="section" justifyContent="center">
                    {/*Main Section*/}
                    <DetailsMainSection
                        user_id={user_id}
                        related_ads={related_ads}
                        t={t}
                        locale={locale}
                        images={ad.photos}
                        share_link={`https://resellcle.com/${locale}/ads/details/${ad.slug}`}
                        seller={ad.seller}
                        ad_id={ad.id}
                        name={ad.names[locale]}
                        country={ad.location.country}
                        province={ad.location.province}
                        city={ad.location.city}
                        price={ad.price.toLocaleString("en-US")}
                        state={ad.state}
                        created_at={ad.created_at}
                        description={ad.descriptions[locale]}
                        extras={ad.extras}
                        filters_extras={ad.filters_extras}
                        comments={ad.comments}
                        ad_sense_details_bottom={ad_sense.ad_details_bottom}
                    />

                    {/*Sidebar*/}
                    <DetailsSideSection
                        ad_id={ad.id}
                        seller={ad.seller}
                        t={t}
                        locale={locale}
                        items={side_bar}
                        ad_sense_side_bar={ad_sense.ad_side_bar}
                    />
                </Grid>
            </Container>

            {/*Related Ads Section*/}

            {/*<AdsenseAd*/}
            <Container component="section" maxWidth="xl">
                <AdsenseAd
                    tags_body={ad_sense.ad_details_bottom.tags.body}
                    photo_url={ad_sense.ad_details_bottom.photo_url}
                    width={ad_sense.ad_details_bottom.width}
                    height={ad_sense.ad_details_bottom.height}
                    id={`adsense-${AdsensePositions.AD_DETAILS_BOTTOM}`}
                    is_visible={ad_sense.ad_details_bottom.is_visible}
                />
            </Container>
        </Box>
    );
}
