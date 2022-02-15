import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    apiProfileStatus: apiStatusConstant.initial,
    employmentType: [],
    minPackage: '',
    searchInput: '',
    searchInputQueryParameter: '',
    apiJobDetailStatus: apiStatusConstant.initial,
    jobData: [],
  }

  componentDidMount = () => {
    this.getProfileData()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiJobDetailStatus: apiStatusConstant.inProgress})
    const {employmentType, minPackage, searchInputQueryParameter} = this.state
    console.log(employmentType)
    const employmentString = employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiJobUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentString}&minimum_package=${minPackage}&search=${searchInputQueryParameter}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJob = await fetch(apiJobUrl, options)
    if (responseJob.ok) {
      const jobData = await responseJob.json()
      const updatedData = jobData.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        apiJobDetailStatus: apiStatusConstant.success,
        jobData: updatedData,
      })
    } else {
      this.setState({apiJobDetailStatus: apiStatusConstant.failure})
    }
  }

  renderJobDetail = () => {
    const {apiJobDetailStatus} = this.state

    switch (apiJobDetailStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.renderJobDataSuccess()
      case apiStatusConstant.failure:
        return this.renderFailureJobData()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchInput} = this.state
    this.setState({searchInputQueryParameter: searchInput}, this.getJobDetails)
  }

  renderJobDataSuccess = () => {
    const {jobData} = this.state
    const isEmpty = jobData.length === 0

    return (
      <>
        {isEmpty ? (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        ) : (
          <ul className="job-container">
            {jobData.map(eachJobDetail => {
              const {
                companyLogoUrl,
                employmentType,
                id,
                jobDescription,
                location,
                packagePerAnnum,
                rating,
                title,
              } = eachJobDetail
              return (
                <Link key={id} to={`/jobs/${id}`} className="link-style">
                  <li className="list-style">
                    <div className="job-data-success-container">
                      <div className="top-container">
                        <img
                          className="company-logo-job-description"
                          src={companyLogoUrl}
                          alt="company logo"
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
                          <MdLocationOn className="icon" />
                          <p className="employment-type">{location}</p>
                          <BsFillBriefcaseFill className="icon" />
                          <p className="employment-type">{employmentType}</p>
                        </div>
                        <p className="package">{packagePerAnnum}</p>
                      </div>
                      <hr className="horizontal-line-in-job-item" />
                      <h1 className="job-description-heading">Description</h1>
                      <p className="job-description">{jobDescription}</p>
                    </div>
                  </li>
                </Link>
              )
            })}
          </ul>
        )}
      </>
    )
  }
  // styling of job-failure-container is similar to no-job-container

  renderFailureJobData = () => {
    const onClickRetryInJobContainer = () => {
      this.setState(
        {apiJobDetailStatus: apiStatusConstant.inProgress},
        this.getJobDetails,
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

  getProfileData = async () => {
    this.setState({apiProfileStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const updatedData = {
      profileImageUrl: data.profile_details.profile_image_url,
      name: data.profile_details.name,
      shortBio: data.profile_details.short_bio,
    }
    if (response.ok) {
      this.setState({
        profileData: updatedData,
        apiProfileStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstant.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccess = () => {
    const {profileData} = this.state
    const {profileImageUrl, name, shortBio} = profileData

    return (
      <div className="profile-container">
        <img className="profile-image" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => {
    const onClickRetry = () => {
      this.setState(
        {apiProfileStatus: apiStatusConstant.inProgress},
        this.getProfileData,
      )
    }
    return (
      <div className="failure-container">
        <button className="logout-button" onClick={onClickRetry} type="button">
          Retry
        </button>
      </div>
    )
  }

  renderProfile = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.renderProfileSuccess()
      case apiStatusConstant.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div className="jobs-container">
          <div className="left-job-container">
            {this.renderProfile()}
            <hr className="horizontal-line" />
            <ul className="employment-unordered-list">
              <h1 className="employment-heading">Type of Employment</h1>
              {employmentTypesList.map(eachEmployee => {
                const onClickEmployee = () => {
                  const {employmentType} = this.state
                  console.log('run')
                  if (
                    employmentType.includes(eachEmployee.employmentTypeId) ===
                    false
                  ) {
                    this.setState(
                      prevState => ({
                        employmentType: [
                          ...prevState.employmentType,
                          eachEmployee.employmentTypeId,
                        ],
                      }),
                      this.getJobDetails,
                    )
                  } else {
                    this.setState(
                      prevState => ({
                        employmentType: prevState.employmentType.filter(
                          eachType =>
                            eachType !== eachEmployee.employmentTypeId,
                        ),
                      }),
                      this.getJobDetails,
                    )
                  }
                }

                return (
                  <li
                    key={eachEmployee.employmentTypeId}
                    className="list-style employment"
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={`checkbox ${eachEmployee.employmentTypeId}`}
                      value={eachEmployee.employmentTypeId}
                      onClick={onClickEmployee}
                    />
                    <label
                      htmlFor={`checkbox ${eachEmployee.employmentTypeId}`}
                    >
                      {eachEmployee.label}
                    </label>
                  </li>
                )
              })}
            </ul>
            <hr className="horizontal-line" />
            <ul className="employment-unordered-list">
              <h1 className="employment-heading">Salary Range</h1>
              {salaryRangesList.map(eachSalaryRange => {
                const onClickSalary = () => {
                  this.setState(
                    {minPackage: eachSalaryRange.salaryRangeId},
                    this.getJobDetails,
                  )
                }

                return (
                  <li
                    key={eachSalaryRange.salaryRangeId}
                    className="list-style employment"
                  >
                    <input
                      type="radio"
                      className="checkbox"
                      id={`radio ${eachSalaryRange.salaryRangeId}`}
                      name="salary"
                      value={eachSalaryRange.salaryRangeId}
                      onClick={onClickSalary}
                    />
                    <label htmlFor={`radio ${eachSalaryRange.salaryRangeId}`}>
                      {eachSalaryRange.label}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <div className="search-container">
              <input
                className="search-bar"
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                className="button-search"
                type="button"
                testid="searchButton"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobDetail()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
