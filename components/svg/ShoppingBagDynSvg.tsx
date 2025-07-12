import { ViewStyle } from "@expo/html-elements/build/primitives/View";
import { Filter } from "lucide-react-native";
import React from "react";
import { StyleProp } from "react-native";
import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  G,
  Path,
} from "react-native-svg";

export default function ShoppingBagDynSvg({
  width = 100,
  height = 168,
  style,
}: {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Svg
      width={width}
      height={height}
      style={{ flex: 1 }}
      viewBox="0 0 100 168"
      fill="none"
    >
      <G filter="url(#filter0_d_3188_13310)">
        <Path
          d="M22.3687 30.1508L20.5156 30.0695C20.626 27.5417 21.7359 5.25554 26.6139 1.19012C26.9237 0.913283 27.2891 0.705851 27.6854 0.581711C28.0818 0.45757 28.5001 0.419581 28.9123 0.470287C31.8164 0.874771 34.9875 5.4828 38.6072 14.5579C41.1845 21.0192 43.0423 27.4617 43.0607 27.5261L41.2782 28.0385C41.26 27.9749 39.4241 21.6103 36.8801 15.2342C32.388 3.97641 29.6329 2.44475 28.6569 2.30896C28.5002 2.29199 28.3418 2.31085 28.1935 2.36412C28.0452 2.4174 27.911 2.50369 27.8009 2.61649C24.2015 5.61598 22.6593 23.5091 22.3687 30.1508Z"
          fill="black"
          fillOpacity="0.35"
        />
        <Path
          d="M5.99672 18.1258L4.1416 64.6759L65.3491 58.0785L57.783 13.1354L5.99672 18.1258Z"
          fill="white"
        />
        <Path
          d="M57.783 13.1354L53.2805 13.5692L59.2729 52.9797L4.35601 59.3028L4.1416 64.6759L65.3491 58.0785L57.783 13.1354Z"
          fill="black"
          fillOpacity="0.15"
        />
      </G>
      <Path
        d="M90.8498 93.1804L88.3045 92.8976C88.3264 92.6974 90.4401 72.7837 83.5851 65.3372C82.7795 64.4314 81.7794 63.7197 80.6599 63.2557C79.5404 62.7917 78.3305 62.5872 77.1209 62.6578C62.1891 63.0826 55.1682 88.725 55.0992 88.9838L52.625 88.3219C54.004 83.5333 55.9195 78.9161 58.335 74.5582C63.5373 65.2971 70.008 60.296 77.048 60.0959C78.6242 60.015 80.1985 60.2879 81.6558 60.8946C83.113 61.5013 84.4163 62.4264 85.4702 63.6023C93.113 71.9077 90.9459 92.3156 90.8498 93.1804Z"
        fill="#FFBA49"
      />
      <Path
        d="M45.4284 74.9176L99.4584 81.3297L98.6203 167.064L26.4971 158.468L45.4284 74.9176Z"
        fill="white"
      />
      <Path
        d="M99.4584 81.3297L94.1075 80.6945L91.5014 160.022L27.5129 153.985L26.4971 158.468L98.6203 167.064L99.4584 81.3297Z"
        fill="black"
        fillOpacity="0.15"
      />
      <Defs>
        <Filter
          id="filter0_d_3188_13310"
          x="0.141602"
          y="0.448486"
          width="69.207"
          height="72.2274"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="4" />
          <FeGaussianBlur stdDeviation="2" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3188_13310"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3188_13310"
            result="shape"
          />
        </Filter>
      </Defs>
    </Svg>
  );
}
