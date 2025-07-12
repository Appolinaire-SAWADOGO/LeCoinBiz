import PassordInpuCheckCard from "@/components/auth/form/PassordInpuCheckCard";
import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

export default function AppPasswordInput({
  placeholder,
  style,
}: {
  placeholder: string;
  style?: StyleProp<TextStyle>;
}) {
  const { designSystem } = useAppTheme();

  const [isVisible, setIsVisible] = React.useState(false);

  const seeButtonTextColor = isVisible
    ? designSystem.colors.smallText
    : designSystem.colors.subText;

  return (
    <View>
      {/* head */}
      <View style={styles.head}>
        {/* input */}
        <TextInput
          secureTextEntry={isVisible}
          placeholder={placeholder}
          style={[
            styles.input,
            {
              borderColor: designSystem.colors.inputBorder,
            },
            style,
          ]}
        />

        {/* see button */}
        <TouchableOpacity
          onPress={() => setIsVisible((prev) => !prev)}
          style={styles.seeButton}
        >
          <AppText color={seeButtonTextColor} fontSize={13} font="Medium">
            {isVisible ? "Voir" : "Cacher"}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* condition */}
      <View style={styles.condition}>
        <PassordInpuCheckCard isvalided label="Une lettre (a-z)" />
        <PassordInpuCheckCard isvalided label="Un chiffre (0-9)" />
        <PassordInpuCheckCard isvalided label="Un caractère spécial" />
        <PassordInpuCheckCard isvalided label="8 caractères minimum" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    height: 48,
  },
  input: {
    fontFamily: "BasisGrotesqueArabicPro-Regular",
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    paddingLeft: 16,
    paddingRight: 60,
  },
  condition: {
    marginTop: 8,
    gap: 4,
  },
  seeButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
});
