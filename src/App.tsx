import { RouterBrowserRouter } from "@vivid-planet/react-admin-core";
import { LocaleContext } from "@vivid-planet/react-admin-date-fns";
import { MuiThemeProvider } from "@vivid-planet/react-admin-mui";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { RestLink } from "apollo-link-rest";
import { withClientState } from "apollo-link-state";
import Master from "app/components/Master";
import { getConfig } from "app/config";
import "app/globals";
import AdditionalPage from "app/pages/AdditionalPage";
import Search from "app/pages/Search";
import theme from "app/theme";
import UserProvider from "app/userProvider/components/UserProvider";
import { de as dateFnsLocaleDe } from "date-fns/locale";
import { User, UserManager, WebStorageStateStore } from "oidc-client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import * as Webfontloader from "webfontloader";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";

const cache = new InMemoryCache();
const stateLink = withClientState({
    cache,
    resolvers: {},
});

const oidcUserService = new UserManager({
    client_id: getConfig("userProviderClientId"),
    redirect_uri: location.origin + "/process-token",
    authority: getConfig("userProviderUrl") + "/api/v1/oauth/",
    scope: "openid profile email",
    response_type: "id_token token",
    userStore: new WebStorageStateStore({ store: window.localStorage }), // use Local Storage instead of Session Storage (data is not removed when browser window is closed)
    post_logout_redirect_uri: getConfig("userProviderUrl") + "/api/v1/logout/",
});
// uncomment to debug oidc client
// OidcClientLog.logger = console;

// https://github.com/apollographql/apollo-client/issues/2441#issuecomment-340819525
const authTokenContext = setContext((operation, { headers = {} }) => {
    return oidcUserService.getUser().then((user: User) => ({
        headers: {
            ...headers,
            authorization: user && user.access_token ? `Bearer ${user.access_token}` : null,
        },
    }));
});

const link = ApolloLink.from([
    stateLink,
    authTokenContext,
    new RestLink({
        uri: getConfig("apiUrl"),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    }),
]);

const client = new ApolloClient({
    link,
    cache,
});

class App extends React.Component {
    public static render(baseEl: Element) {
        Webfontloader.load({
            google: {
                families: ["Open Sans", "Material Icons"],
            },
        });

        ReactDOM.render(<App />, baseEl);
    }

    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                <RouterBrowserRouter>
                    <UserProvider oidcUserManager={oidcUserService}>
                        <ApolloProvider client={client}>
                            <LocaleContext.Provider value={dateFnsLocaleDe}>
                                <Master>
                                    <Switch>
                                        <Route path="/search" component={Search} />
                                        <Route path="/additional-page" component={AdditionalPage} />
                                        <Redirect from="/" to="/dashboard" />
                                    </Switch>
                                </Master>
                            </LocaleContext.Provider>
                        </ApolloProvider>
                    </UserProvider>
                </RouterBrowserRouter>
            </MuiThemeProvider>
        );
    }
}
export default App;
