import { Link } from "react-router-dom";
import { Menu, Layout } from "antd";
const { Header } = Layout;

function logout(){
  localStorage.removeItem('token')
  window.location.href="/"
}


function Nav_bar(props) {
  const isLogin = props.isLogin;
  return (
    <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
      <a href="/">
        <img
          src="https://play-lh.googleusercontent.com/48wwD4kfFSStoxwuwCIu6RdM2IeZmZKfb1ZeQkga0qEf1JKsiD-hK3Qf8qvxHL09lQ"
          height="60px"
          style={{ float: "left", margin: "0 20px 0 0" }}
          alt="logo"
        ></img>
        <div>
          <h1 style={{ float: "left", margin: "0 30% 0 0", color: "white" }}>
            {" "}
            🆂🅴🅽🅳2🅺🅸🅽🅳🅻🅴
          </h1>
        </div>
      </a>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
      <Menu.Item key="0" style={{ "margin-left": "20px" }}>
          <Link to="/guide">Guide</Link>
        </Menu.Item>
        <Menu.Item key="1" style={{ "margin-left": "20px" }}>
          <Link to="/upload">Upload File</Link>
        </Menu.Item>
        <Menu.Item key="2" style={{ "margin-left": "20px" }}>
          {" "}
          <Link to="/about">About</Link>
        </Menu.Item>
        <Menu.Item key="3" style={{ "margin-left": "20px" }}>
          <Link to="/viber-bot">Viber Bot</Link>
        </Menu.Item>
        {isLogin === false && (
          <Menu.Item key="4" style={{ "margin-left": "20px" }}>
            {" "}
            <Link to="/sign-up">Sign Up</Link>
          </Menu.Item>
        )}
        {isLogin === false && (
          <Menu.Item key="5" style={{ "margin-left": "20px" }}>
            <Link to="/sign-in">Sign In</Link>
          </Menu.Item>
        )}
        {isLogin === true && (
          <Menu.Item key="4" style={{ "margin-left": "20px" }}>
            {" "}
            <Link to="/user/profile">Profile</Link>
          </Menu.Item>
        )}
        {isLogin === true && (
          <Menu.Item key="5" style={{ "margin-left": "20px" }}>
            <Link onClick={()=>{logout()}}>Logout</Link>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
}

export default Nav_bar;
