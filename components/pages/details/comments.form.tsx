"use client";
import {Box, Button, Container, TextField} from "@mui/material";
import {useZod} from "@/hooks/zod.hooks";
import {z} from "zod";
import {getError, hasError, minLengthMsg} from "@/components/common/validations/util";
import {useState} from "react";
import {toggle_loading} from "@/components/common/notifications/global-progress-bar.notification";
import {notify} from "@/components/common/notifications/global-snackbar.notification";
import {post_comment} from "@/api/requests.api";
import {AdModel, CommentFormModel} from "@/api/interfaces.api";
import {GlobalInterface} from "@/interfaces/global.interface";
import {Controller} from "react-hook-form";
import CommentCard from "@/components/common/cards/comment.card";
import {useTranslations} from "next-intl";
import {isString} from "lodash-es";
import {scroll_to} from "@/components/common/buttons/floating-arrow.button";
import {sleep} from "@/util/formatting.util";
import {is_authenticated} from "@/api/cookies.api";


interface CommentsSectionProps extends GlobalInterface {
    ad_id: string;
    comments: AdModel["comments"];
}

export function CommentsSection({comments, ad_id, locale}: CommentsSectionProps) {
    
    const t = useTranslations();
    
    const [comments_list, set_comments_list] = useState<CommentsSectionProps["comments"]>(comments);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const {errors, onSubmit, control, reset} = useZod<CommentFormModel>(
        {
            comment: z.string().min(3, minLengthMsg(3, "fields.comment", t)),
        },
        {
            comment: "",
        },
        async (validatedData: CommentFormModel) => {
            
            setIsLoading(true);
            await toggle_loading(true);
            
            const result = await post_comment(validatedData, ad_id, locale!);
            
            if (isString(result)) {
                notify(true, result);
            } else {
                reset();
                notify(false, t("fields.operation_completed"));
                set_comments_list(result);
                await sleep(1);
                scroll_to(`ad-comment-${result[result.length - 1]}`);
            }
            
            setIsLoading(false);
            await toggle_loading(false);
            
        }
    );
    
    return (
        <Container maxWidth="xl" component="section" className="space-y-2">
            
            <p className="font-bold text-xl">{`${t!("fields.comments")}: `}</p>
            
            {/*Comments*/}
            {comments_list.map((comment) => {
                return (
                    <CommentCard
                        key={comment.id}
                        id={comment.id}
                        name={comment.full_name}
                        photo_url={comment.photoUrl}
                        body={comment.message}
                    />
                );
            })}
            
            {/*Form*/}
            {/* <CommentsForm locale={locale} ad_id={ad_id}/> */}
            {
                is_authenticated &&
                <Box component="form" className="space-y-2">

                    <Controller
                        name="comment"
                        control={control}
                        render={({field}) => (
                            <TextField
                                {...field}
                                sx={{marginBottom: ".5rem"}}
                                disabled={isLoading}
                                fullWidth
                                id="outlined-multiline-flexible"
                                label={t("fields.comment")}
                                placeholder={t("placeholders.enter_comment")}
                                error={hasError(errors, "comment")}
                                helperText={getError(errors, "comment")}
                                multiline
                                minRows={4}
                                maxRows={8}
                            />
                        )}
                    />

                    <Button
                        disabled={isLoading}
                        onClick={onSubmit}
                        type="submit"
                        variant="contained"
                        sx={{color: "white"}}>
                        {t("fields.send")}
                    </Button>

                </Box>
            }
        
        </Container>
    );
}

