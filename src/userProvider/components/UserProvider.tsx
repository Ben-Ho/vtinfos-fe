import createUserContextApi from "app/userProvider/hooks/createUserContextApi";
import UserContext from "app/userProvider/hooks/UserContext";
import useUserProviderEffects from "app/userProvider/hooks/useUserProviderEffects";
import useUserProviderState from "app/userProvider/hooks/useUserProviderState";
import { User, UserManager } from "oidc-client";
import * as React from "react";

export interface IPropsUserProvider {
    oidcUserManager: UserManager;
    redirectPath?: string; // after successfull login
    whileLoading?: React.ReactNode;
    showOnError?: (errorMsg: string, redirectPath: string) => React.ReactNode;
}

const UserProvider: React.FC<IPropsUserProvider> = props => {
    const { oidcUserManager, children, whileLoading, showOnError, redirectPath } = props;

    const state = useUserProviderState();
    const api = createUserContextApi(props, state);

    useUserProviderEffects(oidcUserManager, state);

    if (state.error) {
        if (showOnError) {
            return <>showOnError(state.error, redirectPath)</>;
        } else {
            return (
                <>
                    Fehler aufgetreten; {state.error}
                    <br />
                    <a href={redirectPath ? redirectPath : "/"}>Nochmal probieren</a>
                </>
            );
        }
    }

    // handle process-token-url
    if (location.pathname.indexOf("/process-token") === 0) {
        // /process-token#access_token OR /process-token?error=invalid_scope&error_descr...
        if (!state.isAuthenticating && !state.oidcUser) {
            api.processTokenInUrl().then((loggedInUser: User) => {
                if (!loggedInUser) return; // redirect bricht aus react-cycles aus. deswegen wirklich nur redirecten wenn user eingeloggt.
                window.location.href = redirectPath ? redirectPath : "/";
            });
            return <>{whileLoading}</>;
        }
    }

    const { isAuthenticating, isRehydrating, isAuthenticated, redirectUserToLoginForm, user } = api;

    // we are neither rehydrating the user from store nor authenticating the user,
    // theres no more need to wait for any change, there is definitely no user available
    const definitelyNotAuthenticated = !isRehydrating && !isAuthenticating && !isAuthenticated;

    // we are either rehydrating user from store or authenticating the user
    // in both cases we wait for the result
    if ((isRehydrating || isAuthenticating) && !isAuthenticated) {
        return <>{whileLoading}</>;
    }

    if (definitelyNotAuthenticated) {
        redirectUserToLoginForm();
    }

    if (!user) {
        return <>{whileLoading}</>;
    }

    // definitely authenticated, render the content
    return <UserContext.Provider value={api}>{children}</UserContext.Provider>;
};

export default UserProvider;
