import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {getTranslator} from "next-intl/server";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {TLocale} from "@/interfaces/global.interface";
import {get_favorites} from "@/api/requests.api";
import FavoritesTableList from "@/components/common/lists/favorites-table.list";
import {cookies} from "next/headers";
import {notFound} from "next/navigation";
import {AdsensePositions} from "@/enums/adsense-positions.enum";
import AdsenseAd from "@/components/common/ads/adsense.ad";

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("favorites.favorites")]);
}

interface Props {
    params: {
        locale: TLocale;
    };
}

export default async function FavoritesPage({params: {locale}}: Props) {
    const token = await cookies().get("token");
    
    if (!token) {
        notFound();
    }
    
    const t = await getTranslator(locale);
    
    const {favorites, ad_sense} = await get_favorites();
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: t("favorites.favorites"), link: "/auth/account/favorites"}]}/>
            
            <Container maxWidth="xl" component="section" className="space-y-8">
                
                {/*Table Section*/}
                <FavoritesTableList favorites={favorites.reverse()} locale={locale}/>
                
                {/*Adsense Space*/}
                <AdsenseAd
                    id={`adsense-${AdsensePositions.FAVORITES_BOTTOM}`}
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
