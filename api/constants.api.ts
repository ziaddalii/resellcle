// const BASE_URL = "http://192.168.1.101:3007/v1";
export const ROOT_URL = "https://api.resellcle.com";
const BASE_URL = `${ROOT_URL}/v1`;
export const LAYOUT = `${BASE_URL}/public/layout`;
export const HOME = `${BASE_URL}/public/screens/home`;
export const ADS_TYPE = (type: string, page: string | number) => `${BASE_URL}/public/screens/ads/${type}?page=${page}`;
export const AD_DETAILS = (id: string) => `${BASE_URL}/public/screens/ads/details/${id}`;
export const STATIC_PAGE = `${BASE_URL}/public/screens/static`;
export const SITEMAP = `${BASE_URL}/public/screens/sitemap`;
export const CATEGORIES = `${BASE_URL}/public/screens/categories`;
export const CATEGORY_DETAILS = (id: string) => `${BASE_URL}/public/screens/categories/${id}`;
export const SELLER_PAGE = (id: string, page: string | number) => `${BASE_URL}/public/screens/sellers/details/${id}?page=${page}`;
export const CONTACT_US = `${BASE_URL}/public/screens/contact-us`;
export const REGISTER = `${BASE_URL}/public/auth/register`;
export const GET_REGISTER = `${BASE_URL}/public/screens/auth/register`;
export const LOGIN = `${BASE_URL}/public/auth/login`;
export const GET_LOGIN = `${BASE_URL}/public/screens/auth/login`;
export const GET_PERSONAL_INFO = `${BASE_URL}/public/auth/user`;
export const DESCRIPTORS = `${BASE_URL}/public/descriptors-texts`;
export const GET_ADS_ADD = `${BASE_URL}/public/auth/ads/new`;
export const POST_ADS_ADD = `${BASE_URL}/public/auth/ads/new`;
export const POST_REPORT  = (id: string) => `${BASE_URL}/public/auth/ads/${id}/report`;
export const POST_CHAT = (id: string) => `${BASE_URL}/public/auth/ads/${id}/chat`;
export const COMMENT = (id: string) => `${BASE_URL}/public/auth/ads/${id}/comment`;
export const POST_SEARCH = `${BASE_URL}/public/screens/ads/search`;
export const GET_FAVORITES = `${BASE_URL}/public/auth/favorites`;
export const UPDATE_FAVORITES = `${BASE_URL}/public/auth/favorites`;
export const GET_NOTIFICATIONS = `${BASE_URL}/public/auth/notifications`;
export const DELETE_NOTIFICATIONS = `${BASE_URL}/public/auth/user`;
export const GET_CUSTOMER_ADS = (page: string | number) => `${BASE_URL}/public/auth/ads?page=${page}`;
export const UPDATE_AD = (id: string) => `${BASE_URL}/public/auth/ads/${id}`;
export const GET_MESSAGES = (page: string | number) => `${BASE_URL}/public/auth/chats?page=${page}`;
export const CHAT_MESSAGES = (id: string) => `${BASE_URL}/public/auth/chats/${id}`;






