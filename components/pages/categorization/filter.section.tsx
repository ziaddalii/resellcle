"use client";

import {Box, Button, Container} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {GlobalInterface} from "@/interfaces/global.interface";
import {FormSelect, SelectModel} from "@/components/common/form/select.form";
import {useRouter} from "next-intl/client";
import {useEffect, useState} from "react";
import {SelectChangeEvent} from "@mui/material/Select";
import {useTranslations} from "use-intl";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {build_query_params, sleep} from "@/util/formatting.util";
import {FilterChoiceModel} from "@/api/interfaces.api";

interface Props extends GlobalInterface {
    current_items: {
        id: string;
        value: string;
    }[];
    
    current_category: string;
    current_sub_category?: string;
    
    items: {
        id: string;
        name: string;
        links: FilterChoiceModel["links"];
        options_list: SelectModel[];
    }[];
}

export default function FilterSection(
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
    
    const [full_options_list, set_full_options_list] = useState(items.map((e) => e.options_list));
    const [current_options_list, set_current_options_list] = useState(items.map((e) => e.options_list));
    const [selected_values, set_selected_values] = useState({});
    const [selected_items, set_selected_items] = useState(current_items);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        
        const new_selected_values = {};
        
        current_items.forEach((e) => {
            new_selected_values[e.id] = e.value;
        });
        
        set_selected_values(new_selected_values);
        
        setIsLoading(false);
    }, []);
    
    
    const on_change = (id: string, index: number, event: SelectChangeEvent) => {
        
        const new_selected_values = {...selected_values};
        const new_selected_items = [...selected_items];
        
        const found_index = new_selected_items.findIndex((e) => e.id === id);
        
        if (found_index !== -1) {
            new_selected_items[found_index].value = event.target.value as string;
        } else {
            new_selected_items.push({
                id,
                value: event.target.value as string,
            });
        }
        new_selected_values[id] = event.target.value as string;
        
        //SET OPTIONS FOR LINKS
        const full_filter_choice = items.find((e) => e.id === id);
        const new_current_options_list = [...current_options_list];
        if (full_filter_choice.links.length > 0) {
            
            //FILTER ON SELECTED VALUE IF EXISTS
            const filtered_links = full_filter_choice.links.filter(
                (e) => e.filter_choice_value === new_selected_values[id],
            );
            
            //SET OPTIONS LIST FOR EACH ASSOCIATED FILTER WITH VALUE
            const updated_indices = [];
            filtered_links.forEach((e) => {
                const found_index = items.findIndex(
                    (f) => f.id === e.filter_choice
                );
                
                if (found_index !== -1) {
                    updated_indices.push(found_index);
                    new_current_options_list[found_index] = full_options_list[found_index].filter(
                        (f) => e.items.includes(f.id!)
                    );
                }
            });
            
            //RESET OTHER FILTERS
            for (let i = 0; i < current_options_list.length; i++) {
                if (!updated_indices.includes(i)) {
                    new_current_options_list[i] = full_options_list[i];
                }
            }
        }
        
        set_current_options_list(new_current_options_list);
        
        set_selected_items(new_selected_items);
        
        set_selected_values(new_selected_values);
    };
    
    const on_submit = async () => {
        
        setIsLoading(true);
        
        await toggle_loading(true);
        
        await sleep(2);
        
        const query_params = build_query_params(
            {...selected_values, page: 1},
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
        <Box className="bg-secondary-100 py-8" component="section">
            
            <Container maxWidth="xl" className="!grid md:!grid-cols-3 !grid-cols-1 gap-4 px-8">
                
                {items.map((item, index) => (
                    <Box key={item.id} className="!col-span-1">
                        <FormSelect
                            id={item.id}
                            fullWidth
                            value={selected_values[item.id]}
                            label={item.name}
                            placeholder={item.name}
                            onChange={(e) => on_change(item.id, index, e)}
                            items={current_options_list[index]}
                            variant="outlined"
                            locale={locale}
                            disabled={isLoading}
                        />
                    </Box>
                ))}
                
                <Button
                    onClick={on_submit}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        color: "white",
                    }}
                    endIcon={<SearchIcon/>}>
                    {t!("fields.search")}
                </Button>
            
            </Container>
        </Box>
    );
}
