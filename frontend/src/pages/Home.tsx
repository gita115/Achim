import { useEffect, useState } from "react";
import ImageCard from "../components/ImageCard";
import SearchBar from "../components/SearchBar";
import type { Image } from "../types/models";

const fakeImages: Image[] = [
  { id: 1,
    title: "string",
    description: "string",
    categoryId: 5,
    photographer: "string",
    year: 2000,
    filePath: "string",
    thumbnailPath: "string",
    isActive: true,
    price: 100 },
  { id: 2,
    title: "string",
    description: "string",
    categoryId: 5,
    photographer: "string",
    year: 2000,
    filePath: "string",
    thumbnailPath: "string",
    isActive: true,
    price: 100 }, 

  { id: 3,
    title: "string",
    description: "string",
    categoryId: 5,
    photographer: "string",
    year: 2000,
    filePath: "string",
    thumbnailPath: "string",
    isActive: true,
    price: 100 }
];

const Home = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setImages(fakeImages);
  }, []);

  const filtered = images.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 30 }}>
      <h1>Image Catalog</h1>

      <SearchBar value={search} onChange={setSearch} />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {filtered.map(image => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

export default Home;
