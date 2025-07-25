import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import AppInput from "@/components/custom/input/AppInput";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Trash } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdConditionsSection() {
  const { designSystem } = useAppTheme();

  const [condition, setCondition] = useState("");
  const [conditionsList, setConditionsList] = useState<string[]>([]);

  const handleAddCondition = () => {
    if (condition.trim() !== "") {
      setConditionsList((prev) => [...prev, condition.trim()]);
      setCondition("");
    }
  };

  return (
    <PostAnAdSection label="Conditions">
      <View style={{ gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <AppInput
              placeholder="Ajouter une condition"
              value={condition}
              onChangeText={setCondition}
              model="withBorder"
            />
          </View>
          <AppButton
            title="Ajouter"
            onPress={handleAddCondition}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 8,
            }}
            textWeight="Regular"
            textStyle={{ fontSize: 14 }}
          />
        </View>

        {conditionsList.length > 0 && (
          <View style={{ paddingTop: 10, gap: 8 }}>
            {conditionsList.map((item, index) => (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText
                    key={index}
                    style={{ fontSize: 14, marginBottom: 4 }}
                  >
                    • {item}
                  </AppText>
                  <TouchableOpacity
                    activeOpacity={0.1}
                    onPress={() =>
                      setConditionsList((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash size={16} color={"red"} />
                  </TouchableOpacity>
                </View>
              </>
            ))}
          </View>
        )}
      </View>
    </PostAnAdSection>
  );
}
