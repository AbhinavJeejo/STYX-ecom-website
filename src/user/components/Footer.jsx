import '../../styles/userstyles/Footer.css'

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand-section">
          <h2 className="footer-logo">STYX</h2>
          <p className="footer-description">
            Elevating your stride with premium footwear since 1999. Quality, comfort, and style in every step.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h3>Shop</h3>
            <ul>
              <li>Casuals</li>
              <li>Sports</li>
              <li>Formals</li>
              <li>New Arrivals</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li>Track Order</li>
              <li>Return Policy</li>
              <li>Size Guide</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Store Locator</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 STYX Footwear. All rights reserved.</p>
        <div className="footer-socials">
          <span>Instagram</span>
          <span>Twitter</span>
          <span>Facebook</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;