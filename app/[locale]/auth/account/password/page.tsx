import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {getTranslator} from "next-intl/server";
import ChangePasswordForm from "@/components/common/form/change-password.form";
import {TLocale} from "@/interfaces/global.interface";

interface Props {
    params: {
        locale: TLocale;
    };
}

export default async function PasswordPage({params: {locale}}: Props) {

    const t = await getTranslator(locale);

    return (
            <Box component="main">

                {/*Nav Header*/}
                <HeaderNavButtons items={[{name: t("fields.account"), link: "/auth/account"}]}/>

                {/*Title Section*/}
                <TitleSection title={t("fields.change_password")}/>

                {/*Password Form*/}
                <Container>

                    <ChangePasswordForm/>

                </Container>

                {/*Adsense Space*/}
                {/* <AdsenseAd
                tags_body={ad_sense.tags.body}
                photo_url={ad_sense.photo_url}
                width={ad_sense.width}
                height={ad_sense.height}
                id={`adsense-${AdsensePositions.PASSWORD_BOTTOM}`}
                            is_visible={ad_sense.is_visible}
            /> */}

            </Box>
    );
}

interface TitleModel {
    title: string;
}

function TitleSection({title}: TitleModel) {
    return (
            <Container component="section">
                <p className="font-bold">{title}</p>
            </Container>
    );
}
