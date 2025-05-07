import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Toast, ToastBody, ToastHeader } from "reactstrap";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Register from "./Components/Register";
import { useSelector } from "react-redux";
import Homepage from "./Components/Homepage";
import GraphicDesign from "./Components/Categories/GraphicDesign";
import ThreeDDesign from "./Components/Categories/ThreeDDesign";
import Illustration from "./Components/Categories/Illustration";
import UIUX from "./Components/Categories/UIUX";
import Contact from "./Components/Contact";
import AdminPage from "./Components/AdminPage";
import ChatWidget from "./Components/ChatWidget";

const App = () => {
  const user = useSelector((state) => state.users.user);
  const email = user?.email || null; // Add null check for email
  const [showCongrats, setShowCongrats] = useState(false);
  const prevUserType = useRef();
  const [toast, setToast] = useState({ show: false, message: "", color: "success" });

  useEffect(() => {
    if (
      user &&
      prevUserType.current === "customer" &&
      user.userType === "designer" &&
      !localStorage.getItem("designerCongratsShown")
    ) {
      setToast({
        show: true,
        message:
          "🎉 Congratulations! Your request to become a designer has been accepted. Welcome to the DesignerLink creative community!",
        color: "success",
      });
      localStorage.setItem("designerCongratsShown", "true");
      setTimeout(() => setToast({ ...toast, show: false }), 7000);
    }
    if (user) prevUserType.current = user.userType;
  }, [user]);

  return (
    <Container fluid>
      <Header />
      <div style={{ position: "fixed", top: 30, right: 30, zIndex: 9999, minWidth: 350 }}>
        <Toast isOpen={toast.show} timeout={3000} fade={true} style={{ border: `2px solid #6a1b9a`, borderRadius: 16, boxShadow: "0 4px 16px rgba(106,27,154,0.18)" }}>
          <ToastHeader icon={toast.color}>DesignerLink</ToastHeader>
          <ToastBody style={{ color: "#6a1b9a", fontWeight: "bold", fontSize: 18 }}>{toast.message}</ToastBody>
        </Toast>
      </div>
      <Row className="main">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/categories/graphic-design" element={<GraphicDesign />} />
          <Route path="/categories/3d-design" element={<ThreeDDesign />} />
          <Route path="/categories/illustration" element={<Illustration />} />
          <Route path="/categories/ui-ux" element={<UIUX />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Row>
      <Footer />
      {/*<ChatWidget /> */}
    </Container>
  );
};

export default App;
