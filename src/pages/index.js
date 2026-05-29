import React from "react";
import SEO from "../components/seo";
import Banner from "../components/homedefault/banner";
import About from "../components/homedefault/about";
import Philosophy from "../components/homedefault/philosophy";
import VeeraSection from "../components/homedefault/veeraSection";
import Project from "../components/homedefault/project";
import BlogPost from "../components/blogPost";
import Contact from "../elements/contact/contact";

const IndexPage = () => {
return(
  <>
    <SEO title="Nervous System Restoration & Herbal Wellbeing" description="Grounded guidance for nervous system restoration, herbal wellbeing, embodied living, and sustainable daily ritual." />
    <Banner />
    <About />
    <div className="portfolio-id" id="portfolio">
      <Project />
    </div>
    <Philosophy />
    <VeeraSection />
    <BlogPost />
    <Contact />
  </>
)
}
export default IndexPage;
