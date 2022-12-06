import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';

const Calltoaction = ({title, buttonText, action }) => {

    return (
        <div className="rn-callto-action-area callto-action-style-1 bg-color-primary ptb--50">
            <div className="container">
                <div className="row align-items-center" style={{marginLeft: "0px"}}>
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="inner">
                            <h4 className="title">{title}</h4>
                        </div>
                    </div>
                    <div className="col-lg-12" style={{paddingLeft: "0px"}}>
                        <div className="action-btn text-left text-md-left">
                            <button className="rn-button btn-white" style={{display: "flex", justifyContent: "center", padding: "0px 30px"}} onClick={action}><span style={{whiteSpace: "nowrap"}}>{buttonText}</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Calltoaction
