import React from 'react';
import { FiFeather , FiStar, FiSun } from "react-icons/fi";

const Service = () => {
    return (
        <div className="rn-service-area rn-section-gapBottom">
            {/* Start Service Area  */}
            <div className="rn-service-area">
                <div className="container">
                    <div className="row">

                        {/* Start Single Service  */}
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="service wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">
                                <div className="inner">
                                    <div className="icon">
                                        <FiFeather />
                                    </div>
                                    <div className="content">
                                        <h4 className="title">ixCacao Journeys</h4>
                                        <p>Nutritional Immersions with cacao as a superfood and soulfood. Deepening your relationship with the body
                                        <br/>
                                          <a href="/online-ixcacao-nutritional-immersions" style={{textDecoration: "underline", color: "orange"}}>Learn more...</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Single Service  */}

                        {/* Start Single Service  */}
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="service wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">
                                <div className="inner">
                                    <div className="icon">
                                        <FiStar />
                                    </div>
                                    <div className="content">
                                        <h4 className="title">Traditional Medicine</h4>
                                        <p>As a graduated Thokoza Sangoma, I do private consulting for those looking for assistance in personal health, spiritual or physical. I then prescribe a personal medicine, formulated to support the healing process.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Single Service  */}

                        {/* Start Single Service  */}
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="service wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">
                                <div className="inner">
                                    <div className="icon">
                                        <FiSun />
                                    </div>
                                    <div className="content">
                                        <h4 className="title">Raw Cacao</h4>
                                        <p>Cacao is the food of the Gods. A SUPERfood, a SOULfood. Matthew Gabriel's beginning awakening was with the help of Cacao </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Single Service  */}

                    </div>
                </div>
            </div>
            {/* End Service Area  */}

        </div>
    )
}

export default Service;
