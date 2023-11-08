import {PostSearchModel, SearchFilterForm} from "@/api/interfaces.api";

export const build_search_payload = (validated_data: SearchFilterForm, query: string, page: number): PostSearchModel => {
    const payload: PostSearchModel = {
        page: page,
        q: query,
    };
    
    if (validated_data.category !== "") {
        payload.category = validated_data.category;
    }
    
    if (validated_data.country !== "") {
        payload.country = validated_data.country;
    }
    
    if (validated_data.province !== "") {
        payload.province = validated_data.province;
    }
    
    if (validated_data.city !== "") {
        payload.city = validated_data.city;
    }
    
    return payload;
};
