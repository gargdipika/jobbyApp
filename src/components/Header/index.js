import {withRouter, Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  console.log(props)

  const onLogout = () => {
    const {history} = props
    console.log(history)
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="Header-container">
      <Link to="/jobs">
        <li className="list-style">
          <img
            className="logo-header"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </li>
      </Link>
      <ul className="header-uordered-list">
        <Link to="/" className="link-style">
          <li className="list-style">Home</li>
        </Link>
        <Link to="/jobs" className="link-style">
          <li className="list-style">Jobs</li>
        </Link>
      </ul>
      <button onClick={onLogout} className="logout-button" type="button">
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
