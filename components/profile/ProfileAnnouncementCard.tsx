import React from "react";
import AnnouncementCard from "../announcement/AnnouncementCard";
import ProfileDelOrEdAnnouncement from "./ProfileDelOrEdAnnouncement";

export default function ProfileAnnouncementCard({
  id,
  title,
  image,
  price,
  city,
  createdAt,
  views,
  status,
}: {
  id: string;
  title: string;
  image: string;
  price: number;
  city: string;
  createdAt: string;
  views: number;
  status: "inSell" | "disabled";
}) {
  return (
    <AnnouncementCard
      id={id}
      title={title}
      image={image}
      price={price}
      city={city}
      createdAt={createdAt}
      views={views}
      useCase="ProfilePage"
      status={status}
    >
      <ProfileDelOrEdAnnouncement status={status} />
    </AnnouncementCard>
  );
}
