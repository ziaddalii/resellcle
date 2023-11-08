import {Box, Container} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {ReactNode} from "react";
import {getTranslator} from "next-intl/server";
import {Metadata} from "next";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import PersonIcon from "@mui/icons-material/Person";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import StarIcon from "@mui/icons-material/Star";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {GlobalInterface, TLocale} from "@/interfaces/global.interface";

export async function generateMetadata({ params: { locale } }: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("fields.my_account")]);
}

interface Props {
    params: {
        query: string;
        locale: TLocale;
    };
}

export default async function AccountPage({ params: { locale, query } }: Props) {
    
    const t = await getTranslator(locale);
    
    return (
        <Box component="main">
            
            {/*Nav Header*/}
            <HeaderNavButtons items={[{ name: t("fields.account"), link: "/auth/account" }]} />

            <Container maxWidth="xl" className="space-y-8">
                
                {/*Columns Section*/}
                <AccountColumnsSection t={t} />

                {/*Adsense Space*/}
                {/*<AdsenseAd*/}
                {/*    id={`adsense-${AdsensePositions.ACCOUNT_BOTTOM}`}*/}
                {/*    tags_body={response_data.ad_sense.tags.body}*/}
                {/*    photo_url={response_data.ad_sense.photo_url}*/}
                {/*    width={response_data.ad_sense.width}*/}
                {/*    height={response_data.ad_sense.height}*/}
                {/*is_visible={ad_sense.is_visible}*/}
                {/*/>*/}
                
            </Container>
            
        </Box>
    );
}

interface AccountColumnsSectionProps extends GlobalInterface{}

function AccountColumnsSection({ t }: AccountColumnsSectionProps) {

    const items: AccountGroup[] = [
        {
            id: "01",
            title: t!("fields.my_account"),
            items: [
                {
                    icon: <PersonIcon />,
                    name: t!("account.edit_your_account_information"),
                    link: "account/personal-info",
                },
                {
                    icon: <LockOpenIcon />,
                    name: t!("account.change_your_password"),
                    link: "account/password",
                },
                {
                    icon: <StarIcon />,
                    name: t!("account.modify_your_wish_list"),
                    link: "account/favorites",
                },
                {
                    icon: <ForumIcon />,
                    name: t!("fields.messages"),
                    link: "account/messages",
                },
                {
                    icon: <NotificationsIcon />,
                    name: t!("fields.notifications"),
                    link: "account/notifications",
                },
            ],
        },
        {
            id: "02",
            title: t!("fields.my_ads"),
            items: [
                {
                    icon: <PersonIcon />,
                    name: t!("fields.my_profile"),
                    link: "account/seller ",
                },
                {
                    icon: <AddIcon />,
                    name: t!("fields.post_free_ad"),
                    link: "account/ads/new",
                },
                {
                    icon: <FormatListBulletedIcon />,
                    name: t!("fields.my_ads_list"),
                    link: "account/ads",
                },
            ],
        },
        {
            id: "03",
            title: t!("fields.newsletter"),
            items: [
                {
                    icon: <EmailIcon />,
                    name: t!("account.subscribe_unsubscribe_to_newsletter"),
                    link: "account/personal-info",
                },
            ],
        },
    ];

    return (
        <section className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-between gap-4">
            {items.map((column) => {
                return <AccountGroup key={column.id} title={column.title} items={column.items} />;
            })}
        </section>
    );
}

export interface AccountGroup {
    id: string;
    title: string;
    icon?: ReactNode;
    items: {
        icon?: ReactNode;
        name: string;
        link: string;
    }[];
}

interface AccountGroupProps {
    title: string;
    icon?: ReactNode;
    items: {
        icon?: ReactNode;
        name: string;
        link: string;
    }[];
}

function AccountGroup({ title, icon, items }: AccountGroupProps) {
    return (
        <article className="col-span-1 pb-4">
            
            <div className="bg-secondary-200 text-white font-bold p-2">
                <h2>{title}</h2>
            </div>
            
            <ul className="text-black space-y-4 px-2 mt-2">
                {items.map((item, i) => (
                    <li
                        key={i}
                        className="flex gap-1 transitions-all duration-500 text-secondary-500 hover:text-primary-500"
                    >
                        {icon && icon}
                        {item.icon && item.icon}
                        <a href={item.link}>{item.name}</a>
                    </li>
                ))}
            </ul>
            
        </article>
    );
}
