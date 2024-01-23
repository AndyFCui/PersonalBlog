import React, { Component } from 'react';


class Experience extends Component {

  
  render() {

    if(this.props.data){
      
      var work = this.props.data.work.map(function(work){
        return <div key={work.company}><h3>{work.company}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img className="company-pic"  src={"images/"+work.image} alt="" /></h3>
           
            <p className="info">{work.title}      <span>&bull;</span> <em className="date">{work.years}</em></p>
            {work.description.map(item=>(
              <div><li>{item}</li></div>
            ))}
            {/* <p>{work.descriptionItem}</p> */}
        </div>
      })

    }

    return (
      <section id="experience">

        <div className="row work">

          <div className="three columns header-col">
            <h1><span>Experience</span></h1>
          </div>

          <div className="ten columns main-col">
            {work}
 
          </div>
        </div>
        

   </section>
    );
  }
}

export default Experience;
