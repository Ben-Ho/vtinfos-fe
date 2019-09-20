import { AppBar } from "@material-ui/core";
import { styled } from "@vivid-planet/react-admin-mui";

export const Header = styled(AppBar)`
    padding-top: 6px;
    padding-bottom: 6px;
    &.MuiAppBar-positionFixed {
        @media (min-width: ${({ theme }) => theme.breakpoints.values.lg}px) {
            ${({ theme }) => `left: ${theme.appDrawer.width}px`};
        }
    }
`;

export const Content = styled.main`
    margin-top: 60px;
    @media (min-width: ${({ theme }) => theme.breakpoints.values.lg}px) {
        ${({ theme }) => `margin-left: ${theme.appDrawer.width}px`}
    }
`;
