import React from "react";
import AnnouncementCard from "../annoucement/AnnouncementCard";

export default function SimilarAnnoucementCard({
  id,
  name,
  image,
  price,
  city,
  country,
}: {
  id: number;
  name: string;
  image: string;
  price: number;
  city: string;
  country: string;
}) {
  return (
    <AnnouncementCard
      id={id}
      name={name}
      image={image}
      price={price}
      city={city}
      country={country}
      type="similar"
    />
  );
}
