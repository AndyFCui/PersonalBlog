import React, { Component } from 'react';

class Portfolio extends Component {
  render() {

    if(this.props.data){

      var projects = this.props.data.projects.map(function(projects){
        var projectImage = 'images/portfolio/'+projects.image;
        return <div key={projects.title} className="columns portfolio-item">
           <div className="item-wrap">
            <a href={projects.url} target="_blank" title={projects.title}>
               <img alt={projects.title} src={projectImage} />
               <h3 className = "title">{projects.title}</h3>
              <div className="link-icon"><i className="fa fa-link"></i></div>
            </a>
            <div className>
                  <div className="portfolio-item-meta">
                 
                     <h6>{projects.category}</h6>
                     
                     {projects.description.map(item=>(
                       <div><li>{item}</li></div>
                     ))}
                  </div>
                </div>
          </div>
        </div>
      })
    }

    return (
      <section id="portfolio">

      <div className="row">

         <div className="twelve columns collapsed">

            <h1>Check Out Some of My Works</h1>

            <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                {projects}
            </div>
          </div>
      </div>
   </section>
    );
  }
}

export default Portfolio;
