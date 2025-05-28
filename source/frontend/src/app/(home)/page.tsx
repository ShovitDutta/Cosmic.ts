// source/frontend/src/app/(home)/page.tsx
import { auth } from "../../../auth";
import React, { Fragment } from "react";
import SignIn from "../../components/client/(root-page)/signin";
import { SignOut } from "../../components/client/(root-page)/signout";
import { UserAvatar } from "../../components/server/(root-page)/UserAvatar";
export default async function Page() {
    const session = await auth();
    if (!session) return <SignIn />;
    return (
        <Fragment>
            <UserAvatar session={session} />
            <ul>
                <li>
                    Email:
                    <span>{session.user?.email}</span>
                </li>
                <li>
                    Id:
                    <span>{session.user?.id}</span>
                </li>
                <li>
                    Name:
                    <span>{session.user?.name}</span>
                </li>
            </ul>
            <SignOut />
        </Fragment>
    );
}
