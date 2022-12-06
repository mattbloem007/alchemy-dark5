import React from "react";
import { Carousel } from 'react-responsive-carousel';

class ImageGalleryComponent extends React.Component {
    render() {
        return (
            <div>
                <Carousel interval="500" transitionTime="500">
                {this.props.images ? this.props.images.map(image => {
                  return (
                    <div>
                        <img src={image.url} />
                        {/**<p className="legend">My Classic Still 1</p>*/}
                    </div>
                  )
                })
                  :
                  <div>
                  </div>
                }
                </Carousel>
            </div>
        )
    };
}

export default ImageGalleryComponent;
