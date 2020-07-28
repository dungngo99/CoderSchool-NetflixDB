import React, { Component } from 'react'
import MovieCard from './MovieCard';
import $ from 'jquery'

//Object MovieArea to store a list of MovieCard Objects
export default class MovieArea extends Component {
    /**
     * Constructor to initialize the MovieArea object
     * Attributes:
     *  1. genre (from App): the list of genres
     *  2. type (from App): the title of each MovieArea
     *  4. key (from App): key that consistent with App's key -> used to update App's state attribute whenever new data is fetched from children
     *  5. page (from App - default to be 1): keep track of number of pages that has been fetched
     *  6. parent (from App): a connection to parent (App object) -> used to updated App's state attribute whenever new data is fetched from children
     *  7. issUpdateParent (from MovieArea): keep track whether App's state has been updated.
     */
    constructor(props) {
        //Call superclass's constructor
        super(props)

        //Attributes 
        this.genre = this.props.genre
        this.type = this.props.type
        this.key = this.props.mykey
        this.page = 1
        this.parent = props.parent
        this.isUpdateParent = false

        //State has attributes: parentData
        this.state = {
            parentData: this.props.movieList,
        }
    }

    /**
    * EventListener will call function fetchMovie() whenever user hits the end of sizebar
    */
    addJquery(curObj) {
        //Attributes that are used
        let parent = $(`#movie-area-${curObj.key}`).first()
        let child = $(`#movie-box-${curObj.key}`).first()

        //Function will fire whenever scrolling hits its end
        parent.scroll(async function () {
            //Check if user has hit the end of scrollbar
            if (Math.floor(parent.scrollLeft() + parent.width()) >= Math.floor(child.width())) {
                //Try-catch block to handle Exception if failed to fetch data from API
                //There are 2 kinds (endpoints=[search, movie]) of dataset that will be fetched
                try {
                    if (['popular', 'top_rated', 'upcoming', 'now_playing'].includes(curObj.key)) {
                        curObj.fetchMovie('movie', curObj.key, curObj.page + 1, null, curObj)
                    } else {
                        curObj.fetchMovie('search', 'movie', curObj.page + 1, curObj.key, curObj)
                    }
                } catch (err) {
                    console.log('Failed to compile', err)
                }
            }
        })
    }

    /**
     * Function to return a deep copy of inObject
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
     *Function to update attributes of child(MovieArea) state attributes
     */
    updateMovies(data, curObj) {
        //Define new child's movie list and parent node
        let newMovies = this.props.movieList.results.concat(data.results)
        let newParent = curObj.deepCopy(curObj.state.parentData)

        //Update the child and parent's properties
        newParent['results'] = newMovies
        curObj.isUpdateParent = true
        curObj.page++

        //Call setSate child's state to rerender
        curObj.setState({ parentData: newParent })
    }

    /**
     * Function to fetch movies based on endpoints and sub_endpoints
     */
    async fetchMovie(endpoint = 'movie', sub_endpoint = 'upcoming', page = 1, keyword = 3417, curObj) {
        //Get the API KEY
        let apiKey = process.env.REACT_APP_APIKEY

        //Variables to construct urls
        let domain = ''
        let url = ''
        let language = 'en-US'
        let sortBy = 'popularity.desc'
        let include_adult = false
        let include_video = false

        //Construct urls based on 2 endpoints (movie and search)
        switch (endpoint) {
            case 'movie':
                domain = `https://api.themoviedb.org/3/${endpoint}/${sub_endpoint}?`
                url = `${domain}api_key=${apiKey}&language=${language}&sort_by=${sortBy}&include_adult=${include_adult}&include_video=${include_video}&page=${page}`
                break
            case 'search':
                domain = `https://api.themoviedb.org/3/${endpoint}/${sub_endpoint}?`
                url = `${domain}api_key=${apiKey}&language=${language}&include_adult=${include_adult}&query=${keyword}&page=${page}`
                break
            default:
                break
        }

        //Try-catch block to handle Exception when failed to fetch data
        try {
            let response = await fetch(url)
            let data = await response.json()

            //Update the parent data
            this.updateMovies(data, curObj)
        } catch (err) {
            alert(err)
        }
    }

    /**
     * This event will fire after component rendered and add EventListener based on Jquery to the component
     */
    componentDidMount() {
        this.addJquery(this)
    }

    /**
     * This function to update the parent's state attribute after MovieArea is updated
     */
    componentDidUpdate() {
        if (this.isUpdateParent) {
            //Switch isUpdateParent back to false to prepare for next fetch
            this.isUpdateParent = false

            //Update the parent's state
            this.parent.setState({
                ...this.parent.state, [this.key]: this.state.parentData, functionality: 'load-more'
            })
        }
    }

    /**
     * Function to render the page again
     */
    render() {
        return (
            <div>
                <h2 className='dn-moviearea-title'>{this.type}</h2>
                <p>{`Showing: ${this.props.movieList.results.length} of ${this.props.movieList.total_results}`}</p>

                <div className='dn-movie-area' id={`movie-area-${this.key}`}>
                    <div className='dn-movies' id={`movie-box-${this.key}`} style={{ 'width': `${25 * this.props.movieList.results.length}%` }}>
                        {this.props.movieList.results.map((item, i) => {
                            return <MovieCard movie={item} genre={this.genre} key={`movie-${i}`}></MovieCard>
                        }
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
