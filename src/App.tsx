import { RouterBrowserRouter } from "@vivid-planet/react-admin-core";
import { LocaleContext } from "@vivid-planet/react-admin-date-fns";
import { MuiThemeProvider } from "@vivid-planet/react-admin-mui";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import { withClientState } from "apollo-link-state";
import Master from "app/components/Master";
import { getConfig } from "app/config";
import "app/globals";
import AdditionalPage from "app/pages/AdditionalPage";
import Search from "app/pages/Search";
import theme from "app/theme";
import * as dateFnsLocaleDe from "date-fns/locale/de";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import * as ReactDOM from "react-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import * as Webfontloader from "webfontloader";

const cache = new InMemoryCache();
const stateLink = withClientState({
    cache,
    resolvers: {},
});

const link = ApolloLink.from([
    stateLink,
    new RestLink({
        uri: getConfig("apiUrl"),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: "Bearer xxxx",
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
                    <ApolloProvider client={client}>
                        <ApolloHooksProvider client={client}>
                            <LocaleContext.Provider value={dateFnsLocaleDe}>
                                <Master>
                                    <Switch>
                                        <Route path="/search" component={Search} />
                                        <Route path="/additional-page" component={AdditionalPage} />
                                        <Redirect from="/" to="/dashboard" />
                                    </Switch>
                                </Master>
                            </LocaleContext.Provider>
                        </ApolloHooksProvider>
                    </ApolloProvider>
                </RouterBrowserRouter>
            </MuiThemeProvider>
        );
    }
}
export default App;
