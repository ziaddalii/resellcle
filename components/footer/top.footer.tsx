import {Box} from "@mui/material";
import Link from "next-intl/link";
import {ReactNode} from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {Category} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SearchIcon from "@mui/icons-material/Search";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import {CategoryModel, RegionsModel} from "@/api/interfaces.api";
import {GlobalInterface} from "@/interfaces/global.interface";
import ResellcleConfig from "@/util/config";

interface Props extends GlobalInterface {
    regions: RegionsModel[];
    categories: CategoryModel[];
}

const my_account_data: FooterGroupProps[] = [
    {
        title: "fields.my_account",
        items: [
            {
                icon: <PersonIcon />,
                name: "fields.my_account",
                link: "/auth/account",
            },
            {
                icon: <EmailIcon />,
                name: "fields.contact_us",
                link: "/contact-us",
            },
            {
                icon: <AddIcon />,
                name: "fields.post_free_ad",
                link: "/auth/account/ads",
            },
            {
                icon: <AddBusinessIcon />,
                name: "fields.ads_pinned",
                link: "/ads/pinned",
            },
            // {
            //     icon: <AddBusinessIcon/>,
            //     name: "fields.ads_paid",
            //     link: "/ads/paid",
            // },
            {
                icon: <AddBusinessIcon />,
                name: "fields.ads_new",
                link: "/ads/new",
            },
            {
                icon: <SearchIcon />,
                name: "fields.search_ads",
                link: "/#search-input",
            },
        ],
    },
];

const information_data: FooterGroupProps[] = [
    {
        title: "fields.information",
        items: [
            {
                icon: <LocationOnIcon />,
                name: "fields.sitemap",
                link: "/sitemap",
            },
            {
                icon: <DomainVerificationIcon />,
                name: "fields.about_us",
                link: "/about",
            },
            {
                icon: <DomainVerificationIcon />,
                name: "fields.privacy_policy",
                link: "/privacy",
            },
            {
                icon: <DomainVerificationIcon />,
                name: "fields.terms",
                link: "/terms",
            },
        ],
    },
];

export default async function TopFooterSection({ regions, categories, locale, t }: Props) {
    return (
        <Box className="bg-secondary-100 p-4">
            <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 justify-between">
               
                {/*Regions*/}
                {ResellcleConfig.ENABLE_REGIONS && (
                    <FooterGroup
                        title={t!("fields.regions")}
                        icon={<LocationOnIcon />}
                        items={regions.map((e: RegionsModel) => ({
                            name: e.names[locale!],
                            link: `/regions/${encodeURIComponent(e.names.en)}`,
                        }))}
                    />
                )}
                {/*Categories*/}
                <FooterGroup
                    single_column={false}
                    title={t!("fields.categories")}
                    icon={<Category />}
                    items={categories.map((e: CategoryModel) => ({
                        name: e.names[locale!],
                        link: e.super_category?.id
                            ? `/categories/${encodeURIComponent(e.super_category.slug)}/${encodeURIComponent(
                                  e.slug
                              )}`
                            : `/categories/${encodeURIComponent(e.slug)}`,
                    }))}
                />

                {/*My Account*/}
                {my_account_data.map((e, i) => (
                    <FooterGroup key={i} title={t!(e.title)} items={e.items.map((f) => ({ ...f, name: t!(f.name) }))} />
                ))}

                {/*Information*/}
                {information_data.map((e, i) => (
                    <FooterGroup key={i} title={t!(e.title)} items={e.items.map((f) => ({ ...f, name: t!(f.name) }))} />
                ))}
            </div>
        </Box>
    );
}

interface ItemsModel {
    icon?: ReactNode;
    name: string;
    link: string;
}

export interface FooterGroupProps {
    title: string;
    icon?: ReactNode;
    items: ItemsModel[];
    single_column?: boolean;
}

function FooterGroup({ title, icon, items, single_column = true }: FooterGroupProps) {
    const list: ReactNode = single_column ? (
        <ul className="text-black space-y-4 px-2 mt-2">
            {items.map((item, i) => (
                <li key={i} className="flex gap-1 link-primary">
                    {icon && icon}
                    {item.icon && item.icon}
                    <Link href={item.link}>{item.name}</Link>
                </li>
            ))}
        </ul>
    ) : (
        <ul className="text-black gap-2 px-2 mt-2 grid grid-cols-2">
            {items.map((item, i) => (
                <li key={i} className="flex gap-1 link-primary">
                    {icon && icon}
                    {item.icon && item.icon}
                    <Link href={item.link}>{item.name}</Link>
                </li>
            ))}
        </ul>
    );

    return (
        <article className="col-span-1">
            <div className="bg-secondary-200 text-white font-bold p-2">
                <h2>{title}</h2>
            </div>
            {list}
        </article>
    );
}
