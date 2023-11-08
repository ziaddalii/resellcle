/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {FormSelect, SelectModel} from "@/components/common/form/select.form";
import {Box, Container} from "@mui/material";
import {useTranslations} from "use-intl";
import {useRouter} from "next-intl/client";
import {useEffect, useState} from "react";
import {SelectChangeEvent} from "@mui/material/Select";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {build_query_params, sleep} from "@/util/formatting.util";
import {GlobalInterface} from "@/interfaces/global.interface";

interface Props extends GlobalInterface {
    current_items: {
        id: string;
        value: string;
    }[];
    
    items: {
        id: string;
        name: string;
        key: string;
        options_list: SelectModel[];
    }[];
    
    current_category: string;
    current_sub_category?: string;
}

export default function SortingSection(
    {
        current_items = [],
        current_category,
        current_sub_category,
        items,
        locale,
    }: Props
) {
    
    const t = useTranslations();
    
    const navigate = useRouter();
    
    const [selected_values, set_selected_values] = useState({});
    const [selected_items, set_selected_items] = useState(current_items);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const new_selected_values = {};
        
        current_items.forEach((e) => {
            new_selected_values[e.id] = e.value;
        });
        
        items.forEach((e) => {
            const found_index = current_items.findIndex((f) => f.id === e.key);
    
            if (found_index !== -1) {
                new_selected_values[e.key] = current_items[found_index].value;
            }
        });
        
        set_selected_values(new_selected_values);
    
        setIsLoading(false);
    }, []);
    
    
    const on_change = async (key: string, event: SelectChangeEvent) => {
        const new_selected_items = [...selected_items];
        const new_selected_values = {...selected_values};
        
        const found_index = new_selected_items.findIndex((e) => e.id === key);
        
        if (found_index !== -1) {
            new_selected_items[found_index].value = event.target.value as string;
            new_selected_values[key] = event.target.value as string;
        } else {
            new_selected_items.push({
                id: key,
                value: event.target.value as string,
            });
        }
        
        new_selected_values[key] = event.target.value as string;
        
        set_selected_items(new_selected_items);
        set_selected_values(new_selected_values);
        
        await on_submit(new_selected_values);
    };
    
    const on_submit = async (current_selected_values?: object) => {
    
        setIsLoading(true);
        
        await toggle_loading(true);
        
        await sleep(2);
        
        const query_params = build_query_params(
            {
                ...(current_selected_values ? current_selected_values : selected_values),
                page: 1,
            },
        );
    
        navigate.push(
            current_sub_category ?
                `/categories/${current_category}/${current_sub_category}?${query_params}` :
                `/categories/${current_category}?${query_params}`
        );
        
        await sleep(2);
        
        await toggle_loading(false);
        
        setIsLoading(false);
    };
    
    
    return (
        <Container maxWidth="xl" component="section">
            <div className="flex flex-row flex-wrap justify-end gap-4">
                {items.map((item) => (
                    <div key={item.id} className="min-w-[200px]">
                        <FormSelect
                            id={item.id}
                            fullWidth
                            value={selected_values[item.key]}
                            label={item.name}
                            placeholder={item.name}
                            onChange={(e) => on_change(item.key, e)}
                            items={item.options_list}
                            locale={locale}
                            disabled={isLoading}
                        />
                    </div>
                ))}
            </div>
        </Container>
    );
}
