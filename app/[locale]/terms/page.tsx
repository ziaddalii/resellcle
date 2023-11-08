import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {get_static_page} from "@/api/requests.api";
import {getTranslator} from "next-intl/server";
import {TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.terms")]);
}

interface Props {
    params: {
        locale: TLocale;
    }
}

export default async function TermsPage({params: {locale}}: Props) {
    
    const response_data = await get_static_page("terms");
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: response_data.titles[locale], link: "/terms"}]}/>
            
            <Container component="section" maxWidth="xl">
                
                {/*/!*Title*!/*/}
                {/*<p className="font-bold">{response_data.titles[locale]}</p>*/}
    
                {/*Body*/}
                <div
                    className="space-y-8 prose lg:prose-xl ql-editor"
                    dangerouslySetInnerHTML={{__html: response_data.body[locale]}}>
                </div>
            
            </Container>
        
        </Box>
    );
}

