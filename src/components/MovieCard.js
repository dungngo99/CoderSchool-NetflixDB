import React, { Component } from 'react'
import Moment from 'react-moment'
import { Modal, Button } from 'react-bootstrap'
import ReactPlayer from 'react-player'

//MovieCard object to construct a movie card
export default class MovieCard extends Component {
    /**
    * Constructor to initalize MovieCard object with necessary attributes
    */
    constructor(props) {
        //Call super() of superclass
        super(props)

        //Attributes
        this.ArrGenres = this.props.genre.genres

        this.state = {
            show: false
        }
    }

    /**
     * Function to construct image path
     */
    getImagePath(filesize, filepath) {
        //In case we can't get the image path, use a default image
        if (this.props.movie.backdrop_path === null) {
            return 'https://thetechstories.com/wp-content/uploads/2018/08/netflix-logo.jpg'
        }

        //Otherwise, return created image path
        let base_url = 'https://image.tmdb.org/t/p'
        return `${base_url}/${filesize}/${filepath}`
    }

    /**
     * Function to get genres from genre ids for each movie card
     */
    getGenre() {
        //Iteract over each genre id of a movie
        let genre = this.props.movie.genre_ids.map((id) => {
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
    async fetchVideo(curObj) {
        //API KEY from Environment settings
        let apiKey = process.env.REACT_APP_APIKEY

        //Variables to construct customized url
        let url = `https://api.themoviedb.org/3/movie/${this.props.movie.id}/videos?api_key=${apiKey}&language=en-US`

        //Use try-block to handle Exception
        try {
            let response = await fetch(url)
            let data = await response.json()
            let link = await curObj.getVideoURL(data.results)

            //Update the state attribute
            curObj.setState({...this.state, [data.id]: link })
        } catch (err) {
            console.log("Failed to get video", err)
        }
    }

    /**
     * Function to fetch video urls after finishing rendering the page
     */
    componentDidMount() {
        this.fetchVideo(this)
    }

    /**
     * Function to render the page
     */
    render() {
        return (
            <div className='dn-movie-card'>

                <div className='dn-image-card overlay' style={{ 'backgroundImage': `url(${this.getImagePath('w500', this.props.movie.backdrop_path)})` }} onClick={() => this.setState({ show: true })}>
                    <div className='dn-movie-infor mask rgba-black-strong'>
                        <div className='dn-movie-cave'>
                            <p className='h3'>{this.props.movie.title}</p>

                            <p className='h6 dn-popularity dn-rating'>
                                <i className="fas fa-star" style={{ 'color': 'red' }}></i>
                                {` ${this.props.movie.vote_average}`}
                            </p>

                            <p className='text-muted'>
                                <Moment fromNow className='dn-time'>{this.props.movie.release_date}</Moment>
                            </p>

                            <p className='h6'>
                                {this.getGenre().map((item, index) => <span key={`${this.props.movie.title}-${index}`} className='dn-genre-text badge badge-danger'>{item}</span>)}
                            </p>

                            <p className='dn-movie-overview'>{this.props.movie.overview}</p>

                            <p>Click to watch trailer</p>
                        </div>
                    </div>
                </div>

                <Modal size='lg' show={this.state.show} onHide={() => this.setState({ ...this.state, show: false })} dialogClassName="dn-modal" centered>
                    <div className='dn-modal-box'>
                        <Modal.Header className='dn-modal-head' closeButton>
                            <Modal.Title>Trailer</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="embed-responsive embed-responsive-16by9">
                                <ReactPlayer title="video" url={this.state[this.props.movie.id]} muted playing={true} width={'100%'} height={'100%'} loop={true} controls={true}></ReactPlayer>
                            </div>
                        </Modal.Body>

                        <Modal.Footer className='dn-modal-footer'>
                            <Button variant="secondary" onClick={() => this.setState({ ...this.state, show: false })}>Close</Button>
                        </Modal.Footer>
                    </div>
                </Modal>

            </div>
        )
    }
}