import Container from "@/components/Container";
import ProfileAnnouncementCard from "@/components/profile/ProfileAnnouncementCard";
import ProfileContentHead from "@/components/profile/ProfileContentHead";
import React, { useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import AnnouncementCard from "../annoucement/AnnouncementCard";

export default function ProfileContainer({
  titleSection,
  infoSection,
  data,
  useCase,
  contentHeadTop = 99,
  mandatoryLogin = false,
}: {
  titleSection: React.ReactNode;
  infoSection: React.ReactNode;
  data: any[];
  useCase: "profile" | "merchant";
  contentHeadTop?: number;
  mandatoryLogin?: boolean;
}) {
  const [contentHeadSelected, setContentHeadSelected] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeadY, setContentHeadY] = useState(0);

  type announcementsCardsPropsType = {
    id: number;
    name: string;
    image: string;
    price: number;
    city: string;
    country: string;
    views: number;
    status: "inSell" | "disabled";
  };

  // announcement card
  const AnnouncementCards = ({
    id,
    name,
    image,
    price,
    city,
    country,
    views,
    status,
  }: announcementsCardsPropsType) => {
    if (useCase === "profile") {
      return (
        <ProfileAnnouncementCard
          key={id}
          id={id}
          name={name}
          image={image}
          price={price}
          city={city}
          country={country}
          views={views}
          status={status}
        />
      );
    }
    return (
      <AnnouncementCard
        id={id}
        name={name}
        image={image}
        price={price}
        city={city}
        country={country}
      />
    );
  };

  const ContentHeads = (
    <ProfileContentHead
      useCase={useCase}
      contentHeadSelected={contentHeadSelected}
      setContentHeadSelected={setContentHeadSelected}
    />
  );

  return (
    <Container
      mandatoryLogin={mandatoryLogin}
      withBottom={useCase === "merchant"}
      style={styles.container}
    >
      {/* title */}
      {titleSection}

      {/* content */}
      <FlatList
        data={data}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // annonce
          <View style={styles.itemWrapper}>
            <AnnouncementCards
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              city={item.location.city}
              country={item.location.pays}
              views={120}
              status={contentHeadSelected === 0 ? "inSell" : "disabled"}
            />
          </View>
        )}
        ListHeaderComponent={
          <>
            {/* info section */}
            {infoSection}
            {/* profile content head */}
            <View onLayout={(e) => setContentHeadY(e.nativeEvent.layout.y)}>
              {ContentHeads}
            </View>
          </>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* profile content head sticky */}
      {contentHeadY > 0 && useCase === "profile" && (
        <Animated.View
          style={[
            styles.stickyTab,
            {
              opacity: scrollY.interpolate({
                inputRange: [contentHeadY - 1, contentHeadY],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
              top: contentHeadTop,
            },
          ]}
        >
          {ContentHeads}
        </Animated.View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  stickyTab: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 20,
  },
  container: {},
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "48%",
    marginBottom: 20,
  },
});
