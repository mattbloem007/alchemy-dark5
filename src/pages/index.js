import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Banner from "../components/homedefault/banner";
import About from "../components/homedefault/about";
import Project from "../components/homedefault/project";
import Testimonial from "../components/homedefault/testimonial";
import Service from "../components/homedefault/service";
import Brand from "../components/homedefault/brand";
import BlogPost from "../components/blogPost";
import Contact from "../elements/contact/contact";

const IndexPage = (props) => {
console.log("index props", props)
return(
  <>
    <SEO title="Cacao Ceremony" description="Searching for a New Way to Bring Extra Energy into Your Life?" />
    <Banner />
    <About />
    <Service />
    <div className="portfolio-id" id="portfolio">
      <Project />
      <Testimonial />
    </div>
    <BlogPost />
    <Contact />
  </>
)
}
export default IndexPage;
