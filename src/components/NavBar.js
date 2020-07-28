import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink } from 'mdbreact';
import { Button, FormControl } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom';

//Make a Navbar object
class FullPageIntroWithFixedTransparentNavbar extends React.Component {
    /**
     * Constructor to initialize the NavBar object
     * @param {object} props 
     */
    constructor(props) {
        //Call super-class constructor
        super(props);

        //State attribute
        this.state = {
            collapse: false,
            isWideEnough: false,
        };

        //Attributes
        this.onClick = this.onClick.bind(this);
        this.searchMovie = this.props.searchMovie
        this.ClickBtn = this.props.ClickBtn
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
     * Function to render the page
     */
    render() {
        return (
            <div>
                <header>
                    <Router>
                        <MDBNavbar color="bg-dark" fixed="top" dark expand="md" scrolling transparent>
                            <MDBNavbarBrand href="/" style={{ 'color': 'red', 'fontSize':'30px'}}>
                                <strong>NetFlix</strong>
                            </MDBNavbarBrand>

                            {!this.state.isWideEnough && <MDBNavbarToggler onClick={this.onClick} />}
                            <MDBCollapse isOpen={this.state.collapse} navbar>
                                <MDBNavbarNav left>
                                    <MDBNavItem active><MDBNavLink to="#">Home</MDBNavLink></MDBNavItem>
                                    <MDBNavItem><MDBNavLink to="#">TV Shows</MDBNavLink></MDBNavItem>
                                    <MDBNavItem><MDBNavLink to="#">Movies</MDBNavLink></MDBNavItem>
                                    <MDBNavItem><MDBNavLink to="#">Lastest</MDBNavLink></MDBNavItem>
                                    <MDBNavItem><MDBNavLink to="#">My List</MDBNavLink></MDBNavItem>
                                </MDBNavbarNav>

                                <MDBNavbarNav right>
                                    <MDBNavItem><MDBNavLink to="#" >Kids</MDBNavLink></MDBNavItem>
                                    <MDBNavItem><MDBNavLink to="#">Present</MDBNavLink></MDBNavItem>
                                </MDBNavbarNav>

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