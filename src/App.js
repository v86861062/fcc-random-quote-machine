import React, { Component } from "react"
import "./App.css"
import { CSSTransition } from "react-transition-group"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { fab, faTwitter } from "@fortawesome/free-brands-svg-icons"
import colors from "./colors"

library.add(fab, faTwitter)
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      showQuote: false,
      quotesData: [],
      quote: "",
      quoteChinese: "",
      author: "",
      color: "#ffe4c4"
    }
  }

  getRandomArrayItem = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  getRandomQuote = () => {
    let quotes = this.state.quotesData.quotes
    return this.getRandomArrayItem(quotes)
  }

  getRandomColor = () => {
    return this.getRandomArrayItem(colors)
  }

  handleClick = () => {
    this.setState({
      showQuote: false,
      color: this.getRandomColor()
    })
  }

  changeQuote = () => {
    let randomQuote = this.getRandomQuote()
    this.setState({
      quote: randomQuote.quote,
      quoteChinese: randomQuote.quote_zh_tw,
      author: randomQuote.author,
      showQuote: true
    })
  }

  componentDidMount() {
    let nowUrl = window.location.href
    fetch(nowUrl + "/quotes.json")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            quotesData: result
          })
          this.changeQuote()
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  render() {
    const {
      error,
      isLoaded,
      showQuote,
      quote,
      quoteChinese,
      author
    } = this.state

    const stylesObj = {
      background: this.state.color
    }

    if (error) {
      return <div id="error">Error: {error.message}</div>
    } else if (!isLoaded) {
      return (
        /* 讀取圈圈效果 */
        <div className="lds-ring">
          <div />
          <div />
          <div />
          <div />
        </div>
      )
    } else {
      let tweetShareURL =
        "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
        encodeURIComponent(quote + author)

      return (
        <div className="container" style={stylesObj}>
          <div id="quote-box">
            <CSSTransition
              in={showQuote}
              timeout={500}
              classNames="quote"
              onExited={() => {
                this.changeQuote()
              }}
            >
              <div>
                <div id="text">{quote}</div>
                <div id="text-chinese">{quoteChinese}</div>
                <div id="author">-{author}</div>
              </div>
            </CSSTransition>

            <button id="new-quote" onClick={this.handleClick}>
              new quote
            </button>

            <a id="tweet-quote" href={tweetShareURL}>
              <FontAwesomeIcon icon={["fab", "twitter"]} />
            </a>
          </div>
        </div>
      )
    }
  }
}

export default App
