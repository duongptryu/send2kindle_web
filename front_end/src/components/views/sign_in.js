import React from "react";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import { Redirect } from "react-router";
import config from "../../config";
const axios = require("axios").default;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: "",
      redirect: "",
      loading: false,
    };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleSignIn(e) {
    this.setState({
      loading: true,
    });
    if (e.email.length === 0 || e.password.length === 0) {
      return false;
    }
    const formData = new FormData();
    formData.append("username", e.email);
    formData.append("password", e.password);

    axios({
      method: "POST",
      url: config.API_URL + "sign-in",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    })
      .then((res) => {

        alert("Sign In successful");
        localStorage.setItem("token", res.data.access_token);
        this.setState({
          err: "",
          loading: false,
        });
        window.location.href="/"
        
      })
      .catch((err) => {
        this.setState({ err: err.response.data.detail, loading: false });
      });
  }

  render() {
    const err = this.state.err;
    const redirect = this.state.redirect;
    if (redirect.length > 0) {
      return <Redirect to={redirect} />;
    }
    return (
      <div style={{ textAlign: "center", height: "76vh" }}>
        <h1
          style={{
            fontSize: "80px",
            marginTop: "50px",
          }}
        >
          🆂🅸🅶🅽 - 🅸🅽
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
            onFinish={this.handleSignIn}
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
              <Input style={{ width: "95%", marginLeft: "5%" }} />
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
              <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="Sign In"
                size="large"
                loading={this.state.loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignIn;
