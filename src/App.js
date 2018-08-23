import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketballBall, faStopwatch, faBan, faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import data from './data';
import avatar from './1.jpg';
import resume from './Resume.pdf';
import './App.css';

const ExperienceCard = (props) => (
  <div className="experienceItem">
    <div style={{ display: 'flex' }}>
      <a className="link" href={props.website}>{props.company}</a>
      <span style={{ flexGrow: 1, textAlign: 'right' }}>{props.start} - {props.end}</span>
    </div>
    <div style={{ textAlign: 'left' }}>{props.title}</div>
    <div style={{ display: 'flex', marginTop: '1em', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      {props.stack.map(item =>
        <div className="stackItem">{item}</div>
      )}
    </div>
  </div>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="spacer headerContent">
            <a href="/" className="headerMainLink">C<span>onner </span>J<span>evning</span></a>
            <div className="headerLinks">
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#projects">Projects</a>
              <a href="#connect">Connect</a>
            </div>
          </div>
        </header>
        <div className="content">
          <div className="section">
            <div className="avatarContainer"><img className="avatar" src={avatar} /></div>
            <h1 className="App-title">Hello world, I'm Conner</h1>
          </div>
          <div className="section" id="about">
            <h3>About Me</h3>
            <p>I'm a full-stack developer with 4+ years of experience currently seeking a Senior Software or Founding Engineer role in the Bay Area. My main expertise is in scalable frontend development using React, which I've previously done for both large organizations as well as fledgling startups.</p>
            <p>As a software engineer, I blend my background in human-computer interaction and passion for efficiency with my lifelong zeal for building, creating, and fixing things. I love being able to create strong, intuitive, and lasting products that people can intuitively connect with. I'm mainly interested in a senior development role where I can use my skills to help guide a team while contining to build experience in project management and product architecture.</p>
            <p>When I'm not coding, you'll most likely find me gaming, golfing, surfing music sites, watching basketball, or tinkering away on a project.</p>
          </div>
          <div className="section" id="experience">
            <h3>Prior Experience</h3>
            {data.experience.map((exp) => <ExperienceCard {...exp} />)}
            <div className="resume">
              <a className="link" href={resume} style={{ margin: '2em auto' }}>View Resume <FontAwesomeIcon icon={faArrowRight} /></a>
            </div>
          </div>
          <div className="section" id="projects">
            <h3>Side Projects</h3>
            {data.projects.map((proj) =>
              <div style={{ width: '100%' }}>
                <div className="projectHeader">
                  <a className="link" href={proj.link}>{proj.title} <FontAwesomeIcon icon={faArrowRight} /></a>
                  <div className="projectStack">{proj.stack.map(item => <div className="stackItem">{item}</div>)}</div>
                </div>
                <p style={{ textAlign: 'left' }}>{proj.desc}</p>
              </div>
            )}
          </div>
          <div className="section" id="connect">
            <h3>Connect</h3>
            <div className="Social-container">
              <a href="https://linkedin.com/in/cjevning">
                <FontAwesomeIcon icon={faLinkedin} size="2x" className="socialIcon" />
              </a>
              <a href="https://twitter.com/cjevning">
                <FontAwesomeIcon icon={faTwitter} size="2x" className="socialIcon" />
              </a>
              <a href="https://github.com/cjevning">
                <FontAwesomeIcon icon={faGithub} size="2x" className="socialIcon" />
              </a>
              <a href="mailto:cjevning@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} size="2x" className="socialIcon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
