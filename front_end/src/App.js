import "./App.css";
import "antd/dist/antd.css";
import React from "react";
import Nav_bar from "./components/includes/nav";
import Footer_cus from "./components/includes/footer";
import Body from "./components/body";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


import UploadBook from "./components/views/upload_file";
import SignUp from "./components/views/sign_up";
import SignIn from "./components/views/sign_in";
import Detail from "./components/views/detail";
import About from "./components/views/about";
import Profile from "./components/views/profile";
import Guide from "./components/views/guide"
import config from "./config";
const axios = require("axios").default;

const { Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: "",
      isLogin: false,
      user: null
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token == null) {
      this.setState({
        isLogin: false,
      });
      return false;
    }
    axios({
      method: "GET",
      url: config.API_URL + config.API_VR +  "users/me",
      credentials: true,
      mode: "cors",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        this.setState({
          isLogin: true,
          user: { ...res.data },
        });
      })
      .catch((err) => {
        this.setState({
          isLogin: false,
          user: null,
        });
      });
  }

  logout() {
    localStorage.removeItem("token");
    this.setState({
      isLogin: false,
      user: null,
    });
    window.location.href = "/";
  }
  

  render() {
    return (
      <Router>
        <Layout style={{ background: "white" }}>
          <Nav_bar isLogin = {this.state.isLogin }></Nav_bar>
          <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64 }}
          >
            <Switch>
              <Route path="/about">
                <About></About>
              </Route>
              <Route path="/guide">
                <Guide></Guide>
              </Route>
              <Route path="/upload">
                <UploadBook user={this.state.user}></UploadBook>
              </Route>
              <Route path="/sign-in">
                <SignIn></SignIn>
              </Route>
              <Route path="/" exact>
                <Body user={this.state.user}></Body>
              </Route>
              <Route path="/sign-up">
                <SignUp handleRedirect={this.handleRedirect}></SignUp>
              </Route>
              <Route path="/detail">
                <Detail></Detail>
              </Route>
              <Route path="/user/profile">
                <Profile user={this.state.user}></Profile>
              </Route>
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <Footer_cus></Footer_cus>
          </Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
