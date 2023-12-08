// noinspection TypeScriptValidateTypes

"use server";

import {cookies} from "next/headers";

import {
    AD_DETAILS,
    ADS_TYPE,
    CATEGORIES,
    CATEGORY_DETAILS,
    CHAT_MESSAGES,
    COMMENT,
    CONTACT_US,
    DELETE_NOTIFICATIONS,
    GET_ADS_ADD,
    GET_CUSTOMER_ADS,
    GET_FAVORITES,
    GET_LOGIN,
    GET_MESSAGES,
    GET_NOTIFICATIONS,
    GET_PERSONAL_INFO,
    GET_REGISTER,
    HOME,
    LAYOUT,
    LOGIN,
    POST_ADS_ADD,
    POST_CHAT,
    POST_REPORT,
    POST_SEARCH,
    REGISTER,
    SELLER_PAGE,
    SITEMAP,
    STATIC_PAGE,
    UPDATE_AD,
    UPDATE_FAVORITES,
} from "./constants.api";
import {
    AdDetails,
    AdModel,
    AdReportModel,
    AdsState,
    CategoriesPage,
    CategoryPage,
    CommentFormModel,
    ContactUsFormModel,
    ContactUsPage,
    GetAdsAddModel,
    GetAdsType,
    GetChatMessages,
    GetCustomerAds,
    GetCustomerFavorites,
    GetHome,
    GetLayout,
    GetMessages,
    GetSellerPage,
    JwtResponse,
    LoginFormModel,
    LoginPage,
    MessageFormModel,
    NotificationModel,
    PersonalInfoModel,
    PostSearchModel,
    RegisterPage,
    ResponseCreate,
    ResponseGet,
    SearchDataModel,
    Sitemap,
    StaticPage,
    UpdateFavoritesModel,
} from "./interfaces.api";
import {get_request_errors} from "@/util/formatting.util";
import {TLocale} from "@/interfaces/global.interface";
import {BodyInterface} from "@/components/common/inputs/send-message.inputs";
import {SortingSelector} from "@/enums/sorting-selector.enum";

const CONFIG_IS_TESTING = false;

const DEFAULT_AD_SENSE_OBJ = {
    id: "",
    position: -1,
    tags: {
        body: "",
    },
    photo_url: "",
    width: 0,
    height: 0,
    is_visible: true,
    created_at: "",
};

const DEFAULT_CATEGORY_OBJ = {
    id: "",
    slug: "",
    name: "",
    names: {
        en: "",
        ar: "",
    },
    icon_url: "",
    super_category: {
        id: "",
        name: "",
        names: {
            en: "",
            ar: "",
        },
        icon_url: "",
        super_category: {},
        filters_choices: [],
        created_at: "",
    },
    sub_categories: [
        {
            id: "",
            name: "",
            names: {
                en: "",
                ar: "",
            },
            icon_url: "",
            super_category: {},
            filters_choices: [],
            created_at: "",
        },
    ],
    filters_choices: [],
    filters_extras: [],
    created_at: "",
};

const DEFAULT_STATIC_PAGE_OBJ = {
    id: "",
    title: "",
    titles: {
        en: "",
        ar: "",
    },
    body: {
        en: "",
        ar: "",
    },
    slug: "",
    seo_tags: "",
    order: 0,
    created_at: "",
};

const DEFAULT_LOCATION_OBJ = {
    id: "",
    name: "",
    names: {
        en: "",
        ar: "",
    },
    created_at: "",
};

const DEFAULT_SELLER = {
    id: "",
    name: "",
    names: {
        en: "",
        ar: "",
    },
    description: "",
    descriptions: {
        en: "",
        ar: "",
    },
    username: "",
    phones: [],
    logo: "",
    favorites: [],
};

const DEFAULT_AD_OBJ = {
    id: "",
    seller: DEFAULT_SELLER,
    card_url: "",
    photos: [],
    slug: "",
    name: "",
    names: {
        en: "",
        ar: "",
    },
    description: "",
    descriptions: {
        en: "",
        ar: "",
    },
    seo_tags: "",
    price: 0,
    state: AdsState.NEW,
    location: {
        country: DEFAULT_LOCATION_OBJ,
        province: DEFAULT_LOCATION_OBJ,
        city: DEFAULT_LOCATION_OBJ,
    },
    status: {
        refused: false,
        active: false,
        paid: false,
        pinned: false,
    },
    categories: [],
    extras: [],
    filters_extras: [],
    comments: [],
    order: 0,
    created_at: "",
};

export async function get_layout(): Promise<GetLayout> {
    try {
        const response: Response = await fetch(LAYOUT, {cache: "no-cache"});
        
        const body: ResponseGet<GetLayout> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            custom_scripts: {
                heads: [],
                body: [],
            },
            nav_bar: {
                categories: [],
            },
            footer: {
                regions: [],
                categories: [],
            },
        };
    }
}

export async function get_home(): Promise<GetHome> {
    try {
        const response: Response = await fetch(HOME, {cache: "no-cache"});
        
        const body: ResponseGet<GetHome> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            carousel: [],
            ad_sense: {
                top: DEFAULT_AD_SENSE_OBJ,
                bottom: DEFAULT_AD_SENSE_OBJ,
            },
            ads: {
                pinned: [],
                paid: [],
                new_arrivals: [],
            },
        };
    }
}

export async function get_ads_type(type: string, page: string | number): Promise<GetAdsType> {
    
    
    try {
        const response: Response = await fetch(ADS_TYPE(type, page), {cache: "no-cache"});
        
        const body: ResponseGet<GetAdsType> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            ads: {
                first_page: 0,
                last_page: 0,
                per_page: 0,
                total_count: 0,
                data: [],
            },
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function get_static_page(page: string): Promise<StaticPage> {
    try {
        const response: Response = await fetch(`${STATIC_PAGE}/${page}`, {cache: "no-cache"});
        
        const body: ResponseGet<StaticPage> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return DEFAULT_STATIC_PAGE_OBJ;
    }
}

export async function get_sitemap(): Promise<Sitemap> {
    
    
    try {
        const response: Response = await fetch(SITEMAP, {cache: "no-cache"});
        
        const body: ResponseGet<Sitemap> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            categories: [],
            static_pages: {
                about: DEFAULT_STATIC_PAGE_OBJ,
                privacy: DEFAULT_STATIC_PAGE_OBJ,
                terms: DEFAULT_STATIC_PAGE_OBJ,
            },
        };
    }
}

export async function get_categories(): Promise<CategoriesPage> {
    try {
        const response: Response = await fetch(CATEGORIES, {cache: "no-cache"});
        const body: ResponseGet<CategoriesPage> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            categories: [],
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function get_category(
    category_id: string,
    page: number | string,
    sort_by?: SortingSelector,
    sub_category?: string,
    country?: string,
    province?: string,
    city?: string,
    filters = [],
): Promise<CategoryPage> {
    
    
    const payload: object = {
        page,
    };
    
    if (filters.length > 0) {
        payload.filters = filters;
    }
    
    if (sort_by) {
        payload.sort_by = sort_by;
    }
    
    if (sub_category) {
        payload.sub_category = sub_category;
    }
    
    if (country) {
        payload.country = country;
    }
    
    if (province) {
        payload.province = province;
    }
    
    if (city) {
        payload.city = city;
    }
    
    try {
        const response: Response = await fetch(CATEGORY_DETAILS(category_id), {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        
        const body: ResponseGet<CategoryPage> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            category: DEFAULT_CATEGORY_OBJ,
            ads: {
                first_page: 1,
                last_page: 1,
                per_page: 1,
                total_count: 0,
                data: [],
            },
            ad_sense: {
                category_top: DEFAULT_AD_SENSE_OBJ,
                category_bottom: DEFAULT_AD_SENSE_OBJ,
                sub_category_top: DEFAULT_AD_SENSE_OBJ,
            },
            locations: {
                countries: [],
                provinces: [],
                cities: [],
            },
        };
    }
}

export async function get_ad_details(ad_id: string): Promise<AdDetails> {
    
    
    try {
        const response: Response = await fetch(AD_DETAILS(ad_id), {cache: "no-cache"});
        
        const body: ResponseGet<AdDetails> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            ad: DEFAULT_AD_OBJ,
            side_bar: [],
            related_ads: [],
            ad_sense: {
                ad_details_top: DEFAULT_AD_SENSE_OBJ,
                ad_side_bar: DEFAULT_AD_SENSE_OBJ,
                ad_details_bottom: DEFAULT_AD_SENSE_OBJ,
            },
        };
    }
}

export async function get_seller_page(id: string, page: string | number): Promise<GetSellerPage> {
    try {
        const response: Response = await fetch(SELLER_PAGE(id, page), {cache: "no-cache"});
        
        const body: ResponseGet<GetSellerPage> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            seller: {
                id: "",
                username: "",
                phones: [],
                name: "",
                names: {
                    en: "",
                    ar: "",
                },
                description: "",
                descriptions: {
                    en: "",
                    ar: "",
                },
                logo: "",
            },
            ads: {
                first_page: 0,
                last_page: 0,
                per_page: 0,
                total_count: 0,
                data: [],
            },
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function post_contact_us(contact_form: ContactUsFormModel, locale: TLocale): Promise<string> {
    try {
        const response: Response = await fetch(CONTACT_US, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
            },
            body: JSON.stringify(contact_form),
        });
        
        const body: ResponseCreate = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException(get_request_errors(body, locale));
        }
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return e.message;
    }
}

export async function get_contact_us(): Promise<ContactUsPage> {
    try {
        const response: Response = await fetch(CONTACT_US, {cache: "no-cache"});
        
        const body: ResponseGet<ContactUsPage> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return {
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function post_register_form(form_data: FormData, locale: TLocale): Promise<string> {
    try {
        const response: Response = await fetch(REGISTER, {
            method: "POST",
            headers: {
                "Accept-Language": locale,
            },
            body: form_data,
        });
        
        const body: ResponseCreate = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return e.message;
    }
}

export async function get_register(): Promise<RegisterPage> {
    try {
        const response: Response = await fetch(GET_REGISTER, {cache: "no-cache"});
        
        const body: ResponseGet<RegisterPage> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return {
            locations: {
                countries: [],
                provinces: [],
                cities: [],
            },
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function post_login(login_form: LoginFormModel, locale: TLocale): Promise<string | JwtResponse> {
    try {
        const response: Response = await fetch(LOGIN, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
            },
            body: JSON.stringify(login_form),
        });
        
        const body: JwtResponse = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
        return body;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}

export async function get_login(): Promise<LoginPage> {
    try {
        const response: Response = await fetch(GET_LOGIN, {cache: "no-cache"});
        
        const body: ResponseGet<LoginPage> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return {
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function get_personal_info(): Promise<PersonalInfoModel> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(GET_PERSONAL_INFO, {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<PersonalInfoModel> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            type: -1,
            names: {
                first: "",
                last: "",
            },
            full_name: "",
            photoUrl: "",
            username: "",
            phone: "",
            location: {
                country: DEFAULT_LOCATION_OBJ,
                province: DEFAULT_LOCATION_OBJ,
                city: DEFAULT_LOCATION_OBJ,
            },
            seller: DEFAULT_SELLER,
        };
    }
}

export async function post_update_profile(form_data: FormData, locale: TLocale): Promise<string> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(GET_PERSONAL_INFO, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token?.value}`,
            },
            body: form_data,
        });
        
        const body: ResponseGet<PersonalInfoModel> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException(get_request_errors(body, locale));
        }
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return e.message;
    }
}

export async function get_ads_add(): Promise<GetAdsAddModel> {
    const token = await cookies().get("token");
    try {
        const response: Response = await fetch(GET_ADS_ADD, {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        const body: ResponseGet<GetAdsAddModel> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return {
            locations: {
                countries: [
                    {
                        id: "",
                        name: "",
                        names: {
                            en: "",
                            ar: "",
                        },
                        created_at: "",
                    },
                ],
                provinces: [
                    {
                        country: {
                            id: "",
                            name: "",
                            names: {
                                en: "",
                                ar: "",
                            },
                            created_at: "",
                        },
                        id: "",
                        name: "",
                        names: {
                            en: "",
                            ar: "",
                        },
                        created_at: "",
                    },
                ],
                cities: [
                    {
                        country: {
                            id: "",
                            name: "",
                            names: {
                                en: "",
                                ar: "",
                            },
                            created_at: "",
                        },
                        province: {
                            id: "",
                            name: "",
                            names: {
                                en: "",
                                ar: "",
                            },
                            created_at: "",
                        },
                        id: "",
                        name: "",
                        names: {
                            en: "",
                            ar: "",
                        },
                        created_at: "",
                    },
                ],
            },
            categories: [],
            descriptors: {
                status: 0,
                data: [],
            },
        };
    }
}

export async function post_ads_add(form_data: FormData, locale: TLocale): Promise<string> {
    try {
        const token = await cookies().get("token");
        const response: Response = await fetch(POST_ADS_ADD, {
            method: "POST",
            headers: {
                "Accept-Language": locale,
                Authorization: `Bearer ${token?.value}`,
            },
            body: form_data,
        });
        
        const body: ResponseGet<AdModel> = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}

export async function post_ads_update(id: string, form_data: FormData, locale: TLocale): Promise<string> {
    try {
        const token = await cookies().get("token");
        
        const response: Response = await fetch(UPDATE_AD(id), {
            method: "POST",
            headers: {
                "Accept-Language": locale,
                Authorization: `Bearer ${token?.value}`,
            },
            body: form_data,
        });
        
        const body: ResponseGet<AdModel> = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}

export async function post_ad_report(
    ad_report: AdReportModel,
    id: string,
    locale: TLocale
): Promise<string | JwtResponse> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(POST_REPORT(id), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify(ad_report),
        });
        
        const body: JwtResponse = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
        return body;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}

export async function post_search(searchBody: PostSearchModel, locale: "en" | "ar"): Promise<SearchDataModel> {
    try {
        
        const response: Response = await fetch(POST_SEARCH, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
            },
            body: JSON.stringify(searchBody),
        });
        
        const body: SearchDataModel = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
        return body;
        
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
    
}

export async function get_favorites(): Promise<GetCustomerFavorites> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(GET_FAVORITES, {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<GetCustomerFavorites> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return {
            favorites: [],
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function post_update_favorites(
    favorites: UpdateFavoritesModel,
    locale: TLocale
): Promise<GetCustomerFavorites | string> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(UPDATE_FAVORITES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify(favorites),
        });
        
        const body: ResponseGet<GetCustomerFavorites> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}

export async function get_customer_ads(page: string | number): Promise<GetCustomerAds> {
    
    
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(GET_CUSTOMER_ADS(page), {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<GetCustomerAds> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return {
            ads: {
                first_page: 1,
                last_page: 1,
                per_page: 50,
                total_count: 0,
                data: [],
            },
            ad_sense: DEFAULT_AD_SENSE_OBJ,
        };
    }
}

export async function send_delete_ad(id: string, locale: TLocale): Promise<AdModel[] | string> {
    const token = await cookies().get("token");
    try {
        const response: Response = await fetch(UPDATE_AD(id), {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<AdModel[]> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return e.message;
    }
}

export async function get_edit_ad(id: string): Promise<AdModel> {
    const token = await cookies().get("token");
    try {
        const response: Response = await fetch(UPDATE_AD(id), {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<AdModel> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return DEFAULT_AD_OBJ;
    }
}

export async function post_ad_message(payload: MessageFormModel, id: string, locale: TLocale): Promise<string> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(POST_CHAT(id), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify(payload),
        });
        
        const body = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}

export async function get_messages(page: string | number): Promise<GetMessages> {
    
    
    const token = await cookies().get("token");
    try {
        const response: Response = await fetch(GET_MESSAGES(page), {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<GetMessages> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return {
            all: {
                first_page: 0,
                last_page: 0,
                per_page: 0,
                total_count: 0,
                data: [],
            },
            as_owner: [],
            as_requester: [],
        };
    }
}

export async function get_chat_messages(id: string): Promise<GetChatMessages> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(CHAT_MESSAGES(id), {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<GetChatMessages> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return {
            ad: {
                status: {
                    refused: false,
                    active: false,
                    paid: false,
                    pinned: false,
                },
                id: "",
                name: "",
                names: {
                    en: "",
                    ar: "",
                },
                description: "",
                descriptions: {
                    en: "",
                    ar: "",
                },
                seo_tags: "",
                price: -1,
                card_url: "",
                order: -1,
                created_at: "",
            },
            owner: {
                seller: {
                    name: "",
                    names: {
                        en: "",
                        ar: "",
                    },
                    description: "",
                    descriptions: {
                        en: "",
                        ar: "",
                    },
                    logo: "",
                },
                id: "",
                names: {
                    first: "",
                    last: "",
                },
                full_name: "",
                username: "",
                phones: [],
                photoUrl: "",
                created_at: "",
            },
            requester: {
                seller: {
                    name: "",
                    names: {
                        en: "",
                        ar: "",
                    },
                    description: "",
                    descriptions: {
                        en: "",
                        ar: "",
                    },
                    logo: "",
                },
                id: "",
                names: {
                    first: "",
                    last: "",
                },
                full_name: "",
                username: "",
                phones: [],
                photoUrl: "",
                created_at: "",
            },
            id: "",
            chat_log: [],
            created_at: "",
        };
    }
}

export async function post_chat_message(
    message: BodyInterface,
    id: string,
    locale: TLocale
): Promise<string | ResponseGet<GetChatMessages>> {
    const token = await cookies().get("token");
    try {
        const response: Response = await fetch(CHAT_MESSAGES(id), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify(message),
        });
        
        const body: ResponseGet<GetChatMessages> = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
        return body;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        return e.message;
    }
}

export async function post_comment(
    payload: CommentFormModel,
    id: string,
    locale: TLocale
): Promise<string | AdModel["comments"]> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(COMMENT(id), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
                Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify(payload),
        });
        
        const body: ResponseGet<AdModel["comments"]> = await response.json();
        
        if (response.status !== 200) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}

export async function verify_captcha(token: string | null) {
    
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    
    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
        {
            method: "POST",
        }
    );
    
    const data = await response.json();
    
    if (data.success) {
        return data.success;
        // res.status(200).json({ success: true });
    } else {
        console.log("failed");
        
        // res.status(400).json({ success: false });
    }
}


export async function get_notifications(): Promise<NotificationModel[]> {
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(GET_NOTIFICATIONS, {
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value}`,
            },
        });
        
        const body: ResponseGet<NotificationModel[]> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException();
        }
        
        return body.data;
    } catch (e) {
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return [];
    }
}

export async function post_delete_notifications(
    form_data: FormData,
    locale: TLocale
): Promise<string> {
    
    const token = await cookies().get("token");
    
    try {
        const response: Response = await fetch(DELETE_NOTIFICATIONS, {
            method: "POST",
            headers: {
                "Accept-Language": locale,
                Authorization: `Bearer ${token?.value}`,
            },
            body: form_data,
        });
        
        const body: ResponseGet<any> = await response.json();
        
        if (body.status !== 1) {
            throw new DOMException(get_request_errors(body, locale));
        }
        
    } catch (e) {
        
        if (CONFIG_IS_TESTING) {
            console.log(e);
        }
        
        return e.message;
    }
}
