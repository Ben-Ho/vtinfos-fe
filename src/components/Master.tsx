import { CssBaseline, Grid, IconButton, Theme, Toolbar, Typography } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isWidthUp } from "@material-ui/core/withWidth";
import withWidth from "@material-ui/core/withWidth/withWidth";
import Menu from "@material-ui/icons/Menu";
import { MenuContext } from "@vivid-planet/react-admin-mui";
import Drawer from "app/components/Drawer";
import * as React from "react";
import { compose } from "recompose";
import { Content, Header } from "./Master.sc";

interface IWithWidth {
    width: Breakpoint;
}

class Master extends React.Component<IWithWidth> {
    public readonly state = {
        open: false,
    };

    public render() {
        const { children, width } = this.props;
        const { open } = this.state;
        const isLgUp = isWidthUp("lg", width);

        return (
            <MenuContext.Provider
                value={{
                    open,
                    toggleOpen: this.toggleOpen,
                }}
            >
                <Drawer open={this.state.open} closeMenu={this.toggleOpen} variant={isLgUp ? "permanent" : "temporary"} />
                <Header position="fixed" color="primary">
                    <Toolbar disableGutters={!isLgUp}>
                        {!isLgUp && (
                            <IconButton color="inherit" onClick={this.toggleOpen}>
                                <Menu />
                            </IconButton>
                        )}
                        TODO PageTitle
                    </Toolbar>
                </Header>
                <Content>{children}</Content>
            </MenuContext.Provider>
        );
    }

    private toggleOpen = () => {
        this.setState({ open: !this.state.open });
    };
}

const enhance = compose<IWithWidth, {}>(withWidth());

export default enhance(Master);
