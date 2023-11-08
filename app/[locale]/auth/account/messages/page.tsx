import {Box, Container, Typography} from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import {Metadata} from "next";
import {build_meta_data, LocaleParams} from "@/app/[locale]/layout";
import {getTranslator} from "next-intl/server";
import {TLocale} from "@/interfaces/global.interface";
import MessagesTableList from "@/components/common/lists/messages.table.list";
import {get_messages} from "@/api/requests.api";
import {format_page_num} from "@/util/formatting.util";
import SmsFailedIcon from "@mui/icons-material/SmsFailed";
import MessageDetails from "@/components/pages/messages/message-details.messages";

export async function generateMetadata({ params: { locale } }: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("fields.messages")]);
}

interface Props {
    params: {
        locale: TLocale;
    };
    searchParams: {
        page: string;
        chat: string;
    };
}

interface LocaleProps {
    locale: TLocale;
}

export default async function MessagesPage(props: Props) {
    const { locale } = props.params;
    const { page, chat } = props.searchParams;

    const t = await getTranslator(locale);
    const parsed_page = format_page_num(page);
    const messages = await get_messages(parsed_page);

    return (
        <Box component="main" sx={{minHeight:"auto"}}>
            {/*Nav Header*/}
            <HeaderNavButtons items={[{ name: t("messages.title"), link: "/auth/account/messages" }]} />

            {/*Chats Section*/}
            <Container
                component="section"
                maxWidth="xl"
                className="!flex md:flex-row flex-col justify-center items-center gap-10 md:min-h-[70vh]">

                <article
                    id="messages_list"
                    className="max-h-[70vh] md:h-full overflow-y-scroll md:overflow-hidden w-full md:w-1/2 self-start"
                >
                    <MessagesTableList locale={locale} current_chat_id={chat} messages={messages} page={parsed_page} />
                </article>

                <article className="w-full md:w-1/2 h-full">
                    {chat ? (
                        <MessageDetails message_id={chat} locale={locale} />
                    ) : (
                        <Box className="flex flex-col flex-1 gap-4 h-full justify-center items-center">
                            <SmsFailedIcon color="primary" sx={{ fontSize: "8rem" }} />
                            <Typography variant="h6">{t!("messages.select_chat")}</Typography>
                        </Box>
                    )}
                </article>
                
            </Container>

            {/*Adsense Space*/}
            {/*<AdsenseAd*/}
            {/*    id={`adsense-${AdsensePositions.MESSAGES_BOTTOM}`}*/}
            {/*    tags_body={response_data.ad_sense.bottom.tags.body}*/}
            {/*    photo_url={response_data.ad_sense.bottom.photo_url}*/}
            {/*    width={response_data.ad_sense.bottom.width}*/}
            {/*    height={response_data.ad_sense.bottom.height}*/}
            {/*is_visible={ad_sense.is_visible}*/}
            {/*/>*/}
            
        </Box>
    );
}
