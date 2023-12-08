import AdCard from "@/components/common/cards/ad.card";
import {Box} from "@mui/material";
import SectionLabelText from "@/components/common/texts/section-label.text";
import {GlobalInterface} from "@/interfaces/global.interface";
import Link from "next/link";
import ViewMoreButton from "@/components/common/buttons/view-more.button";
import {AdModel} from "@/api/interfaces.api";

interface Props extends GlobalInterface {
    data: AdModel[];
}

export default function HomeNewArrivalsSection({locale, data, t}: Props) {
    
    return (
        <Box component="section" className="space-y-2">
            
            <Box className="flex justify-between items-center">
                <SectionLabelText label={t!("fields.new_arrivals")}/>
                <Link href="/ads/new?page=1">
                    <ViewMoreButton t={t}/>
                </Link>
            </Box>
            
            <Box className="grid lg:grid-cols-4 grid-cols-2 gap-4">
                {data.map((e) => {
                    return (
                        <AdCard
                            key={e.id}
                            id={e.id}
                            slug={e.slug}
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
