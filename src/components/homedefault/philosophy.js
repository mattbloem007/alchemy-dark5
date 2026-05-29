import React from "react";

const Philosophy = () => {
    return (
        <div className="rn-philosophy-area section-tone-light rn-section-gapBottom pt--100" id="philosophy">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title philosophy-title" style={{textAlign: "center"}}>
                            <h3 className="title">
                                The Philosophy Behind the Work
                                <span className="bg">Approach</span>
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="philosophy-copy" style={{textAlign: "center"}}>
                            <p className="description">Health is not something we force.</p>
                            <p className="description">
                                The body naturally moves toward vitality when given the right
                                conditions: rest, nourishment, rhythm, safety, sunlight,
                                grounding, slowness, connection, and presence.
                            </p>
                            <p className="description">
                                This work is about creating simple, sustainable practices that
                                support the nervous system and help us reconnect with the wisdom
                                of the body.
                            </p>
                            <p className="description">Not perfectly.</p>
                            <p className="description">Not rigidly.</p>
                            <p className="description">Humanly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Philosophy;
