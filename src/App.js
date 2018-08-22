import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketballBall, faStopwatch, faBan } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import data from './data';
import avatar from './1.jpg';
import resume from './Resume.pdf';
import './App.css';

const ExperienceCard = (props) => (
  <div>
    <h4>
      <div>
        <a href={props.website}>{props.company}</a>
        <span>{props.start} - {props.end}</span>
      </div>
      <span>{props.title}</span>
      <div>{props.stack.map(item => <div>{item}</div>)}</div>
    </h4>
  </div>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="spacer headerContent">
            <a href="/" className="headerMainLink">Conner Jevning</a>
            <div className="headerLinks">
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#projects">Projects</a>
              <a href="#connect">Connect</a>
            </div>
          </div>
        </header>
        <div>
          <FontAwesomeIcon className="App-logo" icon={faBasketballBall} size="4x" color="orange" />
          <h1 className="App-title">Hello, I'm Conner</h1>
          <img src={avatar} />
        </div>
        <div id="about">
          <h3>About</h3>
          <p>I'm currently seeking a Senior Software Engineer role with high impact and the chance to build some awesome tools.</p>
          <p>As a software engineer, I love to blend my background in Human-computer interaction and passion for efficiency with my lifelong love of building, creating, and fixing things to create strong, intuitive, and lasting products that people love.</p>
          <p>When I'm not in front of a computer screen, I'm probably gaming, golfing, surfing music sites, or watching basketball.</p>
        </div>
        <div id="experience">
          <h3>Experience</h3>
          {data.experience.map((exp) => <ExperienceCard {...exp} />)}
          <a href={resume}>View Resume</a>
        </div>
        <div id="projects">
          <h3>Projects</h3>
          {data.projects.map((proj) => <div><a href={proj.link}>{proj.title}</a><p>{proj.desc}</p><div>{proj.stack.map(item => <div>{item}</div>)}</div></div>)}
        </div>
        <div id="connect">
          <h3>Connect</h3>
          <div className="Social-container">
            <a href="https://linkedin.com/in/cjevning">
              <FontAwesomeIcon icon={faLinkedin} size="2x" color="whitesmoke" />
            </a>
            <a href="https://twitter.com/cjevning">
              <FontAwesomeIcon icon={faTwitter} size="2x" color="whitesmoke" />
            </a>
            <a href="https://github.com/cjevning">
              <FontAwesomeIcon icon={faGithub} size="2x" color="whitesmoke" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
