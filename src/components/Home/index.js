import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="heading-background">
    <Header />
    <div className="inner-container-home">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="description-home">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the jobs that fits your abilities and potential.
      </p>
      <Link to="./jobs">
        <button className="logout-button" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
