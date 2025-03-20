import React, { Component } from 'react';

class About extends Component {
  componentDidMount() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  render() {
    if(this.props.data){
      var name = this.props.data.name;
      var profilepic= "images/"+this.props.data.image;
      var bio = this.props.data.bio;
      var intro = this.props.data.intro;
      var street = this.props.data.address.street;
      var city = this.props.data.address.city;
      var state = this.props.data.address.state;
      var zip = this.props.data.address.zip;
      var phone= this.props.data.phone;
      var email = this.props.data.email;
      var resumeDownload = this.props.data.resumedownload;
      var nameUnderImage = this.props.data.nameUnderImage;
      var skills = this.props.data.skills.map(skill=>
        <li>{skill}</li>
      );
    }

    return (
      <section id="about">
        <div className="row">
          <div className="three columns">
            <div className="profile-pic-container">
              <img className="profile-pic" src={profilepic} alt="Andy Cui Profile Pic" />
            </div>
            <h2 className="profile-name">{nameUnderImage}</h2>
            <div className="contact-details">
              <div className="address">
                <span>
                  <div className="label-row">
                    <i className="fa fa-user"></i>
                    <strong>Name:</strong>
                  </div>
                  <div className="contact-text">Andy (Xiang-Yu) Cui</div>
                </span>
                <span>
                  <div className="label-row">
                    <i className="fa fa-map-marker"></i>
                    <strong>Current Address:</strong>
                  </div>
                  <div className="contact-text">Boston MA</div>
                </span>
                <span>
                  <div className="label-row">
                    <i className="fa fa-phone"></i>
                    <strong>Phone:</strong>
                  </div>
                  <div className="contact-text">(402)-853-3000</div>
                </span>
                <span>
                  <div className="label-row">
                    <i className="fa fa-envelope"></i>
                    <strong>Email:</strong>
                  </div>
                  <div className="contact-text">xiangyucui@outlook.com</div>
                </span>
              </div>
            </div>
          </div>
          <div className="nine columns main-col">
            <h2 className="about-me">About Me</h2>
            <p>{intro}</p>
            <p>{bio}</p>
            <p>{skills}</p>
            <div className="row">
              <div className="columns download">
                <p>
                  <a href={resumeDownload} className="button" download target="_blank">
                    <i className="fa fa-download"></i>Download Resume
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default About;
