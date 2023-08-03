import React from "react";
import { Carousel } from 'react-responsive-carousel';

class ImageGalleryComponent extends React.Component {
    render() {
        return (
            <div>
                <Carousel interval="500" transitionTime="500">
                {this.props.images ? this.props.images.map(image => {
                  let urlString = image.url.split("|")
                  let url = urlString[0] + "%7C" + urlString[1]
                  return (
                    <div>
                        <img src={url} />
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
