import {maxLengthMsg, minLengthMsg} from "@/components/common/validations/util";
import {TLocalization} from "@/interfaces/global.interface";
import {z} from "zod";

export const zPhoneNumber = (key: string, t: TLocalization) => {
    
    return z.string()
        .min(11, minLengthMsg(11, key, t))
        .max(11, maxLengthMsg(11, key, t))
        .regex(/^\d+$/);
};
