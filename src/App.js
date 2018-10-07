import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab, faTwitter } from '@fortawesome/free-brands-svg-icons'

library.add(fab, faTwitter)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      quotesData: [],
      currentQuote: '',
      currentQuoteChinese: '',
      currentAuthor: ''
    }
  }

  getRandomQuote = () => {
    let quotes = this.state.quotesData.quotes
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  handleClick = (e) => {
    let randomQuote = this.getRandomQuote()
    this.setState(state => ({
      currentQuote: randomQuote.quote,
      currentQuoteChinese: randomQuote.quote_zh_tw,
      currentAuthor: randomQuote.author
    }))
  }

  componentDidMount() {
    fetch("/quotes.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            quotesData: result
          });
          this.handleClick()
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
      const { error, isLoaded, currentQuote, currentQuoteChinese, currentAuthor} = this.state

      if (error) {
        return <div id="error">Error: {error.message}</div>
      } else if (!isLoaded) {
        return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      } else {
        let tweetShareURL = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
                        encodeURIComponent(currentQuote + currentAuthor)
        return (
          <div className="App">
            <div id="quote-box">
              <div id="text">{currentQuote}</div>
              <div id="text-chinese">{currentQuoteChinese}</div>
              <div id="author">-{currentAuthor}</div>
              <button id="new-quote" onClick={this.handleClick}>new quote</button>
              <a id="tweet-quote" href={tweetShareURL}>
                <FontAwesomeIcon icon={['fab', 'twitter']} />
              </a>            
            </div>
          </div>
        )
      }
  }
}

export default App;
