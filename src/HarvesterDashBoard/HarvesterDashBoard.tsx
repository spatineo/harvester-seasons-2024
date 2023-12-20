// eslint-disable-next-line import/no-extraneous-dependencies
import { Outlet } from "react-router-dom";
import HeadingCompoment from "../HeadingCompnent/HeadingComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import { Box, styled  } from "@mui/material";

const StyledDiv = styled(Box)({
  '@media (max-width:900px)': {
    width: '100%',
    margin: '0rem auto'
  },
  '@media (min-width: 901px)': {
    maxWidth: '1000px',
    margin: '0rem auto'
  }
})

function HarvesterDashBoard() {
  return (
    <StyledDiv>
      <HeadingCompoment />
      <Outlet />
      <FooterComponent />
    </StyledDiv>
  );
}

export default HarvesterDashBoard;
