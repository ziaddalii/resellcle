"use client";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import {GlobalInterface} from "@/interfaces/global.interface";
import {GetMessages} from "@/api/interfaces.api";
import {SyntheticEvent, useState} from "react";
import {useTranslations} from "next-intl";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ChatCard from "../cards/chat.card";
import {format_duration_diff_from_months_to_seconds} from "@/util/formatting.util";
import DefaultAvatar from "@/public/seller/default_avatar.webp";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;
    
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface TableSectionModel extends GlobalInterface {
    current_chat_id: string;
    messages: GetMessages;
    page: number;
}

export default function MessagesTableList({locale, current_chat_id, page, messages}: TableSectionModel) {
    const user_id = getCookie("user_id");
    
    const [current_tab, set_current_tab] = useState<number>(0);
    
    const [current_messages, set_current_messages] = useState(messages.all.data);
    
    const on_change = (event: SyntheticEvent, new_tab: number) => {
        set_current_tab(new_tab);
        
        switch (new_tab) {
            case 0:
                set_current_messages(messages.all.data);
                break;
            case 1:
                set_current_messages(messages.as_owner);
                break;
            case 2:
                set_current_messages(messages.as_requester);
                break;
        }
    };
    
    const t = useTranslations();
    
    const format_duration = (timestamp: string) => format_duration_diff_from_months_to_seconds(timestamp, t);
    
    return (
        <Box>

            <h2 className="font-bold text-xl py-4">{t("messages.inbox")}</h2>

            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={current_tab} onChange={on_change} aria-label="basic tabs example">
                    <Tab label={t("fields.all")} {...a11yProps(0)} />
                    <Tab label={t("fields.as_owner")} {...a11yProps(1)} />
                    <Tab label={t("fields.as_requester")} {...a11yProps(2)} />
                </Tabs>
            </Box>
    
            {[0, 1, 2].map((tab) => (
                <CustomTabPanel key={`chat-${tab}`} value={current_tab} index={tab}>
                    {current_messages.length === 0 ? (
                        <Box minHeight="50vh" className="flex flex-col flex-1 gap-4 justify-center items-center">
                            <ErrorOutlineIcon color="primary" sx={{fontSize: "8rem"}}/>
                            <Typography variant="h6">{t!("messages.empty_messages")}</Typography>
                        </Box>
                    ) : (
                        current_messages.map((e) => (
                            <ChatCard
                                key={`tab-${tab}-${e.id}`}
                                chat_id={e.id}
                                chat_image={user_id === e.requester.id ? e.owner.photoUrl !== "" ? e.owner.photoUrl : DefaultAvatar.src : e.requester.photoUrl !== "" ? e.requester.photoUrl : DefaultAvatar.src}
                                chat_user={user_id === e.requester.id ? e.owner.full_name : e.requester.full_name}
                                chat_ad={e.ad.names[locale!]}
                                last_message={e.chat_log[e.chat_log.length - 1].message}
                                last_message_date={format_duration(e.chat_log[e.chat_log.length - 1].created_at, t)}
                                is_selected={current_chat_id === e.id}
                            />
                        ))
                    )}
                </CustomTabPanel>
            ))}
            
        </Box>
    );
}
