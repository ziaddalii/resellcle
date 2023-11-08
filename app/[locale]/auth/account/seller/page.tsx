import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {getTranslator} from "next-intl/server";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {get_personal_info} from "@/api/requests.api";
import SellerProfileForm from "@/components/common/form/seller-profile.form";
import {GlobalInterface, TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("fields.seller")]);
}

interface TitleSectionProps extends GlobalInterface {
}

interface Props {
    params: {
        locale: TLocale;
    }
}

export default async function SellerProfilePage({params: {locale}}: Props) {

    const t = await getTranslator(locale);

    const {seller} = await get_personal_info();

    return (
            <Box component="main" className="space-y-8">

                {/*Nav Header*/}
                <HeaderNavButtons items={[{name: t("fields.seller"), link: "/auth/account/seller"}]}/>

                {/*/!*Title Section*!/*/}
                {/*<TitleSection t={t}/>*/}

                {/*Seller Form*/}
                <Container maxWidth="xl">

                    {/*<SectionLabelText label={t("fields.seller_details")}></SectionLabelText>*/}

                    {/*Seller Section*/}
                    {/* <SellerSection locale={locale}/> */}

                    <SellerProfileForm default_values={{
                        logo: seller.logo,
                        en_name: seller.names.en,
                        ar_name: seller.names.ar,
                        en_description: seller.descriptions.en,
                        ar_description: seller.descriptions.ar,
                    }} locale={locale}/>

                    {/*Section Section*/}
                    {/* <SubmitSection locale={locale}/> */}

                    {/*Adsense Space*/}
                    {/*<AdsenseAd*/}
                    {/*        tags_body={ad_sense.tags.body}*/}
                    {/*        photo_url={ad_sense.photo_url}*/}
                    {/*        width={ad_sense.width}*/}
                    {/*        height={ad_sense.height}*/}
                    {/*        id={`adsense-${AdsensePositions.SELLER_BOTTOM}`}*/}
                    {/*is_visible={ad_sense.is_visible}*/}
                    {/*/>*/}

                </Container>

            </Box>
    );
}

async function TitleSection({t}: TitleSectionProps) {
    return (
            <Container component="section">
                <p>{t!("fields.store_details")}</p>
            </Container>
    );
}
