"use client";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verifyEmail } from "@/actions/new-verification";
import { FormMessage } from "../form-message";


export function NewVerificationForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Missing token!")
            return;
        }
        verifyEmail(token).then((data) => {
            setSuccess(data?.success);
            setError(data?.error)
        }).catch((err) => {
            setError("Something went wrong!");
        });
    }, [token]);

    useEffect(() => {
        if (success || error) {
            return;
        }
        console.log(success);
        console.log(error);
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center w-full justify-center">
                {
                    !success && !error && (
                        <BeatLoader />
                    )
                }
                <FormMessage
                    message={success}
                    type="success"
                />
                <FormMessage
                    message={error}
                    type="error"
                />
            </div>
        </CardWrapper>
    )
}