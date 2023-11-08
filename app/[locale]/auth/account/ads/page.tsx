import {Box, Button, Container} from "@mui/material";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {getTranslator} from "next-intl/server";
import Link from "next/link";
import {GlobalInterface, TLocale} from "@/interfaces/global.interface";
import {get_customer_ads} from "@/api/requests.api";
import {format_date, format_page_num} from "@/util/formatting.util";
import AdsTableList from "@/components/common/lists/ads-table.list";
import PaginationBar from "@/components/common/pagination/pagination";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("fields.ads")]);
}

interface Props {
    params: {
        locale: TLocale;
    };
    searchParams: {
        page: string;
    };
}

interface LocaleProps {
    locale: string;
}

export default async function AdsPage(props: Props) {
    
    const {locale} = props.params;
    
    const {page} = props.searchParams;
    
    const parsed_page = format_page_num(page);
    
    const {ads, ad_sense} = await get_customer_ads(parsed_page);
    
    const t = await getTranslator(locale);
    
    return (
        
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: t("fields.my_ads_list"), link: "/auth/account/ads"}]}/>
            
            <Container maxWidth="xl" className="space-y-8">
                
                {/*Buttons Section*/}
                <ButtonsSection t={t}/>
                
                {/*Table Section*/}
                <AdsTableList
                    locale={locale}
                    page={parsed_page}
                    ads={ads.data.map((e) => {
                        return {
                            ...e,
                            created_at: format_date(e.created_at),
                        };
                    }).reverse()} />
                
                {/*Pagination*/}
                <PaginationBar
                    show={ads.last_page !== ads.first_page}
                    t={t}
                    base_url={"/auth/account/ads"}
                    current_page={parsed_page}
                    first_page={ads.first_page}
                    total_pages={ads.last_page}
                    per_page={ads.per_page}
                    total_count={ads.total_count}
                />

                {/*Adsense Space*/}
                <AdsenseAd
                    id={`adsense-${AdsensePositions.MY_ADS_BOTTOM}`}
                    tags_body={ad_sense.tags.body}
                    photo_url={ad_sense.photo_url}
                    width={ad_sense.width}
                    height={ad_sense.height}
                    is_visible={ad_sense.is_visible}
                />

            </Container>
        
        </Box>
    );
}

function ButtonsSection({t}: GlobalInterface) {
    return (
        <div className="flex justify-end items-center gap-4">
            <Button component={Link} href="/auth/account/ads/new" variant="contained" color="primary" sx={{color: "white"}}>
                {t!("fields.add")}
            </Button>
        </div>
    );
}


