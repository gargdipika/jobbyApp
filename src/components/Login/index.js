import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  loginToTheJobby = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userData = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const {history} = this.props
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      history.replace('/')
    } else {
      const errorMsg = data.error_msg
      console.log(errorMsg)
      this.setState({errorMsg})
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const isShowErr = errorMsg !== ''
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    console.log(jwtToken)
    return (
      <div className="login-page-background">
        <form className="login-form" onSubmit={this.loginToTheJobby}>
          <img
            className="login-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <div className="login-input-container">
            <label className="label-element" htmlFor="username">
              USERNAME
            </label>
            <input
              className="input-element"
              onChange={this.onChangeUsername}
              type="text"
              id="username"
              placeholder="Username"
              value={username}
            />
          </div>
          <div className="login-input-container">
            <label className="label-element" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="input-element"
              onChange={this.onChangePassword}
              type="password"
              id="password"
              placeholder="Password"
              value={password}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {isShowErr && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
