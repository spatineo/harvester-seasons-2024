import React from "react";

interface LayersProps {
  children: React.ReactNode
}
const Layers: React.FC<LayersProps> = ({ children }) => {
  return <div>{children}</div>;
};
export default Layers;