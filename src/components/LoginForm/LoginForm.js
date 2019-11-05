import React, { Component } from 'react'
import TokenService from '../../services/token-service'
import AuthApiService from '../../services/auth-api-service'
import { Button, Input } from '../Utils/Utils'

export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => {}
  }

  state = { error: null }

  handleSubmitBasicAuth = ev => {
    ev.preventDefault()
    const { user_name, password } = ev.target

    // save TOKEN_KEY and token in local storage
    TokenService.saveAuthToken(
      // uses btoa() method to encode the user_name and password in base-64
      TokenService.makeBasicAuthToken(user_name.value, password.value)
    )

    user_name.value = ''
    password.value = ''
    this.props.onLoginSuccess()
  }

  handleSubmitJwtAuth = ev => {
    ev.preventDefault()
    this.setState({ error: null })
    const { user_name, password } = ev.target
    // makes a post request with the credentials to /api/auth/login endpoint
    // Q - user_name and password are being sent to the server as plain text?
    AuthApiService.postLogin({
      user_name: user_name.value,
      password: password.value,
    })
      .then(res => {
        user_name.value = ''
        password.value = ''
        // if successful, receives a JWT as a response then saves to local storage
        TokenService.saveAuthToken(res.authToken)
        this.props.onLoginSuccess()
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  render() {
    const { error } = this.state
    return (
      <form
        className='LoginForm'
        onSubmit={this.handleSubmitJwtAuth}
      >
        <div role='alert'>
          {error && <p className='red'>{error}</p>}
        </div>
        <div className='user_name'>
          <label htmlFor='LoginForm__user_name'>
            User name
          </label>
          {/* form inputs and button are functional components inside Utils.js */}
          <Input
            required
            name='user_name'
            id='LoginForm__user_name'>
          </Input>
        </div>
        <div className='password'>
          <label htmlFor='LoginForm__password'>
            Password
          </label>
          <Input
            required
            name='password'
            type='password'
            id='LoginForm__password'>
          </Input>
        </div>
        <Button type='submit'>
          Login
        </Button>
      </form>
    )
  }
}
