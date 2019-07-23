import { CssBaseline, Grid, IconButton, Theme, Toolbar, Typography } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isWidthUp } from "@material-ui/core/withWidth";
import withWidth from "@material-ui/core/withWidth/withWidth";
import Menu from "@material-ui/icons/Menu";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { MenuContext } from "@vivid-planet/react-admin-mui";
import Drawer from "app/components/Drawer";
import * as React from "react";
import { compose } from "recompose";
import { Header } from "./Master.sc";

interface IWithWidth {
    width: Breakpoint;
}

class Master extends React.Component<WithStyles<typeof styles> & IWithWidth> {
    public readonly state = {
        open: false,
    };

    public render() {
        const { classes, children, width } = this.props;
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
                <Header position="fixed" className={classes.appbar} color="primary">
                    <Toolbar disableGutters={!isLgUp}>
                        {!isLgUp && (
                            <IconButton color="inherit" onClick={this.toggleOpen}>
                                <Menu />
                            </IconButton>
                        )}
                        TODO PageTitle
                    </Toolbar>
                </Header>
                <main className={classes.content}>{children}</main>
            </MenuContext.Provider>
        );
    }

    private toggleOpen = () => {
        this.setState({ open: !this.state.open });
    };
}

const styles = (theme: Theme) =>
    createStyles({
        appbar: {
            marginLeft: theme.appDrawer.width,
            [theme.breakpoints.up("lg")]: {
                // >=1280px
                width: `calc(100% - ${theme.appDrawer.width}px)`,
            },
        },
        content: {
            marginTop: `60px`,
            paddingLeft: theme.content.defaultPadding,
            paddingRight: theme.content.defaultPadding,
            paddingBottom: theme.content.defaultPadding,
            [theme.breakpoints.up("lg")]: {
                // >=1280px
                marginLeft: `${theme.appDrawer.width}px`,
                width: `calc(100% - ${theme.appDrawer.width + theme.content.defaultPadding * 2}px)`,
            },
        },
    });

const enhance = compose<WithStyles<typeof styles> & IWithWidth, {}>(
    withStyles(styles),
    withWidth(),
);

export default enhance(Master);
