import React, { Component } from "react";
import {MDBContainer} from "mdbreact";

class Footer extends Component {
    render() {
        return (
            <div className='dn-footer'>
                <div className='dn-icons-footer'>
                    <div className='dn-icons-infor'>
                        <span className='dn-icon'><i className="fab dn-footer-fb fa-facebook-square"></i></span>
                        <span className='dn-icon'><i className="fab dn-footer-insta fa-instagram"></i></span>
                        <span className='dn-icon'><i className="fab dn-footer-tw fa-twitter-square"></i></span>
                        <span className='dn-icon'><i className="fab dn-footer-you fa-youtube-square"></i></span>
                    </div>
                </div>

                <div className='dn-footer-links'>
                    <div className='row dn-footer-infor'>
                        <ul className='dn-col-footer col-3-md'>
                            <li><a className="list-unstyled" href="#!">Audio and Subtitles</a></li>
                            <li><a className="list-unstyled" href="#!">Media Center</a></li>
                            <li><a className="list-unstyled" href="#!">Privacy</a></li>
                            <li><a className="list-unstyled" href="#!">Contact Us</a></li>
                        </ul>
                        <ul className='dn-col-footer col-3-md'>
                            <li><a className="list-unstyled" href="#!">Audio Description</a></li>
                            <li><a className="list-unstyled" href="#!">Investor Relations</a></li>
                            <li><a className="list-unstyled" href="#!">Legal Notices</a></li>
                        </ul>
                        <ul className='dn-col-footer col-3-md'>
                            <li><a className="list-unstyled" href="#!">Help Center</a></li>
                            <li><a className="list-unstyled" href="#!">Jobs</a></li>
                            <li><a className="list-unstyled" href="#!">Cookie Preferences</a></li>
                        </ul>
                        <ul className='dn-col-footer col-3-md'>
                            <li><a className="list-unstyled" href="#!">Gift Cards</a></li>
                            <li><a className="list-unstyled" href="#!">Term of Use</a></li>
                            <li><a className="list-unstyled" href="#!">Corporate Information</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright: <span className='dungngo'> Made by Dung Ngo with <i className="fas fa-heart"></i> </span>
                    </MDBContainer>
                </div>
            </div>
        )
    }
}

export default Footer;