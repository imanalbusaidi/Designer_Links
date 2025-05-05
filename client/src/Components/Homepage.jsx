import React from "react";
import bg from "../Images/laptop.png";
import one from "../Images/1.png";
import two from "../Images/2.png";
import three from "../Images/3.png";
import img from "../Images/graphic-designer.png";

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <img src={bg} alt="Artwork" className="hero-image" />
        <div className="hero-text">
          <h1>DesignerLink</h1>
          <p className="subtitle">
            Where exceptional creativity finds its audience!
          </p>
          <p className="description">
            A platform for professional designers to showcase unique talents, and for clients to discover and collaborate with creative minds.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How DesignerLink Works</h2>
        <div className="steps">
          <div className="step">
            <img src={one} alt="Browse Designers" />
            <h3>Step 1</h3>
            <p>Browse a curated catalog of designers by categories like 3D, Graphic Design, Illustration, and more.</p>
          </div>
          <div className="step">
            <img src={two} alt="View Portfolios" />
            <h3>Step 2</h3>
            <p>Explore designer portfolios, admire creative projects, and get inspired by amazing work.</p>
          </div>
          <div className="step">
            <img src={three} alt="Connect" />
            <h3>Step 3</h3>
            <p>Connect, interact, start building meaningful creative connections.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Explore by Categories</h2>
        <div className="category-badges">
          <a href="/categories/graphic-design" className="category-badge graphic-design">Graphic Design</a>
          <a href="/categories/3d-design" className="category-badge three-d-design">3D Design</a>
          <a href="/categories/illustration" className="category-badge illustration">Illustration</a>
          <a href="/categories/ui-ux" className="category-badge ui-ux">UI/UX</a>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <img src={img} alt="Platform for Creatives" className="about-image" />
        <div className="about-text">
          <h3>A Platform Built for Creatives and Visionaries</h3>
          <p>
            At DesignerLink, creativity is celebrated. We bring together professional designers and clients — a space where portfolios shine, ideas come alive, and collaborations begin.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
