//import React
import './App.css';
import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

//Import components
import MovieArea from './components/MovieArea'
import NavBar from './components/NavBar'
import JumBoTron from './components/JumBoTron'
import Footer from './components/Footer'
import Spinner from './components/Spinner'

//Object to convert from keys of MovieArea to it formatted title
const cards = {
  'upcoming': 'Upcoming', 'popular': 'Popular', 'now_playing': 'Now Playing',
  'top_rated': 'Top rated', 'trending': 'Trending', 'genre': 'Genre', 'action': 'Action', 
  'adventure': 'Adventure', 'animation': 'Animation', 'comedy': 'Comedy', 'crime': 'Crime', 
  'documentary': 'Documentary', 'drama': 'Drama', 'family': 'Family', 'fantasy': 'Science Fiction and Fantasy', 'history': 'History', 'horror': 'Horror', 'mystery': 'Mystery', 'romance': 'Romance', 
  'thriller': 'Thriller', 'war': 'War', 'music': 'Music', 'western': 'Western', 'search': "Search for you"
}

//Object App (parent)
export default class App extends Component {
  constructor() {
    /**
   * Constructor to initialize object App
   * Attributes:
   *  1. search (object): Store the fetched data
   *  2. countDown (int): count the number pages that have been fetched
   *  3. dummy (null): to prevent null error when fetching
   *  4. tempMovieList (object): a temporary copy of state - updated constantly if users do search
   *  5. functionality (string): indicate which action user has just done
   */
    super()
    this.state = {
      search: null,
      countDown: 25,
      dummy: null,
      tempMovieList: null,
      functionality: null,
    }
  }

  /**
   * Function to fetch movies based on endpoints and sub-endpoints from Movie DB API
   * Parameters:
   *  #endpoint (default to movie)
   *  #sub_endpoint (defaultto upcoming)
   *  #page (defaul to 1)
   *  #keyword (default to 3417)
   */
  async fetchMovie(endpoint = 'movie', sub_endpoint = 'upcoming', page = 1, keyword = 3417, input = null) {
    //API KEY from Environment settings
    let apiKey = process.env.REACT_APP_APIKEY

    //Variables to construct customized url
    let domain = ''
    let url = ''
    let language = 'en-US'
    let sortBy = 'popularity.desc'
    let include_adult = false
    let include_video = false

    //Construct urls based on ednpoints. Endpoints include movie, search, genre, trending
    switch (endpoint) {
      case 'movie':
        domain = `https://api.themoviedb.org/3/${endpoint}/${sub_endpoint}?`
        url = `${domain}api_key=${apiKey}&language=${language}&sort_by=${sortBy}&include_adult=${include_adult}&include_video=${include_video}&page=${page}`
        break
      case 'search':
        domain = `https://api.themoviedb.org/3/${endpoint}/${sub_endpoint}?`
        input = input !== null ? input : keyword
        url = `${domain}api_key=${apiKey}&language=${language}&include_adult=${include_adult}&query=${input}&page=${page}`
        break
      case 'genre':
        domain = `https://api.themoviedb.org/3/${endpoint}/movie/list?`
        url = `${domain}api_key=${apiKey}&language=${language}`
        break
      case 'trending':
        domain = `https://api.themoviedb.org/3/${endpoint}/movie/day?`
        url = `${domain}api_key=${apiKey}`
        break
      default:
        break
    }

    //Try-catch to handle Exception when failed to fetch from API
    try {
      //Fetch and format the data to json
      let response = await fetch(url)
      let data = await response.json()

      //Updated the state attribute of App object by calling setState() -> Add more key-value pairs to state as //we fetch different datasets from API
      //By default, we manage to fetch 25 different datasets from API, so decrement countDown as we fetch more
      if (endpoint === 'movie') {
        this.setState({ ...this.state, [sub_endpoint]: data, countDown: this.state.countDown - 1 })
      } else if (endpoint === 'genre') {
        this.setState({ ...this.state, [endpoint]: data, countDown: this.state.countDown - 1 })
      } else if (endpoint === 'trending') {
        this.setState({ ...this.state, [endpoint]: data, countDown: this.state.countDown - 1 })
      } else if (endpoint === 'search') {
        this.setState({ ...this.state, [keyword.toLowerCase()]: data, countDown: this.state.countDown - 1 })
      }
    } catch (err) {
      alert(JSON.stringify(err))
    }
  }

  /**
   * After render(), fetch the API by calling fetchMovie(). Here we will fetch data based on arguments passed to the function
   */
  componentDidMount() {
    //Fetch different datasets based on sub-endpoints with endpoint 'movie'
    this.fetchMovie('movie', 'upcoming', 1)
    this.fetchMovie('movie', 'now_playing', 1)
    this.fetchMovie('movie', 'popular', 1)
    this.fetchMovie('movie', 'top_rated', 1)

    //Fetch a dataset based on endpoint 'trending'
    this.fetchMovie('trending')

    //Fetch different datasets based on all movie categories with endpoint 'genre'
    //First, we get the genre and then fetch data based on that genre
    this.fetchMovie('genre').then(() => {
      //We will only continue process if genre is added to state attribute of App object
      if (this.state.genre !== null) {
        //Get the genres
        let categories = this.state.genre.genres

        //Iterate over a list of genres and fetch 
        categories.forEach((category) => {
          this.fetchMovie('search', 'movie', 1, category['name'])
        })
      }
    })

    //Fetch a default dataset for Search MovieArea
    this.fetchMovie('search', 'movie', 1, 'search', 'boruto')
  }

  /**
   * Function to display MovieAreas
   * #return an array of MovieArea object
   */
  renderMovies() {
    //Set the variables to store movies
    let Movies = null

    //Check if we are going to take tempMovieList or state
    if (this.state.functionality === null) Movies = this.state
    else if (this.state.functionality === 'search') Movies = this.state.tempMovieList
    else Movies = this.state

    return Object.keys(Movies).map((key) => {
      //We will only display certain MovieArea objects. If a MovieCard has the below keys won't be displayed
      if (['dummy', 'genre', 'countDown', 'science fiction', 'tv movie', 'tempMovieList', 'functionality'].includes(key)) return ''

      //Return any MovieArea whose key does not exist in above blacklist
      return <MovieArea parent={this} mykey={`${key}`} key={`${cards[key]}`} type={`${cards[key]}`} movieList={Movies[key]} genre={this.state.genre}></MovieArea>
    })
  }

  /**
   * Function to make a deep copy of an object
   * @param {object} inObject 
   */
  deepCopy(inObject) {
    let outObject, value, key

    if (typeof inObject !== "object" || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}

    for (key in inObject) {
      value = inObject[key]

      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = this.deepCopy(value)
    }

    return outObject
  }

  /**
   * Function to update the current content based on real-time input value
   * #Make constant fetch to API whenever user enter something into the text bar
   * #Parameter:
   *  1. e: input from Input tag
   */
  searchMovie(e) {
    //Make a deep copy of current state object
    let objStore = this.deepCopy(this.state)

    // console.log(e)

    //Filter the movies that contain input and update them to objStore
    for (let key in objStore) {
      if (['countDown', 'dummy', 'tempMovieList', 'genre', 'search', 'functionality'].includes(key)) continue
      objStore[key]['results'] = objStore[key]['results'].filter((movie) => movie.overview.includes(e))
    }

    // console.log(objStore)

    //Update tempMovieList and functionality to search in real-time
    this.setState({ ...this.state, tempMovieList: objStore, functionality: 'search' })
  }

  /**
   * Function to show the 'Search for you' MovieArea whenever user clicks Search button
   * #This new MovieArea will be displayed permanently once the user clicked search
   */
  ClickBtn() {
    //Get the input
    let input = document.getElementById('dn-search-input').value

    //Alert users if they enter empty string
    if (input === '') {
      alert("You have to enter something :)")
      return
    }

    //Fetch the data (add it to state of App)
    this.fetchMovie('search', 'movie', 1, 'search', input)

    //Update functionality to indicate that user did load more
    this.setState({ ...this.state, functionality: 'load-more' })
  }

  /**
   * Function to render the page after componentWillMount() or setState() event
   */
  render() {
    //Keep spinning until finish render the page for first time
    if (this.state.countDown > 0) {
      return <Spinner></Spinner>
    }

    //Return the page
    return (
      <div className='App'>
        <NavBar parent={this} searchMovie={this.searchMovie.bind(this)} ClickBtn={this.ClickBtn.bind(this)}></NavBar>
        <JumBoTron movieList={this.state.trending} genre={this.state.genre}></JumBoTron>
        {/* <RangeSlider parent={this}></RangeSlider> */}
        <div className='movie-container'>{this.renderMovies()}</div>
        <Footer></Footer>
      </div >
    )
  }
}