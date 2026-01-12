import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HorSlider from "./HorSlider";

const ShopBy = ({ filter, title }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const brandsData = [
    { src: "/GenInfo/adidas.jpg", name: "Adidas", to: "/search/adidas" },
    { src: "/GenInfo/nike.png", name: "Nike", to: "/search/nike" },
    { src: "/GenInfo/skechers.jpg", name: "Skechers", to: "/search/skechers" },
    { src: "/GenInfo/puma.jpg", name: "Puma", to: "/search/puma" },
  ];

  useEffect(() => {
    if (filter === "bestSellers") {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/filter/${filter}`
        );
        if (isMounted) {
          setProducts(res.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Error while fetching products: ${err.message}`);
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  return (
    <>
      <div className="mt-10 mb-2 text-2xl">{title}</div>
      <div className="overflow-x-auto overflow-y-hidden md:max-w-full scroll-container mb-10 mx-auto relative scroll-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error while fetching: {error.message}</p>}

        <div className="flex flex-nowrap space-x-4">
          {filter === "bestSellers" ? (
            brandsData.map((brand) => (
              <div
                key={brand.name}
                className="relative w-[340px] h-[340px] mx-2 mb-6 hover:text-white"
              >
                <div className="absolute w-full flex justify-center items-center top-4">
                  <p className="logo font-semibold z-50">{brand.name}</p>
                </div>
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => navigate(brand.to)}
                  className="absolute inset-0 flex items-center justify-center
                             bg-gray-800 text-white opacity-0 hover:opacity-80 transition-opacity duration-200"
                >
                  Explore →
                </button>
              </div>
            ))
          ) :
            (Array.isArray(products) ? products : []).map((elem) => (
            <HorSlider
              product={elem}
              key={elem._id || elem.id} // fallback if _id is missing
              className="inline-block"
              home={true}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopBy;
