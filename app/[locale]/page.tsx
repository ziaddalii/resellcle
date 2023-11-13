import {Container} from "@mui/material";
import ImagesCarousel from "@/components/common/carousels/images.carousel";
import {Metadata} from "next";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {get_home} from "@/api/requests.api";
import {getTranslator} from "next-intl/server";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import HomePinnedAdsSection from "@/components/pages/home/pinned-ads.section";
import HomePaidAdsSection from "@/components/pages/home/paid-ads.section";
import HomeNewArrivalsSection from "@/components/pages/home/new-arrivals.section";
import {TLocale} from "@/interfaces/global.interface";
import Image from "next/image";

export async function generateMetadata({ params: { locale } }: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.home")]);
}

export interface ImageModel {
    photo_url: string;
    id?: string;
    order?: number;
    seo_tags?: string;
    created_at?: string;
}

interface Props {
    params: {
        locale: TLocale;
    };
}

export default async function HomePage({ params: { locale } }: Props) {
    const t = await getTranslator(locale);

    const response_data = await get_home();
    const images = response_data.carousel;
    return (
        <Container component="main" className="pt-4" maxWidth="xl">
            {/*Top Carousel*/}
            <ImagesCarousel>
                {images.map((image, i) => {
                    // eslint-disable-next-line @next/next/no-img-element
                    return (
                        <Image
                            width={1400}
                            height={200}
                            priority
                            key={i}
                            className="w-full h-full max-h-[200px] object-cover"
                            alt="carousel image"
                            src={image.photo_url}
                        />
                    );
                })}
            </ImagesCarousel>

            {/*/!*Adsense Space*!/*/}
            <AdsenseAd
                id={`adsense-${AdsensePositions.HOME_TOP}`}
                tags_body={response_data.ad_sense.top.tags.body}
                photo_url={response_data.ad_sense.top.photo_url}
                width={response_data.ad_sense.top.width}
                height={response_data.ad_sense.top.height}
                is_visible={response_data.ad_sense.top.is_visible}
            />

            {/*Pinned Ads*/}
            {response_data.ads.pinned.length !== 0 && (
                <HomePinnedAdsSection data={response_data.ads.pinned} locale={locale} t={t} />
            )}

            {response_data.ads.paid.length !== 0 && (
                <HomePaidAdsSection data={response_data.ads.paid} locale={locale} t={t} />
            )}
            {/*Paid Members Ads*/}

            {/*New Arrivals*/}
            {response_data.ads.new_arrivals.length != 0 && (
                <HomeNewArrivalsSection data={response_data.ads.new_arrivals} locale={locale} t={t} />
            )}

            {/*/!*More Section*!/*/}
            {/*<HomeMoreSection/>*/}

            {/*Adsense Space*/}
            <AdsenseAd
                id={`adsense-${AdsensePositions.HOME_BOTTOM}`}
                tags_body={response_data.ad_sense.bottom.tags.body}
                photo_url={response_data.ad_sense.bottom.photo_url}
                width={response_data.ad_sense.bottom.width}
                height={response_data.ad_sense.bottom.height}
                is_visible={response_data.ad_sense.bottom.is_visible}
            />
        </Container>
    );
}
