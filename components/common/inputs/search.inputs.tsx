"use client";
import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import SearchButton from "./../buttons/search.buttons";
import { useRouter } from "next-intl/client";

function SearchInput() {

    const t = useTranslations();

    const navigate = useRouter();

    const [searchText, setSearchText] = useState<string>("");
    // setSearchText(e.target.value);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchText(newValue);
    };

    const on_search = (e) => {
        e.preventDefault();

        if (!searchText) {
            return;
        }

        navigate.push(
            `/ads/search/${searchText}?page=1`
        );
    };

    return (
        <form onSubmit={(e) => on_search(e)} className="col-span-12 md:col-span-9 lg:col-span-4 xl:col-span-5 flex justify-center items-center">

            {" "}
            <TextField
                id="search-input"
                sx={{ borderRadius: 8, backgroundColor: "white" }}
                className="border h-full border-contrast text-gray-900
                text-sm-[4px] focus:border-blue-500 block w-full p-2.5"
                label={t("fields.search")}
                placeholder={t("placeholders.enter_search_query")}
                variant="outlined"
                onChange={handleInputChange}
            />

            <SearchButton onClick={on_search} />

        </form>
    );
}

export default SearchInput;
