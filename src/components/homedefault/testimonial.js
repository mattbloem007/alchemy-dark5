import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { FaQuoteRight } from 'react-icons/fa';

import testimonialOne from '../images/testimonial/1.jpg';
import testimonialTwo from '../images/testimonial/2.jpg';
import testimonialThree from '../images/testimonial/3.jpg';



const Testimonial = () => {
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return (
        <div>
            <div className="testimonial-area testimonial-style-1 pb--110">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title mb--100 mb_sm--50 mb_md--50">
                                <h3 className="title">What Journeyers Say <span className="bg">Testimonial</span></h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <div className="testimonial-inner">
                                                <div className="icon">
                                                    <FaQuoteRight />
                                                </div>
                                                <p>Truly blessed and profound teachings received from this cleanse and detox process forever grateful and once again humbled by Ixcacao and her grace. Thokoza gogo Nabomkhulu for holding such a sacred container for all of us to journey within.  </p>
                                                <div className="client-info">
                                                    <div className="thumbnail">
                                                        <img src={testimonialOne} alt="Testimonail Images" />
                                                    </div>
                                                    <div className="info">
                                                        <h3 className="title">Cleanse Journeyer</h3>
                                                        <span>2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <div className="testimonial-inner">
                                                <div className="icon">
                                                    <FaQuoteRight />
                                                </div>
                                                <p>My heart and body is in so much gratitude for this meditation. It was incredibly powerful that I released water from my eyes 👀.Thank you for your gift Matthew. I am in awe and inspired... So awe-inspired </p>
                                                <div className="client-info">
                                                    <div className="thumbnail">
                                                        <img src={testimonialTwo} alt="Testimonail Images" />
                                                    </div>
                                                    <div className="info">
                                                        <h3 className="title">Expanding Vitality Journeyer</h3>
                                                        <span>2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <div className="testimonial-inner">
                                                <div className="icon">
                                                    <FaQuoteRight />
                                                </div>
                                                <p>Matthew’s offering are profound, touching so many levels of the human experience. He is extremely knowledgeable about all things nutrition and plant based, but more than that he weaves the spiritual through all of it. At all times I felt held in a powerful field of healing, being able to bring all of me to the space to be witnessed. Best of all I always feel incredible by the end of it, whether cleansing the body  or raising my vibration, I am fundamentally changed by these experiences. I feel deeply nourished on a soul level after journeying with this remarkable man. When’s the next one!?!</p>
                                                <div className="client-info">
                                                    <div className="thumbnail">
                                                        <img src={testimonialThree} alt="Testimonail Images" />
                                                    </div>
                                                    <div className="info">
                                                        <h3 className="title">Chi Activation Journeyer</h3>
                                                        <span>2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPane>

                                    </TabContent>
                                </div>
                                <div className="col-lg-6">
                                    <Nav className="rn-nav-image-item" tabs>
                                        <NavItem className="first-item">
                                            <NavLink
                                                className={classnames({ active: activeTab === '1' })}
                                                onClick={() => { toggle('1'); }}
                                                >
                                                    <img src={testimonialOne} alt="Testimonail Images" />

                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            className={classnames({ active: activeTab === '2' })}
                                            onClick={() => { toggle('2'); }}
                                            >
                                                <img src={testimonialTwo} alt="Testimonail Images" />
                                            </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink
                                            className={classnames({ active: activeTab === '3' })}
                                            onClick={() => { toggle('3'); }}
                                            >
                                                <img src={testimonialThree} alt="Testimonail Images" />
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonial
