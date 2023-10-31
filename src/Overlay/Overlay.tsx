import { useState, FC, ReactNode } from "react";
import { Box } from "@mui/material";
import layersImage from "../assets/layer-image.avif";
import "./Overlay.css";

interface OverlayProps {
  children: ReactNode;
}

const Overlay: FC<OverlayProps> = ({ children }) => {
  const [isButtonHovered, setButtonHovered] = useState(false);

  const handleButtonHover = () => {
    setButtonHovered(true);
  };

  const handleButtonLeave = () => {
    setButtonHovered(false);
  };
  
  return (
    <Box>
      <div
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
        style={{
          width: "50px",
          height: "46px",
          position: "relative",
          float: 'right',
          top: "4rem",
          right: "2rem",
          zIndex: "99",
          background: "white",
          border: "none",
          boxSizing: "border-box"
        }}
      >
        <img
          className={!isButtonHovered ? "image" : "none"}
          src={layersImage}
        />
        <Box className={`${isButtonHovered ? "layer" : "none"}`}>
          {children}
        </Box>
      </div>
    </Box>
  );
};

export default Overlay;
