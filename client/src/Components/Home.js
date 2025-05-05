import SharePost from "./SharePost";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./Homepage";

const Home = () => {
  const user = useSelector((state) => state.users.user);
  const email = user?.email || null; // Add null check for user
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  return (
    <>
      {email === "user1@example.com" && <SharePost />}
      <Homepage />
    </>
  );
};

export default Home;
