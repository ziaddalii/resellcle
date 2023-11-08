import AdCard from "@/components/common/cards/ad.card";
import {Box} from "@mui/material";
import SectionLabelText from "@/components/common/texts/section-label.text";
import ViewMoreButton from "@/components/common/buttons/view-more.button";
import Link from "next/link";
import {GlobalInterface} from "@/interfaces/global.interface";
import {AdModel} from "@/api/interfaces.api";


interface Props extends GlobalInterface {
    data: AdModel[]
}

export default function HomePinnedAdsSection({locale, data, t}: Props) {
    
    return (
        <Box component="section" className="space-y-2">
            
            <Box className="flex justify-between items-center">
                <SectionLabelText label={t!("fields.pinned_ads")}/>
                <Link href="/ads/pinned?page=1">
                    <ViewMoreButton t={t}/>
                </Link>
            </Box>
            
            <Box className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                {data.map((e) => {
                    return (
                        <AdCard
                            key={e.id}
                            id={e.id}
                            name={e.names[locale]}
                            names={e.names}
                            card_url={e.card_url}
                            price={e.price}
                            duration={e.created_at}
                            categories={e.categories}
                            comments={e.comments}
                            created_at={e.created_at}
                            description={e.description}
                            descriptions={e.descriptions}
                            extras={e.extras}
                            location={e.location}
                            order={e.order}
                            photos={e.photos}
                            seller={e.seller}
                            seo_tags={e.seo_tags}
                            status={e.status}
                            state={e.state}
                            locale={locale}
                            t={t}
                        />
                    );
                })}
            </Box>
        
        </Box>
    );
}
