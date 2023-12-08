"use client";
import {Box, Button, Container, TableCell, TableRow, Typography} from "@mui/material";
import {MainTable} from "@/components/common/tables/main.table";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next-intl/link";
import {GlobalInterface} from "@/interfaces/global.interface";
import {post_update_favorites} from "@/api/requests.api";
import {FavoritesModel, UpdateFavoritesModel} from "@/api/interfaces.api";
import {useState} from "react";
import {isString} from "lodash-es";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {useTranslations} from "next-intl";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {ConfirmationDialog} from "@/components/common/dialogs/confirmation.dialog";
import Image from "next/image";

interface TableSectionModel extends GlobalInterface {
    favorites: FavoritesModel[];
}

export default function FavoritesTableList({locale, favorites}: TableSectionModel) {
    
    const t = useTranslations();
    
    const headers_data = [
        "#",
        t("fields.image"),
        t("fields.name"),
        t("fields.actions"),
    ];
    
    const [favorites_list, set_favorites_list] = useState<FavoritesModel[]>(favorites);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [show_confirmation, set_show_confirmation] = useState<boolean>(false);
    const [selected_ad_id, set_selected_ad_id] = useState<string>("");
    
    const update_favorites = async () => {
        
        setIsLoading(true);
        await toggle_loading(true);
        
        const payload: UpdateFavoritesModel = {
            favorites: [selected_ad_id],
        };
        
        const result = await post_update_favorites(payload, locale!);
        
        if (isString(result)) {
            notify(true, result);
        } else {
            
            const new_favorites_list = [...favorites_list];

            const found_index = new_favorites_list.findIndex((e) => e.id === selected_ad_id);
            
            new_favorites_list.splice(found_index, 1);
            
            set_favorites_list(new_favorites_list);
            
            localStorage.setItem("favorites", JSON.stringify(result.favorites.map((e) => e.id)));
            
            notify(false, t("fields.operation_completed"));
        }
        
        setIsLoading(false);
        await toggle_loading(false);
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
                onConfirm={update_favorites}
            />
            
            {favorites_list.length === 0 ? (
                <Box minHeight="50vh" className="flex flex-col flex-1 gap-4 justify-center items-center">
                    
                    <ErrorOutlineIcon color="primary" sx={{fontSize: "8rem"}}/>
                    
                    <Typography variant="h6">{t!("favorites.empty_favorites")}</Typography>
                    
                </Box>
            ) : (
                <MainTable
                    sx={{padding: "0px .25rem"}}
                    headers={headers_data}
                    rows={favorites_list.map((e, i) => (
                        <TableRow key={e.id}>
                            
                            <TableCell>{i + 1}</TableCell>
    
                            <TableCell>
                                <Image
                                    src={e.card_url}
                                    alt={e.names[locale!]}
                                    width={92}
                                    height={92}
                                    className="w-[92px] h-[92px] object-contain"
                                />
                            </TableCell>
                            
                            <TableCell>
                                <Link
                                    href={`/ads/details/${e.slug}`}
                                    className="text-blue-400 font-bold">
                                    {e.names[locale!]}
                                </Link>
                            </TableCell>
                            
                            <TableCell>
                                
                                <Button
                                    onClick={() => {
                                        set_selected_ad_id(e.id);
                                        set_show_confirmation(true);
                                    }}
                                    disabled={isLoading}
                                    sx={{minWidth: "48px", padding: "5px 5px"}}
                                    variant="outlined"
                                    color={"error"}
                                >
                                    <CloseIcon/>
                                </Button>
                                
                            </TableCell>
                            
                        </TableRow>
                    ))}
                />
            )}
        </Container>
    );
}
