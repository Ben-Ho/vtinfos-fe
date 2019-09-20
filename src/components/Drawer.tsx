import AccessibilityNew from "@material-ui/icons/AccessibilityNew";
import Help from "@material-ui/icons/Help";
import HelpOutline from "@material-ui/icons/HelpOutline";
import Info from "@material-ui/icons/Info";
import LocationCity from "@material-ui/icons/LocationCity";
import Place from "@material-ui/icons/Place";
import Search from "@material-ui/icons/Search";
import Settings from "@material-ui/icons/Settings";
import SpeakerNotes from "@material-ui/icons/SpeakerNotes";
import TrendingUp from "@material-ui/icons/TrendingUp";
import Update from "@material-ui/icons/Update";
import { createStyles, makeStyles } from "@material-ui/styles";
import { LogoWrapper, StyledDrawer } from "app/components/Drawer.sc";
import Logo from "app/components/Logo";
import { MenuItemLink } from "app/components/MenuItemLink";
import * as React from "react";

interface IProps {
    open: boolean;
    closeMenu: () => void;
    variant: "temporary" | "permanent";
}

function ResponsiveDrawer(props: IProps) {
    const { open, closeMenu, variant } = props;
    return (
        <nav>
            <StyledDrawer
                variant={variant}
                anchor={"left"}
                open={variant === "temporary" ? open : true}
                onClose={closeMenu}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                <>
                    <LogoWrapper>
                        <Logo />
                    </LogoWrapper>
                    {/*g_translate translate language für sprach-wechsel*/}
                    {/*print für pdf-herunterladen*/}
                    {/*get_app für herunterladen*/}
                    {/*find_in_page find_replace perm_contact_calendar perm_identity */}
                    <MenuItemLink closeMenu={closeMenu} variant={variant} text="Suche" icon={<Search />} to="/search" />
                    {/*info trending_up update*/}
                    <MenuItemLink closeMenu={closeMenu} variant={variant} text="News" icon={<Info />} to="/news" />
                    {/*settings create*/}
                    <MenuItemLink closeMenu={closeMenu} variant={variant} text="Eigene Daten" icon={<Settings />} to="/own-data" />
                    {/*explore list store supervisor_account list_alt location map navigation near_me pin_drop place location_city public people domain*/}
                    <MenuItemLink closeMenu={closeMenu} variant={variant} text="Versammlungen" icon={<LocationCity />} to="/congregations" />
                    {/*// speaker_notes comment chat message textsms*/}
                    <MenuItemLink closeMenu={closeMenu} variant={variant} text="Vorträge" icon={<SpeakerNotes />} to="/talks" />
                    <MenuItemLink closeMenu={closeMenu} variant={variant} text="Statistiken" icon={<SpeakerNotes />} to="/statistics" />
                    {/*help help_outline oder AccessibilityNew live_help*/}
                    <MenuItemLink closeMenu={closeMenu} variant={variant} text="Anleitungen" icon={<Help />} to="/manual" />
                    {/*    feedback*/}
                </>
            </StyledDrawer>
        </nav>
    );
}

export default ResponsiveDrawer;
