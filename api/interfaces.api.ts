import {SelectModel} from "@/components/common/form/select.form";

export interface ResponseGet<T> {
    status: 1 | 0;
    data: T;
}

export interface ResponseCreate {
    status: 1 | 0;
    message: string;
}

export interface ResponseUpdate {
    status: 1 | 0;
    message: string;
}

export interface JwtResponse {
    token: {
        accessToken: string;
        expiresAt: string;
        expiresIn: string;
    };
    user: {
        type: number;
        names: {
            first: string;
            last: string;
        };
        full_name: string;
        username: string;
        phone: string;
        phones: string[];
        location: object;
        favorites: string[];
        seller: object;
        photoUrl: string;
    };
}

export interface NavBarModel {
    categories: CategoryModel[];
}

export interface RegionsModel {
    id: string;
    name: string;
    names: {
        en: string;
        ar: string;
    };
    created_at: string;
}

export interface FooterModel {
    regions: RegionsModel[];
    categories: CategoryModel[];
}

export interface FilterChoiceModel {
    id: string;
    name: string;
    names: {
        en: string;
        ar: string;
    };
    links: {
        id: string;
        filter_choice: string;
        filter_choice_value: string;
        items: string[];
    }[];
    values: {
        id: string;
        value: string;
        values: {
            en: string;
            ar: string;
        }
    }[];
}

interface FilterExtraModel {
    id: string;
    name: string;
    names: {
        en: string;
        ar: string;
    };
}

export interface CategoryModel {
    id: string;
    slug: string;
    name: string;
    names: {
        en: string;
        ar: string;
    };
    icon_url: string;
    super_category: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        icon_url: string;
        super_category: object;
        filters_choices: FilterChoiceModel[];
        created_at: string;
    };
    sub_categories: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        icon_url: string;
        super_category: {
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            };
            icon_url: string;
            super_category: object;
            filters_choices: FilterChoiceModel[];
            created_at: string;
        } | null | {};
        filters_choices: FilterChoiceModel[];
        created_at: string;
    }[];
    
    filters_choices: FilterChoiceModel[];
    filters_extras: FilterExtraModel[];
    created_at: string;
}

export interface GetLayout {
    custom_scripts: {
        heads: string[];
        body: string[];
    };
    
    nav_bar: NavBarModel;
    
    footer: FooterModel;
}

export enum AdsState {
    PINNED,
    PAID,
    NEW,
}

export interface Seller {
    id: string;
    name: string;
    names: {
        en: string;
        ar: string;
    },
    description: string;
    descriptions: {
        en: string;
        ar: string;
    },
    logo: string;
    phones: string[];
    username: string;
    favorites?: string[];
}

export interface AdModel {
    id: string;
    seller: Seller,
    card_url: string;
    photos: string[];
    photos_full?: PhotoFull[];
    slug: string;
    name: string;
    names: {
        en: string;
        ar: string;
    };
    description: string;
    descriptions: {
        en: string;
        ar: string;
    };
    seo_tags: string;
    price: number;
    state: AdsState;
    location: {
        country: {
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            },
            created_at: string;
        };
        province: {
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            },
            created_at: string;
        };
        city: {
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            },
            created_at: string;
        };
    };
    status: {
        refused: boolean;
        active: boolean;
        paid: boolean;
        pinned: boolean;
    };
    categories: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
    }[];
    
    filters_choices?: {
        choice: FilterChoiceModel;
        selected: SelectModel;
    }[];
    
    descriptors?: DescriptorsModel[];
    extras: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        },
        value: string;
        values: {
            en: string;
            ar: string;
        },
    }[];
    
    filters_extras: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        }
    }[];
    
    comments: {
        id: string;
        names: {
            first: string;
            last: string;
        };
        full_name: string;
        photoUrl: string;
        message: string;
    }[];
    order: number;
    created_at: string;
}

export interface GetHome {
    carousel: {
        id: string;
        photo_url: string;
        order: number;
        seo_tags: string;
        created_at: string;
    }[];
    ad_sense: {
        top: AdSenseModel;
        bottom: AdSenseModel;
    };
    ads: {
        pinned: AdModel[];
        paid: AdModel[];
        new_arrivals: AdModel[];
    };
}

export interface GetAdsType {
    ads: {
        first_page: number;
        last_page: number;
        per_page: number;
        total_count: number;
        data: AdModel[];
    };
    ad_sense: AdSenseModel;
}

export interface AdSenseModel {
    id: string;
    position: number;
    tags: {
        body: string;
    };
    photo_url: string;
    width: number;
    height: number;
    created_at: string;
    is_visible: boolean;
}

export interface StaticPage {
    id: string;
    title: string;
    titles: {
        en: string;
        ar: string;
    };
    body: {
        en: string;
        ar: string;
    };
    slug: string;
    seo_tags: string;
    order: number;
    created_at: string;
}

export interface Sitemap {
    categories: CategoryModel[];
    static_pages: {
        about: StaticPageModel;
        terms: StaticPageModel;
        privacy: StaticPageModel;
    };
}

interface StaticPageModel {
    id: string;
    title: string;
    titles: {
        en: string;
        ar: string;
    };
    body: {
        en: string;
        ar: string;
    };
    slug: string;
    seo_tags: string;
    order: number;
    created_at: string;
}

export interface CategoriesPage {
    categories: CategoryModel[];
    ad_sense: AdSenseModel;
}

export interface CategoryPage {
    category: CategoryModel;
    ads: {
        first_page: number;
        last_page: number;
        per_page: number;
        total_count: number;
        data: AdModel[];
    };
    ad_sense: {
        category_top: AdSenseModel;
        category_bottom: AdSenseModel;
        sub_category_top: AdSenseModel;
    };
    
    locations: {
        countries: CountryModel[];
        provinces: ProvinceModel[];
        cities: CityModel[];
    };
}

export interface AdDetails {
    ad: AdModel;
    side_bar: AdModel[];
    related_ads: AdModel[];
    ad_sense: {
        ad_details_top: AdSenseModel;
        ad_side_bar: AdSenseModel;
        ad_details_bottom: AdSenseModel;
    };
}

export interface GetSellerPage {
    seller: Seller;
    ads: {
        first_page: number;
        last_page: number;
        per_page: number;
        total_count: number;
        data: AdModel[];
    };
    ad_sense: AdSenseModel;
}

export interface ContactUsPage {
    ad_sense: AdSenseModel;
}

export interface RegisterFormModel {
    photo: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    city: string;
}

export interface MessageFormModel {
    message: string;
}

export interface RegisterPage {
    locations: {
        countries: CountryModel[];
        provinces: ProvinceModel[];
        cities: CityModel[];
    }
    ad_sense: AdSenseModel;
}

export interface LocationModel {
    id: string;
    name: string;
    names: {
        en: string;
        ar: string;
    },
    created_at: string;
}

export interface CountryModel extends LocationModel {}

export interface ProvinceModel extends LocationModel {
    country?: LocationModel;
}

export interface CityModel extends LocationModel {
    country?: LocationModel;
    province?: LocationModel;
}

export interface ContactUsFormModel {
    email: string;
    name: string;
    phone_number: string;
    service_type: string;
    enquiry: string;
}

export interface LoginFormModel {
    username_or_phone: string;
    password: string;
}

export interface LoginPage {
    ad_sense: AdSenseModel;
}

export interface PersonalInfoModel {
    type: number;
    names: {
        first: string;
        last: string;
    };
    full_name: string;
    photoUrl: string;
    username: string;
    phone: string;
    location: {
        country: CountryModel;
        province: ProvinceModel;
        city: CityModel;
    };
    seller: Seller;
    favorites: FavoritesModel[];
    notifications: NotificationModel[];
}

export interface PersonalInfoForm {
    photo: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export interface ChangePasswordForm {
    old_password: string;
    password: string;
    confirm_password: string;
}

export interface SellerProfileForm {
    logo: string;
    en_name: string;
    ar_name: string;
    en_description: string;
    ar_description: string;
}

export interface DescriptorsModel {
    id: string;
    descriptor_id: string;
    name: string;
    names: {
        en: string;
        ar: string;
    };
    values?: {
        en: string;
        ar: string;
    };
    created_at: string;
}

export interface GetAdsAddModel {
    locations: {
        countries: CountryModel[];
        provinces: ProvinceModel[];
        cities: CityModel[];
    }
    categories: CategoryModel[];
    descriptors: {
        status: number;
        data: DescriptorsModel[];
    }
}

[];

export interface AdReportModel {
    ad: string;
    reason: string;
}

export interface SearchFilterForm {
    category?: string;
    country?: string;
    province?: string;
    city?: string;
}

export interface PostSearchModel {
    q: string;
    page: number;
    category?: string;
    country?: string;
    province?: string;
    city?: string;
}

export interface SearchDataModel {
    status: string;
    data: {
        locations: {
            countries: CountryModel[];
            provinces: ProvinceModel[];
            cities: CityModel[];
        }
        categories: CategoryModel[];
        ads: {
            first_page: number;
            last_page: number;
            per_page: number;
            total_count: number;
            data: AdModel[];
        };
        ad_sense: AdSenseModel;
    }
}

export interface FavoritesModel {
    id: string;
    slug: string;
    names: {
        en: string;
        ar: string;
    }
    card_url: string;
}

export interface UpdateFavoritesModel {
    favorites: string[];
}

export interface GetCustomerAds {
    ads: {
        first_page: number;
        last_page: number;
        per_page: number;
        total_count: number;
        data: AdModel[];
    }
    ad_sense: AdSenseModel;
}

export interface GetCustomerFavorites {
    favorites: FavoritesModel[];
    ad_sense: AdSenseModel;
}

export interface ChatMessage {
    id: string;
    message: string;
    created_at: string;
    by: {
        owner: boolean;
        requester: boolean;
    };
}

export interface GetMessages {
    all: {
        first_page: number;
        last_page: number;
        per_page: number;
        total_count: number;
        data: {
            ad: {
                status: {
                    refused: boolean;
                    active: boolean;
                    paid: boolean;
                    pinned: boolean;
                };
                id: string;
                name: string;
                names: {
                    en: string;
                    ar: string;
                };
                description: string;
                descriptions: {
                    en: string;
                    ar: string;
                };
                seo_tags: string;
                price: number;
                card_url: string;
                order: number;
                created_at: string;
            };
            owner: {
                seller: {
                    name: string;
                    names: {
                        en: string;
                        ar: string;
                    };
                    description: string;
                    descriptions: {
                        en: string;
                        ar: string;
                    };
                    logo: string;
                };
                id: string;
                names: {
                    first: string;
                    last: string;
                };
                full_name: string;
                username: string;
                phones: string[];
                photoUrl: string;
                created_at: string;
            };
            requester: {
                seller: {
                    name: string;
                    names: {
                        en: string;
                        ar: string;
                    };
                    description: string;
                    descriptions: {
                        en: string;
                        ar: string;
                    };
                    logo: string;
                };
                id: string;
                names: {
                    first: string;
                    last: string;
                };
                full_name: string;
                username: string;
                phones: string[];
                photoUrl: string;
                created_at: string;
            };
            id: string;
            chat_log: ChatMessage[];
            created_at: string;
        }[];
    };
    as_owner: {
        ad: {
            status: {
                refused: boolean;
                active: boolean;
                paid: boolean;
                pinned: boolean;
            };
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            };
            description: string;
            descriptions: {
                en: string;
                ar: string;
            };
            seo_tags: string;
            price: number;
            card_url: string;
            order: number;
            created_at: string;
        };
        owner: {
            seller: {
                name: string;
                names: {
                    en: string;
                    ar: string;
                };
                description: string;
                descriptions: {
                    en: string;
                    ar: string;
                };
                logo: string;
            };
            id: string;
            names: {
                first: string;
                last: string;
            };
            full_name: string;
            username: string;
            phones: string[];
            photoUrl: string;
            created_at: string;
        };
        requester: {
            seller: {
                name: string;
                names: {
                    en: string;
                    ar: string;
                };
                description: string;
                descriptions: {
                    en: string;
                    ar: string;
                };
                logo: string;
            };
            id: string;
            names: {
                first: string;
                last: string;
            };
            full_name: string;
            username: string;
            phones: string[];
            photoUrl: string;
            created_at: string;
        };
        id: string;
        chat_log: ChatMessage[];
        created_at: string;
    }[];
    as_requester: {
        ad: {
            status: {
                refused: boolean;
                active: boolean;
                paid: boolean;
                pinned: boolean;
            };
            id: string;
            name: string;
            names: {
                en: string;
                ar: string;
            };
            description: string;
            descriptions: {
                en: string;
                ar: string;
            };
            seo_tags: string;
            price: number;
            card_url: string;
            order: number;
            created_at: string;
        };
        owner: {
            seller: {
                name: string;
                names: {
                    en: string;
                    ar: string;
                };
                description: string;
                descriptions: {
                    en: string;
                    ar: string;
                };
                logo: string;
            };
            id: string;
            names: {
                first: string;
                last: string;
            };
            full_name: string;
            username: string;
            phones: string[];
            photoUrl: string;
            created_at: string;
        };
        requester: {
            seller: {
                name: string;
                names: {
                    en: string;
                    ar: string;
                };
                description: string;
                descriptions: {
                    en: string;
                    ar: string;
                };
                logo: string;
            };
            id: string;
            names: {
                first: string;
                last: string;
            };
            full_name: string;
            username: string;
            phones: string[];
            photoUrl: string;
            created_at: string;
        };
        id: string;
        chat_log: ChatMessage[];
        created_at: string;
    }[];
};

export interface GetChatMessages {
    ad: {
        status: {
            refused: boolean;
            active: boolean;
            paid: boolean;
            pinned: boolean;
        };
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        description: string;
        descriptions: {
            en: string;
            ar: string;
        };
        seo_tags: string;
        price: number;
        card_url: string;
        order: number;
        created_at: string;
    };
    owner: {
        seller: {
            name: string;
            names: {
                en: string;
                ar: string;
            };
            description: string;
            descriptions: {
                en: string;
                ar: string;
            };
            logo: string;
        };
        id: string;
        names: {
            first: string;
            last: string;
        };
        full_name: string;
        username: string;
        phones: string[];
        photoUrl: string;
        created_at: string;
    };
    requester: {
        seller: {
            name: string;
            names: {
                en: string;
                ar: string;
            };
            description: string;
            descriptions: {
                en: string;
                ar: string;
            };
            logo: string;
        };
        id: string;
        names: {
            first: string;
            last: string;
        };
        full_name: string;
        username: string;
        phones: string[];
        photoUrl: string;
        created_at: string;
    };
    id: string;
    chat_log: ChatMessage[];
    created_at: string;
};

export interface CommentFormModel {
    name: string;
    comment: string;
}

export interface Photo {
    id?: string;
    
    photo?: File;
}

export interface AddNewAdForm {
    name: string;
    description: string;
    price: string;
    // seo_tags: string;
    
    city: string;
    
    photo_card: string | File;
    photos: string[] | File[];
    
    category: string;
    sub_category: string;
    
    filters_choices: (FilterChoiceModel & SelectModel)[];
    filters_extras: string[];
    
    descriptors: SelectModel[];
}

export interface EditAdForm {
    name?: string;
    description?: string;
    price?: string;
    seo_tags?: string;
    
    city?: string;
    
    photo_card?: string | File;
    photos?: string[];
    
    photos_add?: File[];
    photos_update?: Photo[];
    photos_delete?: string[];
    
    
    category?: string;
    sub_category?: string;
    
    categories?: string[];
    
    filters_choices?: (FilterChoiceModel & SelectModel)[];
    filters_extras?: string[];
    
    descriptors?: SelectModel[];
}

export interface PhotoFull {
    id: string;
    url: string;
}

export interface NotificationModel {
    id: string;
    ref: string;
    type: number;
    from: string;
    meta: string;
    created_at: string;
}
