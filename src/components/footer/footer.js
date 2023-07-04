import React, {useState , useEffect} from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from 'gatsby'

const Footer = ({showBelow}) => {
    const [show, setShow] = useState(showBelow ? false : true)

    const handleScroll = () => {
        if (window.pageYOffset > showBelow) {
            if (!show) setShow(true)
        }else {
            if (show) setShow(false)
        }
    }

    useEffect(() => {
        if (showBelow) {
            window.addEventListener(`scroll`, handleScroll)
            return () => window.removeEventListener(`scroll`, handleScroll)
        }
    })

    const handleClick = () => {
        window[`scrollTo`]({top: 0, behavior: `smooth`})
    }
    return (
        <footer className="rn-footer-area bg-color-black pt--90 pb--60">
            <div className="footer-wrapper" style={{textAlign: "center"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--30 mt_sm--30 wow fadeInDown" data-wow-delay="200ms" data-wow-duration="0.1s">
                            <div className="ft-info">
                                <p>The Alchemy of <br />Remembrance</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--30 mt_sm--30 wow fadeInDown" data-wow-delay="200ms" data-wow-duration="0.2s">
                            <div className="ft-info">
                                <p>Noordhoek, <br />Cape Town</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--30 mt_sm--30 wow fadeInDown" data-wow-delay="200ms" data-wow-duration="0.4s">
                            <div className="ft-info">
                                <p>mattb007@gmail.com<br />083 293 5904</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--30 mt_sm--30 wow fadeInDown" data-wow-delay="200ms" data-wow-duration="0.4s">
                            <div className="ft-info">
                                <p>About<br /><Link style={{color: "white"}} to="/policy">Privacy Policy</Link><br/><Link style={{color: "white"}} to="/terms">Terms & Conditions</Link></p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--30 mt_sm--30 wow fadeInDown" data-wow-delay="200ms" data-wow-duration="0.6s" style={{display: "flex", justifyContent: "center"}}>
                            <div className="ft-info">
                                <ul className="social-share">
                                    <li><a target="_blank" href="https://www.facebook.com/alchemyremembrance/"><FaFacebookF /></a></li>
                                    <li><a target="_blank" href="https://www.instagram.com/alchemyofremembrance/"><FaInstagram /></a></li>
                                    <li><a target="_blank" href="https://www.youtube.com/channel/UCMuZwqrNoHY6-wRrDVfCKLg/"><FaYoutube /></a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="back-to-top">
                <div className="backtop" onClick={handleClick}>
                    <span className="top"></span>
                </div>
            </div>
        </footer>
    )
}
export default Footer
