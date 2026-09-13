import React from 'react';
// import './Footer.css'; // Import the CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>
            We provide the latest anime recommendations and updates to keep you entertained. Explore, watch, and enjoy your favorite anime with us.
          </p>
        </div>
 
        {/* Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            {/* <li><a href="/faq">FAQ</a></li> */}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><i className="fas fa-envelope"></i> support@example.com</p>
          {/* <p><i className="fas fa-phone"></i> +1 (555) 000-0000</p> */}
          <p><i className="fas fa-map-marker-alt"></i> City, Country</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 NexAnime All rights reserved.</p>
        <p>
          Follow us:
          <a href="#" target="_blank" rel="noreferrer">Facebook</a> |
          <a href="#" target="_blank" rel="noreferrer">Twitter</a> |
          <a href="#" target="_blank" rel="noreferrer">Instagram</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
