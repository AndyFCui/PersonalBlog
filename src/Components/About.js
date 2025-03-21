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
      var role = this.props.data.intro.role;
      var company = this.props.data.intro.company;
      var street = this.props.data.address.street;
      var city = this.props.data.address.city;
      var state = this.props.data.address.state;
      var zip = this.props.data.address.zip;
      var phone= this.props.data.phone;
      var email = this.props.data.email;
      var resumeDownload = this.props.data.resumedownload;
      var nameUnderImage = this.props.data.nameUnderImage;
      var skills = this.props.data.skills;
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
                  <div className="contact-text">{name}</div>
                </span>
                <span>
                  <div className="label-row">
                    <i className="fa fa-map-marker"></i>
                    <strong>Current Address:</strong>
                  </div>
                  <div className="contact-text">{city} {state}</div>
                </span>
                <span>
                  <div className="label-row">
                    <i className="fa fa-phone"></i>
                    <strong>Phone:</strong>
                  </div>
                  <div className="contact-text">{phone}</div>
                </span>
                <span>
                  <div className="label-row">
                    <i className="fa fa-envelope"></i>
                    <strong>Email:</strong>
                  </div>
                  <div className="contact-text">{email}</div>
                </span>
              </div>
            </div>
          </div>
          <div className="nine columns main-col">
            <h2 className="about-me">About Me</h2>
            <p className="role-company">
              <span className="role">
                <i className="fa fa-briefcase"></i> {role}
              </span>
              <span className="spacer"> </span>
              <span className="company">
                <i className="fa fa-building-o"></i> {company}
              </span>
            </p>

            <p className="bio-text">{bio}</p>

            <div className="tech-stack-container">
               <div className="animations-container">
                  <div className="loader-wrapper">
                     <div className="packman"></div>
                     <div className="dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                     </div>
                  </div>
                  <div id="ghost" className="ghost-left">
                     <div id="red">
                        <div id="eye"><div id="pupil"></div></div>
                        <div id="eye1"><div id="pupil1"></div></div>
                        <div id="shadow"></div>
                        <div id="top0"></div>
                        <div id="top1"></div>
                        <div id="top2"></div>
                        <div id="top3"></div>
                        <div id="top4"></div>
                        <div id="st0"></div>
                        <div id="st1"></div>
                        <div id="st2"></div>
                        <div id="st3"></div>
                        <div id="st4"></div>
                        <div id="st5"></div>
                        <div id="an1"></div>
                        <div id="an2"></div>
                        <div id="an3"></div>
                        <div id="an4"></div>
                        <div id="an6"></div>
                        <div id="an7"></div>
                        <div id="an8"></div>
                        <div id="an9"></div>
                        <div id="an10"></div>
                        <div id="an11"></div>
                        <div id="an12"></div>
                        <div id="an13"></div>
                        <div id="an15"></div>
                        <div id="an16"></div>
                        <div id="an17"></div>
                        <div id="an18"></div>
                     </div>
                  </div>
               </div>
               <div className="tech-stack">
                  {skills && skills.map((category) => (
                    category.items.map((item, index) => (
                      <div key={index} className="tech-item" style={{"--animation-order": index}}>
                        <div className="tech-item-content">
                          <img src={item.image} alt={item.name} title={item.name} />
                          <span className="tech-name">{item.name}</span>
                        </div>
                      </div>
                    ))
                  ))}
               </div>
            </div>

            <div className="download">
               <a href={resumeDownload} className="download-button">
                  <i className="fa fa-download"></i>DOWNLOAD RESUME
               </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default About;
