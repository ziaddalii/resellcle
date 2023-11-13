"use client";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {Box, Button, IconButton} from "@mui/material";
import {useTranslations} from "use-intl";
import {useEffect, useState} from "react";
import {post_update_favorites} from "@/api/requests.api";
import {GlobalInterface} from "@/interfaces/global.interface";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {isString} from "lodash-es";
import {UpdateFavoritesModel} from "@/api/interfaces.api";
import {sleep} from "@/util/formatting.util";
import {is_authenticated} from "@/api/cookies.api";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next-intl/client";

interface Props extends GlobalInterface {
    alt?: boolean;
    ad_id: string;
}

export default function FavoriteButton({ alt = false, ad_id, locale }: Props) {
    const [favorites_list, set_favorites_list] = useState<string[]>([]);
    const [is_disabled, set_is_disabled] = useState<boolean>(true);

    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const t = useTranslations();
const navigate = useRouter();
    useEffect(() => {
        const local_favorites_list = JSON.parse(
            localStorage.getItem("favorites") ?? "[]"
        ) ?? [];
    
        set_favorites_list(local_favorites_list);

        setIsFavorite(local_favorites_list.includes(ad_id));

        set_is_disabled(false);
    }, []);

    const update_favorites = async () => {
        // VALIDATE TOKEN EXISTS
        if (!is_authenticated()) {
            navigate.push("/auth/login");
            return;
        }

        set_is_disabled(true);
        await sleep(2);

        const payload: UpdateFavoritesModel = {
            favorites: [ad_id],
        };

        const result = await post_update_favorites(payload, locale!);

        if (isString(result)) {
            notify(true, result);
        } else {
            const new_favorites_list = result.favorites.map((e) => e.id);
            set_favorites_list(new_favorites_list);
            localStorage.setItem("favorites", JSON.stringify(new_favorites_list));
            setIsFavorite(!isFavorite);
        }

        set_is_disabled(false);
    };

    return alt ? (
        <Box
            onClick={() => (is_disabled ? {} : update_favorites())}
            className={(is_disabled ? "opacity-75" : "") + " animate flex justify-center"}
        >
            {is_disabled && (
                <LoadingButton
                    disabled={true}
                    loading
                    variant="outlined"
                    sx={{ border: "0!important"}}
                ></LoadingButton>
            )}

            {!is_disabled && (
                <IconButton aria-label="favorite button" label={t("fields.favorite")} action={() => {}}>
                    {isFavorite ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
                </IconButton>
            )}
        </Box>
    ) : (
        <Box
            onClick={() => (is_disabled ? {} : update_favorites())}
            
            className={
                (is_disabled ? "opacity-75" : "") +
                " animate absolute bg-white w-10 h-10 flex justify-center items-center overflow-clip end-1 top-0 z-50 p-1 rounded-b-full border cursor-pointer shadow-lg"
            }
        >
            {is_disabled && <LoadingButton aria-label="loading" loading variant="outlined" sx={{ border: "0!important" }}></LoadingButton>}

            {!is_disabled && (
                <Button aria-label="favorite button" color="error">
                    {isFavorite ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon sx={{ color: "red" }} />}
                </Button>
            )}
        </Box>
    );
}
