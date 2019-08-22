import { ILibUser } from "app/userProvider/hooks/createUserContextApi";
import UserContext from "app/userProvider/hooks/UserContext";
import * as React from "react";

export function libUseUser<TUser extends ILibUser>(): TUser | null {
    const userContext = React.useContext(UserContext);
    if (userContext.user) {
        return userContext.user as TUser;
    } else {
        return null;
    }
}
export function libUseHasRole(role: string) {
    const userContext = React.useContext(UserContext);
    return userContext.user ? userContext.user.roles.indexOf(role) !== -1 : false;
}
export function libUseUserRoles() {
    const userContext = React.useContext(UserContext);
    if (userContext.user) {
        return userContext.user.roles;
    } else {
        return null;
    }
}
