import React, { Component } from 'react'
import { Carousel, Modal, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import { MDBMask, MDBView } from 'mdbreact'
import Moment from 'react-moment'
import ReactPlayer from 'react-player'
import Spinner from './Spinner'

export default class JumBoTron extends Component {
    /**
     * Constructor to initalize the Jumbotron object
     * @param {object} props 
     */
    constructor(props) {
        //Call superclass constructor
        super(props)

        //Attributes
        this.number = 10

        //Get a list of random trending movies
        this.movieList = this.getRandomMovies()
        this.ArrGenres = this.props.genre.genres

        //store the video links
        this.state = {
            countDown: this.movieList.length
        }
    }

    /**
     * Function to get 3 random number of movies from movie list
     */
    getRandomMovies() {
        let movieList = []
        let explored = []

        //Iterate over 3 times to find 3 movies
        for (let i = 0; i < this.number; i++) {
            let num = Math.floor(Math.random() * 20)

            //Only add movies if num does not exist in explored array
            while (!explored.includes(num)) {
                movieList.push(this.props.movieList.results[num])
                explored.push(num)
            }
        }
        return movieList
    }

    /**
     * Function to construct image path
     */
    setImgPath(filesize, filepath) {
        //In case we can't get the image path, use a default image
        if (filepath === null) {
            return 'https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'
        }

        //Otherwise, return created image path
        let base_url = 'https://image.tmdb.org/t/p'
        return `${base_url}/${filesize}/${filepath}`
    }

    /**
     * Get the genre list of a movie
     * @param {integer} genre_ids 
     */
    getGenre(genre_ids) {
        /**
         * Function to get genres from genre ids for each movie card
         */
        //Iteract over each genre id of a movie
        let genre = genre_ids.map((id) => {
            //For each genre id, find its corresponding genre name from a list of genres
            let name = this.ArrGenres.filter((item) => item.id === id)
            //If it can't find the genre name, set it to empty string
            return name[0] !== undefined ? name[0].name : ''
        })
        return genre
    }

    /**
 * Function to get an array of video links
 * @param {Array} data 
 */
    getVideoURL(data) {
        //If there is no links, return null
        if (data.length === 0) {
            return 'https://www.netflix.com/browse'
        }

        //Get the first link - Assume it to be the best link
        data = data[0]

        //Set attributes for video play
        let autoplay = 1
        let mute = 1

        //Construct video url based on its site
        if (data.site === "YouTube") {
            let base_url = 'https://www.youtube.com/embed/'
            return `${base_url}${data.key}`
        } else if (data.site === "Vimeo") {
            let base_url = 'https://vimeo.com/embed/'
            return `${base_url}${data.key}?autoplay=${autoplay}&mute=${mute}`
        }
    }

    /**
     * Function to fetch video links based a movie id
     */
    fetchVideo(curObj) {
        //API KEY from Environment settings
        let apiKey = process.env.REACT_APP_APIKEY

        //Iterate over each movie and fetch its corresponding video url
        this.movieList.forEach(async function(movie){
            //Variables to construct customized url
            let url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`

            //Use try-block to handle Exception
            try {
                let response = await fetch(url)
                let data = await response.json()
                let link = await curObj.getVideoURL(data.results)

                //Keep track of number of movie's video url has been fetched
                curObj.state.countDown--

                //Update the state attribute - Each movie id has a list of link and modal-show indicator
                curObj.setState({ ...curObj.state, [data.id]: [link, false]})
            } catch (err) {
                console.log("Failed to get video", err)

                //Keep track of number of movie's video url has been fetched
                curObj.state.countDown--
            }
        })
    }

    /**
     * Function to fetch video urls after finishing rendering the page
     */
    componentDidMount() {
        this.fetchVideo(this)
    }
    
    /**
     * Function to open the current movie's modal
     * @param {object} movie 
     */
    handleShow(movie){
        let movieId = movie.id
        let thisLink = this.state[movieId][0]
        this.setState({...this.state, [movieId]:[thisLink, true]})
    }

    /**
     * Function to close the current movie's modal
     */
    handleClose(movie){
        let movieId = movie.id
        let thisLink = this.state[movieId][0]
        this.setState({ ...this.state, [movieId]: [thisLink, false] })
    }

    /**
     * Function to render modals for all movies
     */
    getModals(){
        return this.movieList.map((movie) => {
            return (
                <Modal size='lg' show={this.state[movie.id][1]} onHide={() => this.handleClose(movie)} dialogClassName="dn-modal" centered>
                    <div className='dn-modal-box'>
                        <Modal.Header className='dn-modal-head' closeButton>
                            <Modal.Title>Trailer</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="embed-responsive embed-responsive-16by9">
                                <ReactPlayer title="video" url={this.state[movie.id][0]} muted playing={true} width={'100%'} height={'100%'} loop={false} controls={true}></ReactPlayer>
                            </div>
                        </Modal.Body>

                        <Modal.Footer className='dn-modal-footer'>
                            <Button variant="outline-danger" onClick={() => this.handleClose(movie)}>Close</Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            )
        })
    }

    /**
     * Function to render the page
     */
    render() {
        if (this.state.countDown > 0){
            return <Spinner></Spinner>
        }

        return (
            <div>
                <Carousel>
                    {this.movieList.map((item, index) => {
                        return (
                            <Carousel.Item key={`${item.title}${index}`}>
                                <MDBView src={`${this.setImgPath('original', item.backdrop_path)}`}>
                                    <MDBMask className="text-white text-center dn-jumbotron">
                                        <div className='dn-jumbotron-infor'>
                                            <h1 className='dn-title-jumbotron'>{item.title}</h1>

                                            <h4 style={{ 'color': 'red' }}>
                                                <Moment className='dn-time' fromNow>{item.release_date}</Moment>
                                            </h4>

                                            <h4 className='dn-rating'>
                                                <i className="fas fa-star" style={{ 'color': 'red', 'margin': '10px' }}></i>{item.vote_average}
                                            </h4>

                                            <p className='h6'>{this.getGenre(item.genre_ids).map((item, index) => <span className='dn-genre-text badge badge-danger' key={`${item.title}-${index}`}>{item}</span>)}
                                            </p>
                                            
                                            <Button onClick={() => this.handleShow(item)}>Watch the trailer</Button>
                                        </div>
                                    </MDBMask>
                                </MDBView>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>

                {this.getModals()}
            </div>
        )
    }
}