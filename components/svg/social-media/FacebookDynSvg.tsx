import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export default function FacebookDynSvg({
  width = 40,
  height = 40,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="20" fill="#3B5998" />
      <Path
        d="M21.3333 28H18.161V20.1131H16V17.5453H18.1609V15.7181C18.1609 13.5529 19.1167 12 22.2804 12C22.9495 12 24 12.1345 24 12.1345V14.5189H22.8966C21.7724 14.5189 21.3334 14.8599 21.3334 15.8028V17.5453H23.9579L23.7242 20.1131H21.3334L21.3333 28Z"
        fill="white"
      />
    </Svg>
  );
}
