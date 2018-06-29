import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketballBall, faStopwatch, faBan } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <FontAwesomeIcon className="App-logo" icon={faBasketballBall} size="4x" color="orange" />
          <h1 className="App-title">Hello, I'm Conner</h1>
        </header>
        <p className="App-intro">
          <FontAwesomeIcon icon={faBan} size="2x" color="whitesmoke" />
          This is the very beginning of my personal site, more is soon to come!
          <FontAwesomeIcon icon={faStopwatch} size="2x" color="goldenrod" />
        </p>
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
    );
  }
}

export default App;
