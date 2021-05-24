import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink } from 'mdbreact';
import { Button, FormControl, Dropdown } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom';
import RangeSlider from './RangeSlider'

//Make a Navbar object
class FullPageIntroWithFixedTransparentNavbar extends React.Component {
    /**
     * Constructor to initialize the NavBar object
     * @param {object} props 
     */
    constructor(props) {
        //State attribute
        this.state = {
            collapse: false,
            isWideEnough: false,
        };

        //Attributes
        this.onClick = this.onClick.bind(this);
        this.searchMovie = this.props.searchMovie
        this.ClickBtn = this.props.ClickBtn

        //Parent connection will be passed to RangeSlider
        this.parent = this.props.parent
    }

    /**
     * Function render next Carousel whenever user clicks next
     */
    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    /**
   * Function to make a deep copy of current object
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
     * Function to sort all movies in Movie areas based on their popularities
     * @param {string} value 
     */
    sortBy(value) {
        //Make a deep copy of current parent object
        let objStore = this.deepCopy(this.parent.state)

        //Loop through each key and update filtered lists
        for (let key in objStore) {
            if (['countDown', 'dummy', 'tempMovieList', 'genre', 'functionality'].includes(key)) continue

            objStore[key]['results'] = objStore[key]['results'].sort((movieA, movieB) => {
                if (value === 'lowTohigh') {
                    return (movieA.popularity - movieB.popularity)
                } else {
                    return (movieB.popularity - movieA.popularity)
                }
            })
        }

        //Update parent object
        this.parent.setState({ ...this.parent.state, tempMovieList: objStore, functionality: 'search' })
    }

    /**
     * Function to render the page
     */
    render() {
        return (
            <div>
                <header>
                    <Router>
                        <MDBNavbar color="bg-dark" fixed="top" dark expand="md" scrolling transparent>
                            <MDBNavbarBrand href="/" style={{ 'color': 'red', 'fontSize': '30px' }}>
                                <strong>NetFlix</strong>
                            </MDBNavbarBrand>

                            {!this.state.isWideEnough && <MDBNavbarToggler onClick={this.onClick} />}
                            <MDBCollapse isOpen={this.state.collapse} navbar>
                                <MDBNavbarNav left>
                                    <MDBNavItem active><MDBNavLink to="#">Home</MDBNavLink></MDBNavItem>
                                    <MDBNavItem><MDBNavLink to="#">TV</MDBNavLink></MDBNavItem>
                                    <MDBNavItem><MDBNavLink to="#">Movies</MDBNavLink></MDBNavItem>

                                    <MDBNavItem>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-danger" size='sm' id="dropdown-basic">Sort By Popularity</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item as='button' onClick={() => this.sortBy('lowTohigh')} href="#/action-2">Lowest to highest</Dropdown.Item>
                                                <Dropdown.Item as='button' onClick={() => this.sortBy('highTolow')} href="#/action-3">Highest to lowest</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </MDBNavItem>
                                </MDBNavbarNav>

                                <div style={{'width': '30%', 'margin':'0px 20px'}}>
                                    <RangeSlider parent={this.parent}></RangeSlider>
                                </div>

                                <div className='dn-search-area'>
                                    <FormControl placeholder="Search your movie" className='dn-search-text' id='dn-search-input' onChange={(e) => this.searchMovie(e.target.value)} />
                                    <Button variant="outline-danger" className='btn-sm' id='dn-search-btn' onClick={() => this.ClickBtn()}>Search</Button>
                                    <div className='dn-user-face'><i className="far fa-smile-beam"></i></div>
                                </div>
                            </MDBCollapse>

                        </MDBNavbar>
                    </Router>
                </header>
            </div>
        );
    }
}

export default FullPageIntroWithFixedTransparentNavbar;