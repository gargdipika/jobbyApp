import Cookies from 'js-cookie'
import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetail extends Component {
  state = {jobItemData: {}, apiJobItemStatus: apiStatusConstant.initial}

  componentDidMount = () => {
    this.getJobItemDetail()
  }

  getJobItemDetail = async () => {
    this.setState({apiJobItemStatus: apiStatusConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jodDetailApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const responseData = await fetch(jodDetailApiUrl, options)
    const data = await responseData.json()
    if (responseData.ok) {
      const updateJobData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          skills: data.job_details.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          title: eachJob.title,
          rating: eachJob.rating,
        })),
      }

      this.setState({
        jobItemData: updateJobData,
        apiJobItemStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiJobItemStatus: apiStatusConstant.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemSuccess = () => {
    const {jobItemData} = this.state
    const {jobDetails, similarJobs} = jobItemData
    console.log(jobDetails)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      id,
      lifeAtCompany,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
    } = jobDetails
    console.log(similarJobs)
    return (
      <div className="success-container">
        <div className="job-detail-success-container">
          <div className="top-container">
            <img
              className="company-logo-job-description"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="top-inner-container">
              <h1 className="title-job">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star" />
                <p className="rating-job">{rating}</p>
              </div>
            </div>
          </div>
          <div className="middle-container">
            <div className="rating-container">
              <MdLocationOn className="icon-detail" />
              <p className="employment-type-detail">{location}</p>
              <BsFillBriefcaseFill className="icon-detail" />
              <p className="employment-type-detail">{employmentType}</p>
            </div>
            <p className="package-detail">{packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line-in-job-detail-item" />
          <div className="skills-container">
            <h1 className="job-detail-description-heading">Description</h1>
            <a className="visit-link" href={companyWebsiteUrl}>
              Visit <BiLinkExternal className="link-icon" />
            </a>
          </div>
          <p className="job-detail-description">{jobDescription}</p>
          <h1 className="skill-heading">Skills</h1>
          <div className="skills-container">
            {skills.map(eachSkill => {
              const {imageUrl, name} = eachSkill
              return (
                <div key={name} className="each-skill">
                  <img className="skill-logo" src={imageUrl} alt={name} />
                  <p className="skill-name">{name}</p>
                </div>
              )
            })}
          </div>
          <h1 className="skill-heading">Life at Company</h1>
          <div className="loader-container">
            <p className="life-at-company">{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="job-detail-description-heading">Similar Jobs</h1>
        <ul className="similar-job">
          {similarJobs.map(eachJob => (
            <li key={eachJob.id} className="list-style">
              <div className="similar-job-container">
                <div className="top-container">
                  <img
                    className="company-logo-job-description"
                    src={eachJob.companyLogoUrl}
                    alt="similar job company logo"
                  />
                  <div className="top-inner-container">
                    <h1 className="title-job">{eachJob.title}</h1>
                    <div className="rating-container">
                      <AiFillStar className="star" />
                      <p className="rating-job">{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="job-description-heading">Description</h1>
                <p className="job-description">{eachJob.jobDescription}</p>
                <div className="rating-container">
                  <MdLocationOn className="icon" />
                  <p className="employment-type">{eachJob.location}</p>
                  <BsFillBriefcaseFill className="icon" />
                  <p className="employment-type">{eachJob.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobItemFailure = () => {
    const onClickRetryInJobContainer = () => {
      this.setState(
        {apiJobItemStatus: apiStatusConstant.inProgress},
        this.getJobItemDetail,
      )
    }

    return (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button
          onClick={onClickRetryInJobContainer}
          type="button"
          className="logout-button"
        >
          Retry
        </button>
      </div>
    )
  }

  renderJobItemResult = () => {
    const {apiJobItemStatus} = this.state
    switch (apiJobItemStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.renderJobItemSuccess()
      case apiStatusConstant.failure:
        return this.renderJobItemFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobItemDetailContainer">
          {this.renderJobItemResult()}
        </div>
      </>
    )
  }
}

export default JobItemDetail
