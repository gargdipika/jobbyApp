import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: ''}

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
      Cookies.set('jwtToken', data.jwt_token)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwtToken')

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
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
