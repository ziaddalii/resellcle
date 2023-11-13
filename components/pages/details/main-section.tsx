// noinspection TypeScriptValidateTypes

import {Box, Button, CardActionArea, Chip, Container, Grid} from "@mui/material";
import ImagesCarousel from "@/components/common/carousels/images.carousel";
import LabelValueText from "@/components/common/texts/label-value.text";
import {ReactNode} from "react";
import {GlobalInterface} from "@/interfaces/global.interface";
import {AdModel, AdSenseModel, AdsState, Seller} from "@/api/interfaces.api";
import {format_date, get_ad_state_text} from "@/util/formatting.util";
import Link from "next/link";
import Image from "next/image";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {CommentsSection} from "./comments.form";
import AdActionsList from "@/components/common/lists/ad-actions-list";
import {RelatedAdsList} from "@/components/common/lists/related-ads.list";
import DefaultAvatar from "@/public/seller/default_avatar.webp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MsgButton from "@/components/common/buttons/message.buttons";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {cookies} from "next/headers";
// import SellerCard from "./../../common/cards/seller.card";
import PhoneNumberButton from "@/components/common/buttons/phone-number.btn";

interface Props extends GlobalInterface {
    images: string[];
    share_link: string;
    seller: Seller;
    ad_id: string;
    user_id: string;
    country: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        created_at: string;
    };
    province: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        created_at: string;
    };
    city: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        created_at: string;
    };
    price: number | string;
    state: AdsState;
    created_at: string;

    description: string;
    extras: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        value: string;
        values: {
            en: string;
            ar: string;
        };
    }[];
    filters_extras: AdModel["filters_extras"];
    comments: {
        id: string;
        name: string;
        message: string;
    }[];

    ad_sense_details_bottom: AdSenseModel;
}

export interface IconsModel {
    icon: ReactNode;
}

export default function DetailsMainSection({
    t,
    locale,
    related_ads,
    images,
    share_link,
    seller,

    ad_id,
    name,
    country,
    province,
    city,
    price,
    state,
    created_at,

    description,
    extras,

    filters_extras,

    ad_sense_details_bottom,

    comments,
}: Props) {
    const token = cookies().get("token");

    return (
        <Grid item xs={12} md={7} component="section" className="space-y-8">
            {/*Carousel Images*/}
            <div className="bg-black">
                <ImagesCarousel>
                    {images.map((image, i) => {
                        // eslint-disable-next-line @next/next/no-img-element
                        return (
                            <img
                                key={i}
                                className="w-full sm:h-[500px] h-[200px] object-contain"
                                alt="carousel image"
                                src={image}
                            />
                        );
                    })}
                </ImagesCarousel>
            </div>

            {/*Buttons Section*/}
            <AdActionsList share_link={share_link} ad_id={ad_id} locale={locale} token={token} />

            {/*Info Section*/}
            <InfoSection
                locale={locale}
                t={t}
                seller={seller}
                ad_number={ad_id}
                name={name}
                country={country.names[locale!]}
                province={province.names[locale!]}
                city={city.names[locale!]}
                price={price}
                state={state}
                created_at={created_at}
            />

            {/*Highlights Section*/}
            <HighlightsSection t={t} locale={locale} highlights={filters_extras} />

            {/*Description Section*/}
            <DescriptionSection t={t} desc={description} />

            {/*Extras Section*/}
            <ExtrasSection items={extras} t={t} locale={locale} />

            {/*Seller Card*/}
            <Container maxWidth="xl" className="md:!hidden !block">
                <SellerCard seller={seller} ad_id={ad_id} locale={locale} t={t}/>
                {/* <SellerCard seller={seller} ad_id={ad_id} locale={locale} t={t} /> */}
            </Container>

            {/*Adsense Space*/}
            <Container maxWidth="xl">
                <AdsenseAd
                    tags_body={ad_sense_details_bottom.tags.body}
                    photo_url={ad_sense_details_bottom.photo_url}
                    width={ad_sense_details_bottom.width}
                    height={ad_sense_details_bottom.height}
                    id={`adsense-${AdsensePositions.AD_DETAILS_BOTTOM}`}
                    is_visible={ad_sense_details_bottom.is_visible}
                />
            </Container>

            {/*Comments Section*/}
            <CommentsSection comments={comments} ad_id={ad_id} locale={locale} />

            <Container maxWidth="xl">
                <RelatedAdsList locale={locale} t={t} items={related_ads} />
            </Container>
        </Grid>
    );
}

interface InfoSectionProps extends GlobalInterface {
    seller: Seller;
    ad_number: string;
    country: string;
    province: string;
    city: string;
    price: number;
    state: AdsState;
    created_at: string;
}

function InfoSection({
    locale,
    t,
    seller,
    ad_number,
    name,
    country,
    province,
    city,
    price,
    state,
    created_at,
}: InfoSectionProps) {
    return (
        <Container maxWidth="xl" component="div" className="!grid lg:grid-cols-2 items-center grid-cols-1">
            {/* <LabelValueText label={`${t!("fields.ad_number")}: `} value={ad_number} /> */}

            <LabelValueText label={`${t!("fields.name")}: `} value={name} />

            <LabelValueText label={`${t!("fields.price")}: `} value={`${t!("fields.price_in_egp")} ${price}`} />

            <LabelValueText label={`${t!("fields.province")}: `} value={province} />

            <LabelValueText label={`${t!("fields.city")}: `} value={city} />

            <LabelValueText label={`${t!("fields.status")}: `} value={t!(get_ad_state_text(state))} />

            <div className="col-span-1">
                <CardActionArea>
                    <Link href={`/sellers/${seller.id}/${encodeURIComponent(seller.names.en)}?page=1`}>
                        <Box className="flex items-center gap-2">
                            <p className="font-bold">{`${t!("fields.store")}: `}</p>

                            <Image
                                className="rounded-full w-10 h-10"
                                src={seller.logo === "" ? DefaultAvatar.src : seller.logo}
                                alt={seller.name}
                                width={40}
                                height={40}
                            />
                            <p>{seller.names[locale!]}</p>
                        </Box>
                    </Link>
                </CardActionArea>
            </div>

            <LabelValueText label={`${t!("fields.date_added")}: `} value={format_date(created_at)} />
        </Container>
    );
}

interface HighlightsSectionProps extends GlobalInterface {
    highlights: AdModel["filters_extras"];
}

function HighlightsSection({ highlights, locale, t }: HighlightsSectionProps) {
    return (
        <Container maxWidth="xl" component="section">
            <p className="font-bold text-xl my-4">{`${t!("fields.highlights")}: `}</p>

            <div className="!flex flex-row flex-wrap items-center justify-start gap-4">
                {highlights.map((e) => (
                    <Chip key={e.id} label={e.names[locale!]} variant="outlined" color="primary" />
                ))}
            </div>
        </Container>
    );
}

interface DescriptionSectionProps extends GlobalInterface {
    desc: string;
}

function DescriptionSection({ t, desc }: DescriptionSectionProps) {
    return (
        <Container maxWidth="xl" component="div">
            <p className="font-bold text-xl my-4">{`${t!("fields.description")}: `}</p>
            <p className="border border-1 rounded-sm bg-secondary-100 p-4">{desc}</p>
        </Container>
    );
}

interface ExtrasSectionProps extends GlobalInterface {
    items: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        value: string;
        values: {
            en: string;
            ar: string;
        };
    }[];
}

function ExtrasSection({ items, locale, t }: ExtrasSectionProps) {
    return (
        <Container maxWidth="xl" component="div">
            <p className="font-bold text-xl">{`${t!("fields.extra_info")}: `}</p>
            <div className="!grid md:grid-cols-2 items-start grid-cols-1 py-4">
                {items.map((item) => (
                    <LabelValueText key={item.id} label={`${item.names[locale]}:`} value={item.values[locale]} />
                ))}
            </div>
        </Container>
    );
}

export function SellerCard({ seller, ad_id, locale, t, user_id }) {
    return (
        <div className="p-4 border-1 border space-y-4">
            <div className="grid gap-2 lg:grid-cols-3 grid-cols-2 lg:justify-between items-center">
                <div className="col-span-2 grid gap-8 h-full lg:order-none order-1">
                    <div className="row-span-1 self-start">
                        <h2 className="font-bold text-xl mb-2">{t!("fields.seller")}</h2>
                        <strong className="text-lg">{seller.name}</strong>
                        <p>{seller.descriptions[locale]}</p>
                    </div>
                    <Button
                        className="row-span-1 self-end w-fit flex gap-2"
                        component={Link}
                        href={`/sellers/${seller.id}/${encodeURIComponent(seller.names.en)}?page=1`}
                    >
                        {t!("fields.view_profile")}
                        {locale === "en" ? <ArrowForwardIosIcon fontSize="small"/> : <ArrowBackIosIcon fontSize="small"/>}
                    </Button>
                </div>

                <Image
                    width={140}
                    height={140}
                    src={seller.logo === "" ? DefaultAvatar.src : seller.logo}
                    alt={seller.name}
                    className="rounded-full aspect-square lg:col-span-1 col-span-2 lg:justify-self-end justify-self-center self-start"
                />
            </div>
            {user_id !== seller.id && (
                <div className="space-y-2">
                    <Button
                        className="md:!hidden flex gap-2"
                        component={"a"}
                        href={`tel:${seller.phones[0]}`}
                        variant="contained"
                        sx={{ color: "white" }}
                        fullWidth
                    >
                        <LocalPhoneIcon fontSize="small"/>
                        {t!("fields.phone")}
                    </Button>

                    <PhoneNumberButton phone_number={seller.phones[0]} />
                    
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                        <div className="cols-span-1">
                            <Button className="gap-2 flex" variant="outlined" component="a" fullWidth
                                href={`https://wa.me/+2${seller.phones[0]}`}
                                target="_blank"><WhatsAppIcon fontSize="small"/>{t("fields.whatsapp")}</Button>
                        </div>

                        <div className="cols-span-1">
                            <MsgButton locale={locale} ad_id={ad_id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
