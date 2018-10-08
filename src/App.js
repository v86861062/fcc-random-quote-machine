import React, { Component } from 'react';
import './App.css';
import { CSSTransition } from 'react-transition-group';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab, faTwitter } from '@fortawesome/free-brands-svg-icons'

library.add(fab, faTwitter)

var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
              '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
              '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
              '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
              '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
              '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
              '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
              '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
              '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
              '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      showQuote: false,
      quotesData: [],
      quote: '',
      quoteChinese: '',
      author: '',
      color: '#ffe4c4'
    }
  }

  getRandomArrayItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  getRandomQuote = () => {
    let quotes = this.state.quotesData.quotes
    return this.getRandomArrayItem(quotes)
  }

  getRandomColor = () => {
    return this.getRandomArrayItem(colors)
  }

  handleClick = (e) => {    
    this.setState(state => ({
      showQuote: false,
      color: this.getRandomColor()
    }))
  }

  changeQuote = (e) => {
    let randomQuote = this.getRandomQuote()
    this.setState(state => ({
      quote: randomQuote.quote,
      quoteChinese: randomQuote.quote_zh_tw,
      author: randomQuote.author,
      showQuote: true
    }))
  }

  componentDidMount() {
    let nowUrl = window.location.href
    fetch(nowUrl + "/quotes.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            quotesData: result
          });
          this.changeQuote()
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
      const { error, isLoaded, showQuote,
              quote, quoteChinese, author} = this.state

      const stylesObj = {
        background: this.state.color
      };

      if (error) {
        return <div id="error">Error: {error.message}</div>
      } else if (!isLoaded) {
        return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      } else {
        let tweetShareURL = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
                        encodeURIComponent(quote + author)
        return (
          <div className="container" style={stylesObj}>
            <div  id="quote-box">
              <CSSTransition
                in={showQuote}
                timeout={500}
                classNames="quote"
                onExited={() => {
                  this.changeQuote()
                }}> 
                  {state => (
                    <div>
                      <div id="text">{quote}</div>
                      <div id="text-chinese">{quoteChinese}</div>
                      <div id="author">-{author}</div>
                    </div>
                  )}
                </CSSTransition>

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
