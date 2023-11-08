/** Hook for zod validation */
import * as z from "zod";
import {ZodObject} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ZodRawShape} from "zod/lib/types";
import {useForm} from "react-hook-form";

export const useZod = <T>(
    schema: ZodRawShape,
    defaultValues: any,
    onFormSubmit: (validatedData: any) => any,
    with_refine?: (zodObject: ZodObject<ZodRawShape>) => any,
) => {
    const {
        watch,
        control,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        getValues,
    } = useForm({
        resolver: zodResolver(
            with_refine ?
                with_refine(z.object(schema)) :
                z.object(schema)
        ),
        defaultValues,
    });
    
    return {
        watch,
        reset,
        setValue,
        getValues,
        errors,
        control: control as any,
        onSubmit: handleSubmit(d => onFormSubmit(d as T)),
    };
};
