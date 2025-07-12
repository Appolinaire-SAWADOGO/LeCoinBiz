import React from "react";
import AnnouncementCard from "../annoucement/AnnouncementCard";
import ProfileDelOrEdAnnouncement from "./ProfileDelOrEdAnnouncement";

export default function ProfileAnnouncementCard({
  id,
  name,
  image,
  price,
  city,
  country,
  views,
  status,
}: {
  id: number;
  name: string;
  image: string;
  price: number;
  city: string;
  country: string;
  views: number;
  status: "inSell" | "disabled";
}) {
  return (
    <AnnouncementCard
      id={id}
      name={name}
      image={image}
      price={price}
      city={city}
      country={country}
      views={views}
      useCase="ProfilePage"
      status={status}
    >
      <ProfileDelOrEdAnnouncement status={status} />
    </AnnouncementCard>
  );
}
