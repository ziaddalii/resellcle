import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {notFound} from "next/navigation";
import {getTranslator} from "next-intl/server";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import PaginationBar from "@/components/common/pagination/pagination";
import {Metadata} from "next";
import {build_meta_data} from "@/app/[locale]/layout";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {get_ads_type} from "@/api/requests.api";
import {AdsList} from "@/components/common/lists/ads.list";
import {format_page_num} from "@/util/formatting.util";
import {TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({params: {locale, type}}: Props): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t(`pages.ads_${type}`)]);
}

const ad_types = ["new", "paid", "pinned"];

interface Props {
    params: {
        type: "new" | "paid" | "pinned";
        locale: TLocale;
    };
    searchParams: {
        page: string;
    };
}

export default async function AdsTypeFullPaginationPage(props: Props) {
    
    const {locale, type} = props.params;
    const {page} = props.searchParams;
    
    const parsed_page = format_page_num(page);
    
    
    const t = await getTranslator(locale);
    
    //VALIDATE TYPE
    if (!ad_types.includes(type)) {
        notFound();
    }
    
    const response_data = await get_ads_type(type, page ? page : 1);
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: t(`fields.ads_${type}`), link: `/ads/${type}`}]}/>
            
            <Container maxWidth="xl" component="section" className="space-y-8">
                
                {/*Ads List*/}
                <AdsList items={response_data.ads.data} locale={locale} t={t}/>
                
                {/*Pagination*/}
                <PaginationBar
                    base_url={`/ads/${type}`}
                    current_page={parsed_page}
                    first_page={response_data.ads.first_page}
                    total_pages={response_data.ads.last_page}
                    per_page={response_data.ads.per_page}
                    total_count={response_data.ads.total_count}
                    t={t}
                />
                
                <AdsenseAd
                    id={`adsense-${AdsensePositions.ADS_BOTTOM}`}
                    tags_body={response_data.ad_sense.tags.body}
                    photo_url={response_data.ad_sense.photo_url}
                    width={response_data.ad_sense.width}
                    height={response_data.ad_sense.height}
                    is_visible={response_data.ad_sense.is_visible}
                />
            
            </Container>
        
        </Box>
    );
}
