"use client";
import {Box, Button, Container, TableCell, TableRow, Typography} from "@mui/material";
import {MainTable} from "@/components/common/tables/main.table";
import CloseIcon from "@mui/icons-material/Close";
import {GlobalInterface} from "@/interfaces/global.interface";
import {post_delete_notifications} from "@/api/requests.api";
import {NotificationModel} from "@/api/interfaces.api";
import {useState} from "react";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {useTranslations} from "next-intl";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {ConfirmationDialog} from "@/components/common/dialogs/confirmation.dialog";
import {isString} from "lodash-es";
import {get_notification_type_link, get_notification_type_name} from "@/enums/notification-type.enum";

interface TableSectionModel extends GlobalInterface {
    notifications: NotificationModel[];
}

export default function NotificationsTableList({locale, notifications}: TableSectionModel) {
    
    const t = useTranslations();
    
    const headers_data = [
        "#",
        t("fields.type"),
        t("fields.from"),
        t("fields.content"),
        t("fields.actions"),
    ];
    
    const [notifications_list, set_notifications_list] = useState<NotificationModel[]>(notifications);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [show_confirmation, set_show_confirmation] = useState<boolean>(false);
    const [selected_notification_id, set_selected_notification_id] = useState<string>("");
    
    const delete_notification = async () => {
        
        // BASIC INFORMATION
        setIsLoading(true);
        await toggle_loading(true);
        
        const form_data = new FormData();
        form_data.append("notifications[]", selected_notification_id);
        
        const result = await post_delete_notifications(form_data, locale!);
        
        if (isString(result)) {
            notify(true, result);
        } else {
            
            const new_notifications_list = [...notifications_list];
            
            const found_index = new_notifications_list.findIndex((e) => e.id === selected_notification_id);
            
            new_notifications_list.splice(found_index, 1);
            
            set_notifications_list(new_notifications_list);

            localStorage.setItem("notifications", (new_notifications_list && new_notifications_list.length) || "0");

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
                    set_selected_notification_id("");
                    set_show_confirmation(false);
                }}
                onConfirm={delete_notification}
            />
            
            {notifications_list.length === 0 ? (
                <Box minHeight="50vh" className="flex flex-col flex-1 gap-4 justify-center items-center">
                    
                    <ErrorOutlineIcon color="primary" sx={{fontSize: "8rem"}}/>
                    
                    <Typography variant="h6">{t!("notifications.empty_notifications")}</Typography>
                
                </Box>
            ) : (
                <MainTable
                    sx={{padding: "0px .25rem"}}
                    headers={headers_data}
                    rows={notifications_list.map((e, i) => (
                        <TableRow key={e.id}>
                            
                            <TableCell>
                                <p>{i + 1}</p>
                            </TableCell>
                            
                            <TableCell>
                                <a
                                    href={get_notification_type_link(e.type, e.ref)}
                                    className="text-blue-400 font-bold"
                                >
                                    {get_notification_type_name(e.type, t)}
                                </a>
                            </TableCell>
                            
                            
                            <TableCell>
                                <p className="capitalize">{e.from}</p>
                            </TableCell>
                            
                            <TableCell>
                                <p>{e.meta ?? "-"}</p>
                            </TableCell>
                            
                            <TableCell>
                                
                                <Button
                                    onClick={() => {
                                        set_selected_notification_id(e.id);
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
