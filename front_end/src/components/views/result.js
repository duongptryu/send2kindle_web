import React from "react";
import { Select, Button, Card, Row, Col, Divider, Modal, Input } from "antd";
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../../config";
const style = { padding: "8px 0" };

const { Meta } = Card;
const { Option } = Select;

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      title: this.props.title,
      visible1: false,
      visible2: false,
      visible3: false,
      user: this.props.user,
      loading: false,
    };
    this.backup_data = this.props.data;
    this.getExtension = this.getExtension.bind(this);
    this.handleExtChange = this.handleExtChange.bind(this);
    this.getButton = this.getButton.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  getExtension(data) {
    if (data.length === 0) {
      return [];
    }
    const extensions = [
      "pdf",
      "mobi",
      "epub",
      "zip",
      "rar",
      "chm",
      "djvu",
      "swe",
    ];
    let ext_search = ["all"];
    data.forEach((book) => {
      if (
        extensions.includes(book.Extension) &&
        !ext_search.includes(book.Extension)
      ) {
        ext_search.push(book.Extension);
      }
    });
    return ext_search;
  }

  handleExtChange(e) {
    const data = [...this.backup_data];
    if (e === "all") {
      this.setState({
        data: data,
      });
    } else {
      const new_data = data.filter((book) => {
        return book.Extension === e;
      });
      this.setState({
        data: new_data,
      });
    }
  }

  getButton(book_id) {
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

  handleClear(){
    localStorage.removeItem("kindle_mail")
    this.setState({
      visible1: false,
      visible2: false,
      visible3: true
    })
  }

  handleOk = () => {
    this.setState({
      loading: true
    })
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
        localStorage.setItem("kindle_mail", kindle_mail)
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
        alert(res.data.detail)
        this.setState({
          visible1: false,
          visible2: false,
          visible3: false,
          loading: false
        });
      })
      .catch((err) => {
        alert(err.response.data.detail)
        localStorage.removeItem("kindle_mail")
        this.setState({
          visible1: false,
          visible2: false,
          visible3: false,
          loading: false
        });
      });
  };

  handleCancel = () => {
    this.setState({ visible1: false, visible2: false, visible3: false });
  };

  render() {
    let extensions = []
    let data = this.state.data
    let title = ""
    if(Array.isArray(this.state.data)){
      extensions = this.getExtension(this.backup_data);
      title = this.state.title;
    }
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
              <Button key="back" onClick={this.handleCancel} loading={this.state.loading}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk} loading={this.state.loading}>
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
              <Button key="back" onClick={this.handleClear} loading={this.state.loading}>
                clear
              </Button>,
              <Button key="back" onClick={this.handleCancel} loading={this.state.loading}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk} loading={this.state.loading}>
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
              <Button key="back" onClick={this.handleCancel} loading={this.state.loading} >
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk} loading={this.state.loading}>
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

        <div style={{ textAlign: "center" }}>
          <div style={{ position: "absolute", left: "18%" }}>
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
          <h1 style={{ fontSize: "30px" }}>🆁🅴🆂🆄🅻🆃 - 🅵🅾🆁 - 🆂🅴🅰🆁🅲🅷</h1>
          <h1>{title}</h1>
        </div>
        {data === "not found" && (
          <h1 style={{ width: "70%", margin: "0 auto" }}>Data not found</h1>
        )}
        {Array.isArray(data) && (
          <div style={{ width: "70%", margin: "0 auto" }}>
            <div>
              <h3 style={{ float: "left" }}>🅴🆇🆃🅴🅽🆂🅸🅾🅽: </h3>
            </div>
            <div style={{ float: "clear", marginBottom: "10px" }}>
              <Select
                defaultValue="all"
                style={{ width: 80 }}
                onChange={this.handleExtChange}
              >
                {extensions.length > 0 &&
                  extensions.map((ext, index) => {
                    return <Option value={ext}>{ext}</Option>;
                  })}
              </Select>
            </div>
            <Divider orientation="left">Result</Divider>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {data.length > 0 &&
                data.map((book, index) => {
                  return (
                    <Col className="gutter-row" span={8}>
                      <div style={style}>
                        <Card
                          hoverable
                          cover={
                            <img
                              alt="example"
                              src=""
                              src={"http://covers.openlibrary.org/b/isbn/" + book.Isbn + "-L.jpg"}
                              style={{ height: "250px" }}
                              onClick={() => {
                                this.props.clickDetail(book.ID);
                              }}
                            />
                          }
                          style={{ borderRadius: "10px" }}
                        >
                          <Meta title={book.Title} />
                          <br></br>
                          <p
                            style={{
                              marginBottom: "0px",
                              paddingBottom: "0px",
                            }}
                          >
                            {" "}
                            <b>Author: </b>{" "}
                          </p>
                          <Meta
                            title={book.Author}
                            onClick={() => {
                              this.props.clickDetail(book.ID);
                            }}
                          />
                          <p style={{ marginTop: "15px" }}>
                            {" "}
                            <b>Size:</b> {book.Size}
                          </p>
                          <p>
                            <b>Extension:</b> {book.Extension}
                          </p>

                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            style={{ marginLeft: "40px" }}
                            onClick={() => {
                              this.getButton(book.Mirror_1.split("/")[4]);
                            }}
                          >
                            GET To Your Kindle
                          </Button>
                        </Card>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </div>
        )}
      </div>
    );
  }
}

export default Result;
