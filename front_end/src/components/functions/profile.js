import React from "react";
import { Divider, Form, Input, Button, Modal, message } from "antd";
import { Redirect } from "react-router";
import axios from "axios";
import config from "../../config";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      visible_kindle: false,
      visible_password: false,
    };
    this.showModal_kindle = this.showModal_kindle.bind(this);
    this.showModal_password = this.showModal_password.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk_kindle = this.handleOk_kindle.bind(this);
    this.handleOk_password = this.handleOk_password.bind(this);
  }

  showModal_kindle = (e) => {
    this.setState({
      visible_kindle: true,
      visible_password: false,
    });
  };
  showModal_password = (e) => {
    this.setState({
      visible_password: true,
      visible_kindle: false,
    });
  };

  handleOk_kindle = (e) => {
    const kindle_mail = document.getElementsByName("kindle_mail")[0].value;
    const password = document.getElementsByName("password_kindle")[0].value;
    if (kindle_mail.length === 0 || password.length === 0) {
      return false;
    }
    const user = this.state.user;
    const data = {
      email: user.email,
      kindle_mail: kindle_mail,
      password: password,
    };
    const token = localStorage.getItem("token");
    if (token == null) {
      return false;
    }
    axios({
      method: "POST",
      url: config.API_URL + "user/update-kindle-mail",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    })
      .then((res) => {
        this.setState({
          loading: false,
          visible_kindle: false,
          visible_password: false,
        });
        message.success("Update successful");
        window.location.href = "/user/profile";
      })
      .catch((err) => {
        this.setState({
          loading: false,
          visible_kindle: false,
          visible_password: false,
        });
        message.error(err.response.data.detail);
      });
  };

  handleOk_password = (e) => {
    const old_password = document.getElementsByName("old_password")[0].value;
    const new_password = document.getElementsByName("new_password")[0].value;
    if (old_password.length === 0 || new_password.length === 0) {
      return false;
    }
    const user = this.state.user;
    const data = {
      email: user.email,
      password: old_password,
      new_password: new_password,
    };
    const token = localStorage.getItem("token");
    if (token == null) {
      return false;
    }
    axios({
      method: "POST",
      url: config.API_URL + "user/update-password",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    })
      .then((res) => {
        this.setState({
          loading: false,
          visible_kindle: false,
          visible_password: false,
        });
        message.success("Update successful");
        localStorage.removeItem("token");
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err.response.data.detail);
        message.error(err.response.data.detail);
        this.setState({
          loading: false,
          visible_kindle: false,
          visible_password: false,
        });
      });
  };

  handleCancel = () => {
    this.setState({
      visible_password: false,
      visible_kindle: false,
    });
  };

  render() {
    let user = {};
    if (this.state.user == null) {
      this.setState({
        user: {
          email: "",
          kindle_mail: "",
          password: "",
        },
      });
      // return (<Redirect to="/" />)
    } else {
      user = this.state.user;
    }

    return (
      <div style={{ width: "70%", margin: "0 auto", height: "83vh" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "50px" }}>🅿🆁🅾🅵🅸🅻🅴</h1>
        </div>
        <Divider orientation="left">Information</Divider>
        <div
          style={{
            width: "40%",
            margin: "0 auto",
            marginTop: "30px",
            paddingTop: "30px",
          }}
        >
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
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
              <Input
                style={{ width: "83%", marginLeft: "16%" }}
                defaultValue={user.email}
                disabled={true}
              />
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
              <Input
                style={{ width: "94%", marginLeft: "6%" }}
                defaultValue={user.kindle_mail}
                disabled={true}
              />
            </Form.Item>
            <Button
              type="primary"
              size="large"
              key="kindle_mail"
              onClick={this.showModal_kindle}
              style={{ marginRight: "20px" }}
              id="kindle_mail"
            >
              Update Kindle Mail
            </Button>
            <Modal
              visible={this.state.visible_kindle}
              title="Update your kindle mail"
              onOk={this.handleOk_kindle}
              onCancel={this.handleCancel}
              footer={[
                <Button
                  key="back"
                  onClick={this.handleCancel}
                  loading={this.state.loading}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={this.handleOk_kindle}
                  loading={this.state.loading}
                >
                  Update
                </Button>,
              ]}
            >
              <strong>Input your new kindle mail</strong>

              <Input
                size="large"
                placeholder="Input your kindle mail"
                title="Invalid Input"
                name="kindle_mail"
                role={[
                  {
                    type: "email",
                    required: true,
                    message: "Please input your kindle mail!",
                  },
                ]}
              />

              <strong>Input your password</strong>

              <Input
                size="large"
                placeholder="Input your old password mail"
                title="Invalid Input"
                name="password_kindle"
                role={[
                  {
                    type: "password",
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              />
            </Modal>

            <Button
              type="primary"
              size="large"
              name="password"
              onClick={this.showModal_password}
            >
              Change Password
            </Button>
            <Modal
              visible={this.state.visible_password}
              title="Update your password"
              onOk={this.handleOk_kindle}
              onCancel={this.handleCancel}
              footer={[
                <Button
                  key="back"
                  onClick={this.handleCancel}
                  loading={this.state.loading}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={this.handleOk_password}
                  loading={this.state.loading}
                >
                  Update
                </Button>,
              ]}
            >
              <strong>Input your old password</strong>

              <Input
                size="large"
                placeholder="Input your new password"
                title="Invalid Input"
                name="old_password"
                role={[
                  {
                    type: "password",
                    required: true,
                    message: "Please input your old password",
                  },
                ]}
              />

              <strong>Input your new password</strong>

              <Input
                size="large"
                placeholder="Input your kindle mail"
                title="Invalid Input"
                name="new_password"
                role={[
                  {
                    type: "password",
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              />
            </Modal>
          </Form>
        </div>
      </div>
    );
  }
}

export default Profile;
