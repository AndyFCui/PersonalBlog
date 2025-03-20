import React, { Component } from 'react';

class Portfolio extends Component {
  render() {
    if(this.props.data){
      var projects = this.props.data.projects.map(function(projects){
        var projectImage = 'images/portfolio/'+projects.image;
        return <div key={projects.title} className="portfolio-card">
           <div className="portfolio-image">
             <img src={projectImage} alt={projects.title} />
           </div>
           <div className="portfolio-content">
             <h3 className="portfolio-title">{projects.title}</h3>
             <p className="portfolio-category">{projects.category}</p>
             <div className="portfolio-description">
               {projects.description.map((item, index) => (
                 <div key={index} className="description-item">
                   <span className="bullet">•</span>
                   <span>{item}</span>
                 </div>
               ))}
             </div>
             {projects.url && (
               <a href={projects.url} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                 <i className="fa fa-link"></i> View Project
               </a>
             )}
           </div>
        </div>
      })
    }

    return (
      <section id="portfolio">
        <div className="row">
          <div className="three columns header-col">
            <h1><span>Projects</span><div className="third-line"></div></h1>
          </div>

          <div className="ten columns main-col">
            <div className="portfolio-grid">
              {projects}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Portfolio;
