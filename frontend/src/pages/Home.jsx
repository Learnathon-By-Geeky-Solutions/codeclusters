// eslint-disable-next-line no-unused-vars
import React from "react";
import Banner from "../components/Banner";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";
import Category from "../components/Category";

const Home = () => {
  return (
    <div>
      <Banner />
      <Category />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetter />
    </div>
  );
};

export default Home;
