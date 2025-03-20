import React, { Component } from 'react';

class Skills extends Component {
  render() {
    if(this.props.data){
      var skills = this.props.data.skills.map(function(skills){
        return (
          <div key={skills.name} className="four columns skill-item">
            <div className="skill-header">
              <span className="skill-name">{skills.name}</span>
              <span className="skill-level">{skills.level}</span>
            </div>
            <div className="skill-bar">
              <div className="pacman">
                <div className="pacman-mouth"></div>
              </div>
              <div 
                className="skill-bar-fill" 
                style={{width: skills.level}}
              >
                <div className="dots"></div>
              </div>
            </div>
          </div>
        )
      })

      // 将技能分组为每行3个
      var rows = [];
      for(var i = 0; i < skills.length; i += 3) {
        rows.push(
          <div key={i} className="row skill-row">
            {skills.slice(i, i + 3)}
          </div>
        );
      }
    }

    return (
      <section id="sk">
        <div className="row skill">
          <div className="twelve columns header-col">
            <h1><span>Skills</span></h1>
          </div>
        </div>
        <div className="skills-container">
          {rows}
        </div>
      </section>
    );
  }
}

export default Skills;
