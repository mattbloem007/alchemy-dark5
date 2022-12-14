import React, { useState, useEffect, Fragment } from "react"
import PropTypes from "prop-types";
import {useStaticQuery, graphql , Link} from 'gatsby';
import Img from "gatsby-image";
import Scrollspy from 'react-scrollspy';
import Image from "../../elements/image";
import CartNav from './cartnav'
import { CircleSpinner } from "react-spinners-kit";

// Start Header Area
const Header = (props) => {

    let {cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart, isCartVisible, setCartVisible} = props

    const headerQuery = useStaticQuery(graphql`
        query headerQuery {
            allMenuJson {
                nodes {
                    title
                    path
                }
            },
            file(relativePath: {eq: "images/logo/logo.png"}) {
                childImageSharp {
                  fluid(maxWidth: 374, maxHeight: 374, quality: 100) {
                      ...GatsbyImageSharpFluid_withWebp
                      presentationWidth
                      presentationHeight
                  }
                }
            }
        }
    `);

    const [scroll, setScroll] = useState(false)
    useEffect(() => {
        window.addEventListener("scroll", () => {
        setScroll(window.scrollY > 10)
        })
    }, [])

    const waxonLogo = headerQuery.file.childImageSharp.fluid;

    return (
        <Fragment>
            <header className={scroll ? "rn-header header-default header-transparent scrolled d-none d-md-none d-lg-block" : "rn-header header-default header-transparent d-none d-md-none d-lg-block"}>
                <div className="header-inner">
                    <div className="container">
                        <div className="row align-items-center">

                            {/* Start Header Left  */}
                            <div className="col-lg-3">
                                <div className="header-left">
                                    <div className="logo">
                                        <Link to="/">
                                            <Image fluid={waxonLogo}  />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* End Header Left  */}

                            {/* Start Mainmenu Area  */}
                            <div className="col-lg-9">
                                <div className="menu_wrapper">
                                    <Scrollspy className="mainmenuwrapper" items={['home','about', 'portfolio', 'readings' , 'offerings', 'contact']} currentClassName="is-current" offset={-200}>
                                        <li>
                                            <a className="menu-hover-link" href="/#home">
                                                <span className="hover-item">
                                                    <span data-text="Home">Home</span>
                                                </span>
                                            </a>
                                        </li>

                                        <li>
                                            <a className="menu-hover-link" href="/#about">
                                                <span className="hover-item">
                                                    <span data-text="About">About</span>
                                                </span>
                                            </a>
                                        </li>

                                        <li>
                                            <a className="menu-hover-link" href="/#portfolio">
                                                <span className="hover-item">
                                                    <span data-text="Portfolio">Portfolio</span>
                                                </span>
                                            </a>
                                        </li>

                                        <li>
                                            <a className="menu-hover-link" href="/#news">
                                                <span className="hover-item">
                                                    <span data-text="Readings">Readings</span>
                                                </span>
                                            </a>
                                        </li>

                                        <li>
                                            <a className="menu-hover-link" href="/offerings">
                                                <span className="hover-item">
                                                    <span data-text="Offerings">Offerings</span>
                                                </span>
                                            </a>
                                        </li>

                                        <li>
                                            <a className="menu-hover-link" href="/#contact">
                                                <span className="hover-item">
                                                    <span data-text="Contact">Contact</span>
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                        {cart && Object.entries(cart).length == 0 ? 
                                          <CircleSpinner size={30} loading={true} />
                                          :
                                          <CartNav
                                            cart={cart}
                                            onUpdateCartQty={onUpdateCartQty}
                                            onRemoveFromCart={onRemoveFromCart}
                                            onEmptyCart={onEmptyCart}
                                            scroll={scroll}
                                            isCartVisible={isCartVisible}
                                            setCartVisible={setCartVisible}
                                            />
                                             }
                                        </li>

                                    </Scrollspy>
                                </div>
                            </div>
                            {/* End Mainmenu Area  */}
                        </div>
                    </div>




                </div>
            </header>

        </Fragment>
    )
}
// End Header Area

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header;
