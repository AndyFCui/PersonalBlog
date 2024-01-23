import React, { Component } from 'react';


class Resume extends Component {

  
  render() {

    if(this.props.data){
      var education = this.props.data.education.map(function(education){
        return <div key={education.school}>  <h3>{education.school}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img className="company-pic"  src={"images/"+education.image} alt="" /></h3>
        <p className="info">{education.degree} <span>&bull;</span><em className="date">{education.graduated}</em></p>
        <h6>{education.description}</h6><p>{education.Coursework}</p> {<p><b>{education.awards} </b>{education.honor}</p>}</div>
      })
      var work = this.props.data.work.map(function(work){
        return <div key={work.company}><h3>{work.company}  ⠀⠀<img className="company-pic"  src={"images/"+work.image} alt="" />  ⠀⠀ </h3>
           
            <p className="info">{work.title}<span>&bull;</span> <em className="date">{work.years}</em></p>
            {work.description.map(item=>(
              <div><li>{item}</li></div>
            ))}
            {/* <p>{work.descriptionItem}</p> */}
        </div>
      })
      
    }

    return (
      <section id="resume">


      <div className="row education">
         <div className="three columns header-col">
            <h1><span>Education</span></h1>
         </div>

         <div className="ten columns main-col">
            <div className="row item">
               <div className="twelve columns">
                 {education}
               </div>
            </div>
         </div>
      </div>


      {/* <div className="row skill">

         <div className="three columns header-col">
            <h1><span>Skills</span></h1>
         </div>

         <div className="ten columns main-col">

				<div className="bars">
				   <ul className="skills">
					  {skills}
					</ul>
				</div>
			</div>
      </div> */}
   </section>
    );
  }
}

export default Resume;
