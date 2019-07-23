import { MenuItemRouterLink } from "@vivid-planet/react-admin-mui";
import * as React from "react";

export interface IProps {
    closeMenu: () => void;
    variant: "temporary" | "permanent";
    text: string;
    icon: React.ReactElement;
    to: string;
}

export const MenuItemLink: React.FunctionComponent<IProps> = ({ closeMenu, variant, ...rest }: IProps) => {
    return (
        <MenuItemRouterLink
            {...rest}
            onClick={() => {
                if (variant === "temporary") closeMenu();
            }}
        />
    );
};
