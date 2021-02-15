import React, { Fragment } from'react';
import Header from '../components/Header'
import Footer from '../components/Footer';
import AppNavBar from '../components/AppNavBar';

const MyRouter = () => (
  // vue teamplete? 같은 개념, 
  <Fragment>
    <AppNavBar />
    <Header />
    <h1>Hello body</h1>
    <Footer />
  </Fragment>
)

export default MyRouter;
