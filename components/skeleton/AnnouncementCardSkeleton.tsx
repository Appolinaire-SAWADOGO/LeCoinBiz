import React from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

export default function AnnouncementCardSkeleton({
  type = "primary",
}: {
  type?: "similar" | "primary";
}) {
  const isSimilarType = type === "similar";

  return (
    <Box
      style={{
        width: isSimilarType ? 208 : 152,
        borderRadius: 12,
        backgroundColor: "white",
      }}
    >
      {/* Image placeholder */}
      <Skeleton
        variant="rounded"
        style={{
          height: 160,
          width: "100%",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* Contenu texte */}
      <VStack style={{ paddingVertical: 12, gap: 8 }}>
        {/* Prix */}
        <SkeletonText style={{ height: 16, width: "60%" }} />

        {/* Nom */}
        <SkeletonText style={{ height: 12, width: "80%" }} />

        {/* Localisation */}
        <HStack style={{ alignItems: "center", gap: 8 }}>
          <SkeletonText style={{ height: 12, width: "66%" }} />
        </HStack>

        {/* Date */}
        <SkeletonText style={{ height: 12, width: "33%" }} />
      </VStack>
    </Box>
  );
}
