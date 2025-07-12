import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export default function LinkedInDynSvg({
  width = 40,
  height = 40,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="20" fill="#0077B5" />
      <G clip-path="url(#clip0_1807_46721)">
        <Path
          d="M27.9961 28.0005V27.9998H28.0001V22.1318C28.0001 19.2611 27.3821 17.0498 24.0261 17.0498C22.4128 17.0498 21.3301 17.9351 20.8881 18.7745H20.8414V17.3178H17.6594V27.9998H20.9728V22.7105C20.9728 21.3178 21.2368 19.9711 22.9614 19.9711C24.6608 19.9711 24.6861 21.5605 24.6861 22.7998V28.0005H27.9961Z"
          fill="white"
        />
        <Path
          d="M12.2637 17.3184H15.581V28.0004H12.2637V17.3184Z"
          fill="white"
        />
        <Path
          d="M13.9213 12C12.8607 12 12 12.8607 12 13.9213C12 14.982 12.8607 15.8607 13.9213 15.8607C14.982 15.8607 15.8427 14.982 15.8427 13.9213C15.842 12.8607 14.9813 12 13.9213 12V12Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1807_46721">
          <Rect
            width="16"
            height="16"
            fill="white"
            transform="translate(12 12)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
