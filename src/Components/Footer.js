import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links">
            <li><a href="https://github.com/AndyFCui"><i className="fa fa-github"></i></a></li>
            <li><a href="https://www.linkedin.com/in/andyfcui/"><i className="fa fa-linkedin"></i></a></li>
            <li><a href="https://northeastern-csm.symplicity.com/profiles/xiangyu.cui"><i className="fa fa-nuwork"></i></a></li>
          </ul>
          <ul className="copyright">
            <li>&copy; 2025 Andy Cui. All rights reserved.</li>
            <li>Hosted on <a href="https://www.digitalocean.com/" target="_blank" rel="noopener noreferrer">DigitalOcean</a></li>
            <li>Source code on <a href="https://github.com/AndyFCui/PersonalBlog" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
        <div id="go-top">
          <a className="smoothscroll" title="Back to Top" href="#home">
            <i className="fa fa-chevron-up"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
