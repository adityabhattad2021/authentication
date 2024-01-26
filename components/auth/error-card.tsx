import { Card, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";

export function ErrorCard() {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header
                    label="Oops! something went wrong!"
                />
            </CardHeader>
            <CardFooter>
                <BackButton
                    label="Back to login"
                    href="/auth/login"
                />
            </CardFooter>
        </Card>
    )
}