import Announcements from "@/components/annoucement/Announcements";
import Container from "@/components/Container";
import HeaderHideAnimation from "@/components/HeaderHideAnimation";
import HomeHeaderSection from "@/components/home/HomeHeaderSection";
import PostAnAdButton from "@/components/PostAnAdButton";
import { useAppTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import HeaderTexture1 from "../../assets/images/textures/HeaderTexture1.png";

export default function Home() {
  const { designSystem } = useAppTheme();

  const [country, setCountry] = React.useState<any>();
  const scrollY = new Animated.Value(0);

  // country find
  useEffect(() => {
    async function getCountry() {
      try {
        const countryData = await AsyncStorage.getItem("user_country");
        setCountry(countryData);
      } catch (error) {
        console.error("Error getting country", error);
      }
    }
    getCountry();
  });

  return (
    <>
      <Container
        style={[
          styles.container,
          { backgroundColor: designSystem.colors.primary },
        ]}
        withBottom={false}
      >
        {/* button ajouter une annonce */}
        <PostAnAdButton />

        {/* header */}
        <HeaderHideAnimation scrollY={scrollY} headerHeight={350}>
          <Image style={styles.headerTexture1} source={HeaderTexture1} />
          <HomeHeaderSection />
        </HeaderHideAnimation>

        {/* main */}
        <View style={styles.main}>
          <Announcements
            scrollY={scrollY}
            style={{ paddingBottom: 60, paddingTop: 300 }}
          />
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTexture1: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  main: {
    flex: 1,
    backgroundColor: "white",
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopStartRadius: 10,
  },
});
