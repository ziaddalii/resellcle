import {Box, Button, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import PersonIcon from "@mui/icons-material/Person";
import {Metadata} from "next";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {getTranslator} from "next-intl/server";
import {ThirdPartyRegisterSection} from "@/components/pages/auth/third-party-register.section";
import Link from "next-intl/link";
import LoginForm from "@/components/common/form/login.form";
import {GlobalInterface, TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.login")]);
}

interface Props {
    params: {
        locale: TLocale;
    };
}

interface LocaleProps {
    locale: string;
}

export default async function LoginPage({params: {locale}}: Props) {
    
    const t = await getTranslator(locale);
    
    // const {ad_sense} = await get_login();
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: t("pages.login"), link: "/auth/login"}]}/>
            
            {/*Register Section*/}
            <Container className="!bg-secondary-100 space-y-4 p-4">
                
                <RegisterSection t={t}/>
                
                {/*Third Party Register Buttons*/}
                <ThirdPartyRegisterSection t={t}/>
                
                <Box className="flex gap-2">
                    <PersonIcon/>
                    <p className="font-bold">{t("pages.login")}</p>
                </Box>
                
                {/*Login */}
                <LoginForm locale={locale}/>
            
            </Container>
            
            {/*Adsense Space*/}
            {/* <AdsenseAd
                tags_body={ad_sense.tags.body}
                photo_url={ad_sense.photo_url}
                width={ad_sense.width}
                height={ad_sense.height}
                id={`adsense-${AdsensePositions.LOGIN_BOTTOM}`}
                            is_visible={ad_sense.is_visible}
            /> */}
        </Box>
    );
}

function RegisterSection({t}: GlobalInterface) {
    return (
        <Container component="section">
            <div className="flex justify-center">
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        color: "white",
                        padding: ".5rem 1rem",
                        fontWeight: "bold",
                    }}
                >
                    <Link href="/auth/register">{t!("login.register_new_account")}</Link>
                </Button>
            </div>
        </Container>
    );
}
