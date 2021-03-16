import React from "react";
import { Form, Input, Button, Alert } from "antd";
import config from "../../config";
import { Redirect } from "react-router";
const axios = require("axios").default;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: "",
      loading: false,
      redirect:""
    };
    this.handleRedirect = this.handleRedirect.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleRedirect(link){
    this.setState({
      redirect: link
    })
  }

  handleSignUp(e) {
    this.setState({
      err:"",
      loading: true,
    });
    if (
      e.email.length === 0 ||
      e.kindle_mail.length === 0 ||
      e.password.length === 0 ||
      e.repeat_password.length === 0
    ) {
      return false;
    }
    if (e.password !== e.repeat_password) {
      this.setState({
        err: "Password and Repeat password not correct",
        loading: false,
      });
      return false;
    }
    axios({
      method: "POST",
      url: config.API_URL + config.API_VR + "sign-up",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      data: e,
    })
      .then((res) => {
        alert("Register successful")
        this.setState({
          err:"",
          loading: false,
          redirect: "/sign-in"
        })
      })
      .catch((err) => {
        this.setState({ err: err.response.data.detail, loading: false });
      });
  }

  render() {
    const handleSignUp = this.handleSignUp;
    const redirect = this.state.redirect
    if(redirect.length > 0){
      return <Redirect to={redirect}  />
    }
    const err = this.state.err;
    const loading = this.state.loading
    return (
      <div style={{ textAlign: "center", height:"76vh" }}>
        <h1
          style={{
            fontSize: "80px",
            marginTop: "50px",
          }}
        >
          🆂🅸🅶🅽 - 🆄🅿
        </h1>
        <div style={{ width: "50%", margin: "0 auto" }}>
          {err.length > 0 && <Alert message={err} type="warning" />}
        </div>
        <div
          style={{
            width: "40%",
            margin: "0 auto",
            marginTop: "30px",
            paddingTop: "30px",
            borderTop: "2px solid gray",
          }}
        >
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={handleSignUp}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input style={{ width: "83%", marginLeft: "16%" }} />
            </Form.Item>
            <Form.Item
              label="Kindle Mail"
              name="kindle_mail"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your kindle mail!",
                },
              ]}
            >
              <Input style={{ width: "90%", marginLeft: "10%" }} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password style={{ width: "88%", marginLeft: "12%" }} />
            </Form.Item>
            <Form.Item
              label="Repeat Password"
              name="repeat_password"
              rules={[
                {
                  required: true,
                  message: "Please input repeat your password!",
                },
              ]}
            >
              <Input.Password style={{ width: "98%", marginLeft: "2%" }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="Sign Up"
                onSubmit={handleSignUp}
                loading={loading}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignUp;
