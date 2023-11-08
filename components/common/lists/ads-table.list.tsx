"use client";
import {Box, Button, Container, TableCell, TableRow, Typography} from "@mui/material";
import {MainTable} from "@/components/common/tables/main.table";
import CloseIcon from "@mui/icons-material/Close";
import {GlobalInterface} from "@/interfaces/global.interface";
import {send_delete_ad} from "@/api/requests.api";
import {AdModel} from "@/api/interfaces.api";
import {useState} from "react";
import {isString} from "lodash-es";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {useTranslations} from "next-intl";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EditIcon from "@mui/icons-material/Edit";
import {get_ad_state_text} from "@/util/formatting.util";
import {useRouter} from "next-intl/client";
import Image from "next/image";
import {ConfirmationDialog} from "@/components/common/dialogs/confirmation.dialog";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";

interface TableSectionModel extends GlobalInterface {
    ads: AdModel[];
}

export default function AdsTableList({locale, ads}: TableSectionModel) {
    
    const router = useRouter();
    
    const t = useTranslations();
    
    const headers_data = [
        "#",
        t("fields.photo"),
        t("fields.name"),
        t("fields.description"),
        t("fields.status"),
        t("fields.date_added"),
        t("fields.actions"),
    ];
    
    const [ads_list, set_ads_list] = useState<AdModel[]>(ads);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [show_confirmation, set_show_confirmation] = useState<boolean>(false);
    const [selected_ad_id, set_selected_ad_id] = useState<string>("");
    
    const delete_ad = async () => {
        
        setIsLoading(true);
        await toggle_loading(true);
        
        const result = await send_delete_ad(selected_ad_id, locale!);
        
        if (isString(result)) {
            notify(true, result);
        } else {
            const found_index = ads_list.findIndex((e) => e.id === selected_ad_id);
    
            const new_ads_list = [...ads_list];
            new_ads_list.splice(found_index, 1);
            
            set_ads_list(new_ads_list);
    
            notify(false, t("fields.operation_completed"));
        }
    
        setIsLoading(false);
        await toggle_loading(false);
    };
    
    const edit_ad = (e) => {
        router.push(`/auth/account/ads/edit/${e.id}`);
    };
    
    return (
        <Container component="section" className="space-y-8">
            
            <ConfirmationDialog
                t={t!}
                show={show_confirmation}
                onClose={() => {
                    set_selected_ad_id("");
                    set_show_confirmation(false);
                }}
                onConfirm={delete_ad}
            />
            
            {ads_list.length === 0 ? (
                <Box minHeight="50vh" className="flex flex-col flex-1 gap-4 justify-center items-center">
                    
                    <ErrorOutlineIcon color="primary" sx={{fontSize: "8rem"}}/>
                    
                    <Typography variant="h6">{t!("ads.empty_ads")}</Typography>
                
                </Box>
            ) : (
                <MainTable
                    sx={{padding: "0px .25rem"}}
                    headers={headers_data}
                    rows={ads_list.map((e, i) => (
                        <TableRow key={e.id}>
                            
                            <TableCell>{i + 1}</TableCell>
                            
                            <TableCell>
                                <Image
                                    src={e.card_url}
                                    alt={e.name}
                                    width={92}
                                    height={92}
                                    className="w-[92px] h-[92px] object-contain"
                                />
                            </TableCell>
                            
                            <TableCell>
                                <a
                                    href={`/ads/details/${e.id}/${encodeURIComponent(e.names.en)}`}
                                    className="text-blue-400 font-bold"
                                >
                                    {e.names[locale!]}
                                </a>
                            </TableCell>
                            
                            <TableCell>
                                {e.descriptions[locale!]}
                            </TableCell>
                            
                            <TableCell>{t(get_ad_state_text(e.state))}</TableCell>
                            
                            <TableCell>{e.created_at}</TableCell>
                            
                            <TableCell>
                                
                                <Box className="flex gap-2 items-center">
                                    
                                    <Button
                                        onClick={() => edit_ad(e)}
                                        disabled={isLoading}
                                        sx={{minWidth: "48px", padding: "5px 5px"}}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        <EditIcon/>
                                    </Button>
                                    
                                    <Button
                                        onClick={() => {
                                            set_selected_ad_id(e.id);
                                            set_show_confirmation(true);
                                        }}
                                        disabled={isLoading}
                                        sx={{minWidth: "48px", padding: "5px 5px"}}
                                        variant="outlined"
                                        color="error">
                                        <CloseIcon/>
                                    </Button>
                                
                                </Box>
                            
                            </TableCell>
                        
                        </TableRow>
                    ))}
                />
            )}
        
        </Container>
    );
}
