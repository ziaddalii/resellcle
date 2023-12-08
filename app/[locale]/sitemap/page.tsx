import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import Link from "next/link";
import {build_meta_data} from "@/app/[locale]/layout";
import {Metadata} from "next";
import {getTranslator} from "next-intl/server";
import {get_sitemap} from "@/api/requests.api";
import Image from "next/image";
import {TLocale} from "@/interfaces/global.interface";

interface LocaleParams {
    locale: TLocale;
}

export async function generateMetadata({params: {locale}}: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("pages.sitemap")]);
}

interface SitemapModel {
    head: string;
    link: string;
    branches: {
        branch: string;
        branch_link: string;
    }[];
}

interface Props {
    params: {
        locale: TLocale;
    };
}

export default async function SiteMapPage({params: {locale}}: Props) {
    
    const {static_pages, categories} = await get_sitemap();
    
    const t = await getTranslator(locale);
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{name: t("pages.sitemap"), link: "/site-map"}]}/>
            
            <Container maxWidth="xl">
                
                {/*Title*/}
                <p className="font-bold text-lg">{t("pages.categories")}</p>
                
                {/*Body*/}
                <Box className="grid grid-cols-2 p-2 space-y-2">
                    {categories.filter((e) => e.sub_categories.length > 0).map((category, i) => {
                        return (
                            <ul key={i}
                                className="col-span-2 space-y-2">
                                <li>
                                    
                                    <Link href={`categories/${category.slug}`}
                                          className="font-bold flex items-center gap-2">
                                        <Image
                                            width={60}
                                            height={60}
                                            className="rounded-full h-[60px]"
                                            src={category.icon_url}
                                            alt={category.names[locale]}
                                        />
                                        {category.names[locale]}
                                    </Link>
                                    
                                    <ul className="flex gap-4 my-2 ps-4">
                                        {category.sub_categories.map((subcategory, i) => {
                                            return (
                                                <li key={i}>
                                                    <Link
                                                        className="flex flex-wrap items-center gap-2"
                                                        href={`categories/${category.slug}/${subcategory.slug}}`}
                                                    >
                                                        <Image
                                                            className="rounded-full object-cover h-[40px]"
                                                            width={40}
                                                            height={40}
                                                            src={subcategory.icon_url}
                                                            alt={subcategory.names[locale]}
                                                        />
                                                        {subcategory.names[locale]}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            </ul>
                        );
                    })}
                
                </Box>
                
                {/*Title*/}
                <p className="font-bold text-lg">{t("fields.ads")}</p>
                
                {/*Body*/}
                <Box className="grid grid-cols-2 p-2 space-y-2">
                    
                    <ul className="col-span-2 flex gap-4 my-2 ps-4">
                        
                        <li>
                            <Link href={"/ads/pinned?page=1"}>
                                {t("fields.pinned_ads")}
                            </Link>
                        </li>
                        
                        <li>
                            <Link href={"/ads/paid?page=1"}>
                                {t("fields.paid_ads")}
                            </Link>
                        </li>
                        
                        <li>
                            <Link href={"/ads/new?page=1"}>
                                {t("fields.new_arrivals")}
                            </Link>
                        </li>
                    </ul>
                
                </Box>
                
                {/*Title*/}
                <p className="font-bold text-lg">{t("fields.information")}</p>
                
                {/*Body*/}
                <Box className="grid grid-cols-2 p-2 space-y-2">
                    
                    <ul className="col-span-2 flex gap-4 my-2 ps-4">
                        
                        <li>
                            <Link href={"/about"}>
                                {static_pages.about.titles[locale]}
                            </Link>
                        </li>
                        
                        <li>
                            <Link href={"/privacy"}>
                                {static_pages.privacy.titles[locale]}
                            </Link>
                        </li>
                        
                        <li>
                            <Link href={"/terms"}>
                                {static_pages.terms.titles[locale]}
                            </Link>
                        </li>
                    
                    </ul>
                
                </Box>
            
            </Container>
        
        </Box>
    );
}
