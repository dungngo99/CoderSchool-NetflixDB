import React, { Component } from 'react'
import Moment from 'react-moment'

//MovieCard object to construct a movie card
export default class MovieCard extends Component {
    constructor(props) {
        /**
         * Constructor to initalize MovieCard object with necessary attributes
         */
        //Call super() of superclass
        super(props)

        //Attributes
        this.ArrGenres = this.props.genre.genres
    }

    getImagePath(filesize, filepath) {
        /**
         * Function to construct image path
         */
        //In case we can't get the image path, use a default image
        if (this.props.movie.backdrop_path === null) {
            return 'https://thetechstories.com/wp-content/uploads/2018/08/netflix-logo.jpg'
        }

        //Otherwise, return created image path
        let base_url = 'https://image.tmdb.org/t/p'
        return `${base_url}/${filesize}/${filepath}`
    }

    getGenre() {
        /**
         * Function to get genres from genre ids for each movie card
         */
        //Iteract over each genre id of a movie
        let genre = this.props.movie.genre_ids.map((id) => {
            //For each genre id, find its corresponding genre name from a list of genres
            let name = this.ArrGenres.filter((item) => item.id === id)
            //If it can't find the genre name, set it to empty string
            return name[0] !== undefined ? name[0].name : ''
        })
        return genre
    }

    render() {
        /**
         * Function to render the page
         */
        return (
            <div className='dn-movie-card'>
                <div className='dn-image-card overlay' style={{ 'backgroundImage': `url(${this.getImagePath('w500', this.props.movie.backdrop_path)})` }}>
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
                            <div className='dn-movie-overview'>{this.props.movie.overview}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
