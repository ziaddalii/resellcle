import {Box, Container} from "@mui/material";
import {build_meta_data} from "@/app/[locale]/layout";
import {Metadata} from "next";
import SellerHeaderSection from "@/components/pages/seller/seller.header.section";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {getTranslator} from "next-intl/server";
import {format_page_num} from "@/util/formatting.util";
import {get_seller_page} from "@/api/requests.api";
import {notFound} from "next/navigation";
import {AdsList} from "@/components/common/lists/ads.list";
import PaginationBar from "@/components/common/pagination/pagination";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import {TLocale} from "@/interfaces/global.interface";


interface Props {
    params: {
        seller_id: string;
        name: string;
        locale: TLocale;
    };
    searchParams: {
        page: string;
    };
}

export async function generateMetadata(
    {
        params: {locale, seller_id, name},
        searchParams: {page},
    }: Props
): Promise<Metadata> {
    
    const t = await getTranslator(locale);
    
    const {seller} = await get_seller_page(seller_id, format_page_num(page));
    
    return {
        ...(await build_meta_data(locale, [seller.names[locale]])),
        description: seller.descriptions[locale],
        openGraph: {
            title: seller.names[locale],
            description: seller.descriptions[locale],
            url: `https://resellcle.com/${locale}/sellers/${seller_id}/${encodeURIComponent(name)}`,
            locale,
            images: {
                url: seller.logo,
                alt: seller.description,
            },
            siteName: t!("app.name"),
            authors: seller.names[locale],
            tags: [seller.name, seller.description].join(" - "),
        },
        twitter: {
            title: seller.names[locale],
            description: seller.descriptions[locale],
            card: "summary_large_image",
            images: {
                url: seller.logo,
                alt: seller.description,
            },
            creator: seller.names[locale],
            site: "www.resellcle.com",
        },
    };
}

export default async function SellerProfilePage(props: Props) {
    
    const {locale, name, seller_id} = props.params;
    const {page} = props.searchParams;
    
    const parsed_page = format_page_num(page);
    const {seller, ads, ad_sense} = await get_seller_page(seller_id, parsed_page);
    
    //VALIDATE ID / NAME
    if (!seller.id) {
        notFound();
    }
    
    const t = await getTranslator(locale);
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons
                items={[
                    {
                        name: t("fields.seller_n", {name: seller.names[locale]}),
                        link: `/sellers/${seller_id}/${encodeURIComponent(name)}`,
                    },
                ]}
            />
            
            {/*Seller Section*/}
            <SellerHeaderSection locale={locale} seller={seller}/>
            
            <Container maxWidth="xl" className="space-y-8">
                
                {/*Ads List*/}
                <AdsList
                    items={ads.data}
                    t={t}
                    locale={locale}/>
                
                {/*Pagination*/}
                <PaginationBar
                    t={t}
                    base_url={`/sellers/${seller_id}/${encodeURIComponent(name)}`}
                    current_page={parsed_page}
                    first_page={ads.first_page}
                    total_pages={ads.last_page}
                    per_page={ads.per_page}
                    total_count={ads.total_count}
                />
                
                <AdsenseAd
                    tags_body={ad_sense.tags.body}
                    photo_url={ad_sense.photo_url}
                    width={ad_sense.width}
                    height={ad_sense.height}
                    id={`adsense-${AdsensePositions.SELLER_PROFILE_BOTTOM}`}
                    is_visible={ad_sense.is_visible}
                />
            
            </Container>
        
        </Box>
    );
}
