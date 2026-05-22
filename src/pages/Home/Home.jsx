import { useEffect } from "react";
import Banner from "./Banner";
import DailyMeals from "./DailyMeals";
import CustomerReviews from "./CustomerReviews";
import WhyChooseUs from "./WhyChooseUs";

const Home = () => {
  // Dynamic page title
  useEffect(() => {
    document.title = "LocalChefBazaar | Home";
  }, []);

  return (
    <div>
      <Banner />
      <DailyMeals />
      <CustomerReviews />
      <WhyChooseUs />
    </div>
  );
};

export default Home