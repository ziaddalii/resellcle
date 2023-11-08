import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {getTranslator} from "next-intl/server";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import PersonalInfoForm from "@/components/common/form/personal-info.form";
import {get_personal_info} from "@/api/requests.api";
import {GlobalInterface, TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.personal_information")]);
}

interface TitleSectionProps extends GlobalInterface {
}

interface Props {
    params: {
        locale: TLocale;
    }
}

export default async function PersonalInfoPage({params: {locale}}: Props) {

    const t = await getTranslator(locale);

    const response_data = await get_personal_info();

    return (
            <Box component="main">

                {/*Nav Header*/}
                <HeaderNavButtons items={[{name: t("fields.account"), link: "/auth/account/personal-info"}]}/>

                {/*Title Section*/}
                {/*<TitleSection t={t}/>*/}

                {/*Personal Info Form*/}
                <Container>

                    {/*Personal Info Form Section*/}
                    <PersonalInfoForm original_personal_info={response_data} locale={locale}/>

                </Container>

                {/*Adsense Space*/}
                {/* <AdsenseAd id={`adsense-${AdsensePositions.PERSONAL_INFO_BOTTOM}`}/> */}

            </Box>
    );
}

function TitleSection({t}: TitleSectionProps) {
    return (
            <Container component="section">
                <p>{t!("fields.my_account_information")}</p>
            </Container>
    );
}
