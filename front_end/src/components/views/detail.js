import React from "react";
import { Row, Col, Button, Divider, Image, Modal, Input } from "antd";
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import config from "../../config";
const axios = require("axios").default;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      book: this.props.book,
      loading: this.props.loading,
      visible1: false,
      visible2: false,
      visible3: false,
      user: this.props.user,
      pop_loading: false,
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.getButton = this.getButton.bind(this)
  }

  componentDidMount() {
    const book = this.state.book;
    const book_mirror = book.Mirror_1;
    const book_id = book_mirror.split("/").pop();
    axios({
      method: "GET",
      url: config.API_URL + "detail/" + book_id,
    }).then((res) => {
      if (document.querySelector("#series")) {
        document.querySelector("#series").innerHTML = res.data.series;
        document.querySelector("#description").innerHTML = res.data.description;
      }
    });
  }

  getButton(book_id) {
    console.log(book_id)
    const kindle_mail = localStorage.getItem("kindle_mail");
    localStorage.setItem("book_id", book_id);
    if (this.state.user) {
      this.setState({
        visible1: true,
        visible2: false,
        visible3: false,
      });
    } else if (kindle_mail) {
      this.setState({
        visible1: false,
        visible2: true,
        visible3: false,
      });
    } else {
      this.setState({
        visible1: false,
        visible2: false,
        visible3: true,
      });
    }
  }

  handleClear() {
    localStorage.removeItem("kindle_mail")
    this.setState({
      visible1: false,
      visible2: false,
      visible3: true,
    });
  }

  handleOk = () => {
    this.setState({
      pop_loading: true,
    });
    const book_id = localStorage.getItem("book_id");
    if (book_id == null) {
      alert("Invalid book");
      this.setState({
        visible1: false,
        visible2: false,
        visible3: false,
      });
    }
    let kindle_mail = "";
    const user = this.state.user;
    const kindle_mail_local = localStorage.getItem("kindle_mail");
    if (user) {
      kindle_mail = user.kindle_mail;
    } else if (kindle_mail_local) {
      kindle_mail = kindle_mail_local;
    } else {
      const x = document.getElementsByName("kindle_mail");
      if (x.length > 0) {
        kindle_mail = x[0].value;
        localStorage.setItem("kindle_mail", kindle_mail);
      } else {
        alert("Please input your kindle mail");
        return false;
      }
    }
    axios({
      method: "GET",
      url:
        config.API_URL + "get-book/" + book_id + "?kindle_mail=" + kindle_mail,
    })
      .then((res) => {
        alert(res.data.detail);
        // console.log(res.data)
        this.setState({
          visible1: false,
          visible2: false,
          visible3: false,
          pop_loading: false,
        });
      })
      .catch((err) => {
        alert(err.response.data.detail);
        localStorage.removeItem("kindle_mail")
        this.setState({
          visible1: false,
          visible2: false,
          visible3: false,
          pop_loading: false,
        });
      });
  };

  handleCancel = () => {
    this.setState({ visible1: false, visible2: false, visible3: false, pop_loading: false });
  };

  render() {
    const book = this.state.book;
    const backButton = this.props.backButton;
    const visible1 = this.state.visible1;
    const visible2 = this.state.visible2;
    const visible3 = this.state.visible3;
    const user = this.state.user;
    const kindle_mail = localStorage.getItem("kindle_mail");
    return (
      <div>
        {/* ===================================================================== */}
        <div>
          <Modal
            visible={visible1}
            title="GET book to kindle"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button
                key="back"
                onClick={this.handleCancel}
                loading={this.state.pop_loading}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={this.handleOk}
                loading={this.state.pop_loading}
              >
                Submit
              </Button>,
            ]}
          >
            <b>
              NOTIFY: BEFORE GET BOOK, PLEASE COMPLETE SETUP THAT WE RECOMMEND
            </b>
            <p>
              We are will send this book to your kindle with kindle mail:{" "}
              {user && <strong>{user.kindle_mail}</strong>}
            </p>
            <p>
              If you want to change the kindle mail, please go to{" "}
              <strong>Profile -> Update information </strong>{" "}
            </p>
          </Modal>
        </div>
        {/* ===================================================================== */}
        {/* ===================================================================== */}
        <div>
          <Modal
            visible={visible2}
            title="GET book to kindle"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button
                key="back"
                onClick={this.handleClear}
                loading={this.state.pop_loading}
              >
                clear
              </Button>,
              <Button
                key="back"
                onClick={this.handleCancel}
                loading={this.state.pop_loading}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={this.handleOk}
                loading={this.state.pop_loading}
              >
                Submit
              </Button>,
            ]}
          >
            <b>
              NOTIFY: BEFORE GET BOOK, PLEASE COMPLETE SETUP THAT WE RECOMMEND
            </b>
            <p>
              We are will send this book to your kindle with kindle mail:{" "}
              <strong>{kindle_mail && kindle_mail}</strong>
            </p>
            <p>
              If you want to change the kindle mail, please click clear button
            </p>
          </Modal>
        </div>
        {/* ===================================================================== */}
        {/* ===================================================================== */}
        <div>
          <Modal
            visible={visible3}
            title="GET book to kindle"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button
                key="back"
                onClick={this.handleCancel}
                loading={this.state.pop_loading}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={this.handleOk}
                loading={this.state.pop_loading}
              >
                Submit
              </Button>,
            ]}
          >
            <strong>
              NOTIFY: BEFORE GET BOOK, PLEASE COMPLETE SETUP THAT WE RECOMMEND
            </strong>
            <p>Login to get book without input kindle mail</p>
            <p>Input your kindle mail</p>
            <Input
              size="large"
              placeholder="Input your kindle mail"
              title="Invalid Input"
              name="kindle_mail"
            />
          </Modal>
        </div>
        {/* ===================================================================== */}

        <div style={{ width: "70%", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "30px" }}>🅱🅾🅾🅺 - 🅳🅴🆃🅰🅸🅻</h1>
            <div style={{ position: "absolute" }}>
              <Button
                type="primary"
                shape="round"
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={backButton}
              >
                Come Back
              </Button>
            </div>
            <Button
              danger
              type="primary"
              shape="round"
              icon={<DownloadOutlined />}
              size="large"
              onClick = {() => {this.getButton(book.Mirror_1.split("/")[4])}}
            >
              GET To Your Kindle
            </Button>
          </div>
          <Divider orientation="left">Information</Divider>
          <Row>
            <Col span={12}>
              <div>
                <h1>
                  <b>Title: </b>
                  {book.Title}
                </h1>
                <h3>
                  <b>Author: </b>
                  {book.Author}
                </h3>
                <h3>
                  <b>Year:</b> {book.Year}
                </h3>
                <h3>
                  <b>Publisher:</b> {book.Publisher}
                </h3>
                <h3>
                  <b>Series: </b>
                  <span id="series"></span>
                </h3>
                <h3>
                  <b>Pages: </b>
                  {book.Pages}
                </h3>
                <h3>
                  <b>Extension: </b>
                  {book.Extension}
                </h3>
                <h3>
                  <b>Size: </b>
                  {book.Size}
                </h3>
              </div>
            </Col>
            <Col span={12}>
              <Image
                width={300}
                src={"http://covers.openlibrary.org/b/isbn/" + book.Isbn + "-L.jpg"}
                fallback="data:image/png;base64,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"
              />
            </Col>
          </Row>
          <Divider orientation="left">Description</Divider>
          <Row>
            <Col span={24}>
              <p id="description"></p>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Detail;
