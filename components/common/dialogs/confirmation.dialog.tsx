"use client";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {GlobalInterface} from "@/interfaces/global.interface";
import {useState} from "react";

interface Props extends GlobalInterface {
    show: boolean;
    onConfirm: Function;
    onClose: Function;
}

export function ConfirmationDialog({t, show, onConfirm, onClose}: Props) {
    
    const [is_disabled, set_is_disabled] = useState<boolean>(false);
    
    const wrap_disabled = async (callback: Function) => {
        set_is_disabled(true);
        await callback();
        set_is_disabled(false);
    };
    
    const on_confirm = async () => {
        await wrap_disabled(onConfirm);
        onClose();
    };
    
    return (
        <Dialog open={show} onClose={onClose}>
            
            <DialogTitle> {t!("fields.confirmation")}</DialogTitle>
            
            <DialogContent>
                {t!("placeholders.are_you_sure")}
            </DialogContent>
            
            <DialogActions>
                <Button
                    disabled={is_disabled}
                    onClick={onClose}>{t!("fields.cancel")}</Button>
                <Button
                    disabled={is_disabled}
                    onClick={on_confirm}>{t!("fields.confirm")}</Button>
            </DialogActions>
        
        </Dialog>
    );
}
