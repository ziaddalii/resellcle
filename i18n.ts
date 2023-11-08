// noinspection TypeScriptCheckImport
// noinspection TypeScriptCheckImport

import {getRequestConfig} from "next-intl/server";


export const get_messages = async (locale: string) => (await import(`./locale/${locale}.json`)).default;
export default getRequestConfig(async ({locale}) => ({
    messages: await get_messages(locale),
}));
