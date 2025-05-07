const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">DesignerLink <span>Platform</span></div>
        <div className="footer-slogan">
          Empowering Creativity. Connecting Visionaries.<br />
          <span style={{fontWeight:600, color:'#ffd54f'}}>Where Designers & Clients Meet.</span>
        </div>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="mailto:support@designerlink.com">Contact Support</a>
        </div>
        <div className="footer-socials">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div className="footer-credits">
          &copy; {new Date().getFullYear()} DesignerLink. Crafted with passion for the creative community.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
