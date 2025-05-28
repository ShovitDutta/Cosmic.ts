import { auth } from "../../../auth";
import React, { Fragment } from "react";
import SignIn from "../../components/sign-in";
import { SignOut } from "../../components/signout-button";
import { UserAvatar } from "../../components/UserAvatar";
export default async function Page() {
    const session = await auth();
    if (!session) return <SignIn />;
    return (
        <Fragment>
            <UserAvatar session={session} />
            <SignOut />
        </Fragment>
    );
}
