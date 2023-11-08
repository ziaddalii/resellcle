import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {getTranslator} from "next-intl/server";
import {SelectModel} from "@/components/common/form/select.form";
import ContactUsForm from "@/components/common/form/contact_us.form";
import {get_contact_us} from "@/api/requests.api";
import {TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.contact-us")]);
}

interface Props {
    params: {
        locale: TLocale;
    };
}


export default async function ContactUsPage({params: {locale}}: Props) {
    const t = await getTranslator(locale);
    const {ad_sense} = await get_contact_us();

    const service_types: SelectModel[] = [
        {
            id: "01",
            name: t("contact_us.advertising"),
            value: t("contact_us.advertising"),
        },
        {
            id: "02",
            name: t("contact_us.add_an_advertisement"),
            value: t("contact_us.add_an_advertisement"),
        },
        {
            id: "03",
            name: t("contact_us.another_service"),
            value: t("contact_us.another_service"),
        },
    ];

    return (
            <Box component="main">

                {/*Nav Header*/}
                <HeaderNavButtons items={[{name: t("pages.contact-us"), link: "/contact-us"}]}/>

                <Container maxWidth="xl" className="space-y-8">

                    {/*/!*Title*!/*/}
                    {/*<p className="font-bold mb-2">{t("contact_us.contact_form")}</p>*/}

                    {/*Body*/}
                    <ContactUsForm
                        locale={locale}
                        service_types={service_types}
                    />

                    <AdsenseAd
                            tags_body={ad_sense.tags.body}
                            photo_url={ad_sense.photo_url}
                            width={ad_sense.width}
                            height={ad_sense.height}
                            id={`adsense-${AdsensePositions.CONTACT_US_BOTTOM}`}
                            is_visible={ad_sense.is_visible}
                    />

                </Container>

            </Box>
    );
}
