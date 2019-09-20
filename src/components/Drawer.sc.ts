import { Drawer } from "@material-ui/core";
import { styled } from "@vivid-planet/react-admin-mui";

export const LogoWrapper = styled.div`
    min-height: 60px;
`;

export const StyledDrawer = styled(Drawer)`
    & .MuiDrawer-paper {
        width: ${({ theme }) => theme.appDrawer.width}px;
    }
`;
