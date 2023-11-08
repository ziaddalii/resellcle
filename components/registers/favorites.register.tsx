"use client";
import {useEffect} from "react";
import {is_authenticated} from "@/api/cookies.api";
import {get_favorites} from "@/api/requests.api";

export function FavoritesRegister() {
    
    useEffect(() => {
        
        if (!is_authenticated()) {
            return;
        }
        
        get_favorites().then((favorites_list) => {
            localStorage.setItem(
                "favorites",
                JSON.stringify(
                    favorites_list.favorites.map(e => e.id)
                )
            );
        });
        
    }, []);
    
    return (<></>);
}
