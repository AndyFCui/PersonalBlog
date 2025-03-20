import React, { Component } from 'react';

class Header extends Component {
   componentDidMount() {
      // Matrix text animation with proper text formatting and word spacing
      const text = "A 5 years Project Manager with software experience, 2 years Data Engineer and 1 year Full Stack Engineer. Full stack design Sale System by NodeJS.";
      const container = document.querySelector('.matrix-container');
      
      if (container) {
         // Split text into words first
         const words = text.split(' ');
         
         words.forEach((word, wordIndex) => {
            // Create a wrapper for each word
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'word-wrapper';
            container.appendChild(wordWrapper);
            
            // Add each character of the word
            word.split('').forEach((char, charIndex) => {
               const span = document.createElement('span');
               span.textContent = char;
               span.className = 'matrix-text';
               // Add glitch effect to some characters
               if (Math.random() > 0.9) {
                  span.classList.add('glitch');
               }
               // Slightly faster animation
               span.style.animationDelay = `${(wordIndex * word.length + charIndex) * 0.03}s`;
               wordWrapper.appendChild(span);
            });

            // Add space between words (except for the last word)
            if (wordIndex < words.length - 1) {
               const spaceSpan = document.createElement('span');
               spaceSpan.textContent = ' ';
               spaceSpan.className = 'matrix-text space';
               spaceSpan.style.animationDelay = `${(wordIndex * word.length + word.length) * 0.03}s`;
               container.appendChild(spaceSpan);
            }
         });
      }
   }

   render() {
      if(this.props.data){
         var social = this.props.data.social.map(function(network){
            return <li key={network.name}><a href={network.url}><i className={network.className}></i></a></li>
         });
      }

      return (
         <header id="home">
            <nav id="nav-wrap">
               <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
               <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>

               <ul id="nav" className="nav">
                  <li className="current"><a className="smoothscroll" href="#home">Home</a></li>
                  <li><a className="smoothscroll" href="#about">About</a></li>
                  <li><a className="smoothscroll" href="#experience">Experience</a></li>
                  <li><a className="smoothscroll" href="#resume">Education</a></li>
                  <li><a className="smoothscroll" href="#sk">Skills</a></li>
                  <li><a className="smoothscroll" href="#portfolio">Projects</a></li>
                  <li><a className="smoothscroll" href="#contact">Contact</a></li>
               </ul>
            </nav>

            <div className="row banner">
               <div className="banner-text">
                  <h1 className="responsive-headline">I'm Andy (Xiang-Yu) Cui.</h1>
                  <h3 className="matrix-container"></h3>
                  <hr />
                  <ul className="social">
                     {social}
                  </ul>
               </div>
            </div>

            <p className="scrolldown">
               <a className="smoothscroll" href="#about"><i className="icon-down-circle"></i></a>
            </p>
         </header>
      );
   }
}

export default Header;
