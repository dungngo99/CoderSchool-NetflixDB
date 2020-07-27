import React, { Component } from 'react'
import { Carousel } from 'react-bootstrap'
import { MDBMask, MDBView } from 'mdbreact'
import Moment from 'react-moment'

export default class JumBoTron extends Component {
    constructor(props) {
        super(props)
        this.number = 10
        this.movieList = this.getRandom()
        this.ArrGenres = this.props.genre.genres
        this.state = {}
    }

    getRandom() {
        /**
         * Function to get 3 random number of movies from movie list
         */
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

    setImgPath(filesize, filepath) {
        /**
         * Function to construct image path
         */

        //In case we can't get the image path, use a default image
        if (this.backdrop === null) {
            return 'https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'
        }

        //Otherwise, return created image path
        let base_url = 'https://image.tmdb.org/t/p'
        return `${base_url}/${filesize}/${filepath}`
    }

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

    getVideoURL(data) {
        if (data.length === 0) {
            return null
        }
        data = data[0]
        if (data.site === "YouTube") {
            let base_url = 'https://www.youtube.com/watch?v='
            return `${base_url}${data.key}`
        } else if (data.site === "Vimeo") {
            let base_url = 'https://vimeo.com/'
            return `${base_url}${data.key}`
        }
    }

    fetchVideo(curObj) {
        //API KEY from Environment settings
        let apiKey = process.env.REACT_APP_APIKEY

        //Variables to construct customized url
        this.movieList.forEach(async function (movie) {
            let url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`

            try {
                let response = await fetch(url)
                let data = await response.json()
                let link = await curObj.getVideoURL(data.results)

                curObj.setState({ [data.id]: link })
            } catch (err) {
                console.log("Failed to get video", err)
            }
        })
    }

    componentDidMount() {
        this.fetchVideo(this)
    }

    render() {
        if (Object.keys(this.state) < this.number) {
            return ''
        }

        return (
            <Carousel>
                {this.movieList.map((item, index) => {
                    return (
                        <Carousel.Item key={`${item.title}${index}`}>
                            <MDBView src={`${this.setImgPath('original', item.backdrop_path)}`}>
                                <MDBMask className="text-white text-center dn-jumbotron">
                                    <div className='dn-jumbotron-infor'>
                                        <h1 className='dn-title-jumbotron'>{item.title}</h1>
                                        <h4 style={{ 'color': 'red'}}>
                                            <Moment className='dn-time' fromNow>{item.release_date}</Moment>
                                        </h4>
                                        <h4 className='dn-rating'>
                                            <i className="fas fa-star" style={{ 'color': 'red', 'margin': '10px'}}></i>{item.vote_average}
                                        </h4>
                                        <p className='h6'>{this.getGenre(item.genre_ids).map((item, index) => <span className='dn-genre-text badge badge-danger' key={`${item.title}-${index}`}>{item}</span>)}</p>
                                    </div>
                                </MDBMask>
                            </MDBView>
                        </Carousel.Item>
                    )
                })}
            </Carousel>
        )
    }
}