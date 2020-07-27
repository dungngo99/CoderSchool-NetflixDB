import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink } from 'mdbreact';
import { Button, FormControl } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom';

class FullPageIntroWithFixedTransparentNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
        };
        this.onClick = this.onClick.bind(this);
        this.searchMovie = this.props.searchMovie
        this.ClickBtn = this.props.ClickBtn
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

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