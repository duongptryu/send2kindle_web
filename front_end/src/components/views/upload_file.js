import { Button, Upload, message, Input, Modal } from "antd";
import { UploadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import config from "../../config";
import React from "react";
import axios from "axios";

class UploadBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      visible1: false,
      visible2: false,
      visible3: false,
      user: this.props.user,
      pop_loading: false,
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.getButton = this.getButton.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  getButton() {
    const kindle_mail = localStorage.getItem("kindle_mail");
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
    localStorage.removeItem("kindle_mail");
    this.setState({
      visible1: false,
      visible2: false,
      visible3: true,
    });
  }

  handleCancel = () => {
    this.setState({
      visible1: false,
      visible2: false,
      visible3: false,
      pop_loading: false,
    });
  };

  handleUpload = () => {
    this.setState({
      pop_loading: true,
    });
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
    const { fileList } = this.state;
    const formData = new FormData();
    formData.append("kindle_mail", kindle_mail);
    fileList.forEach((file) => {
      formData.append("file", file);
    });
    // You can use any AJAX library you like
    axios({
      url: config.API_URL + "upload-file",
      method: "post",
      processData: false,
      data: formData,
    })
      .then((res) => {
        this.setState({
          fileList: [],
          visible1: false,
          visible2: false,
          visible3: false,
          pop_loading: false,
        });
        message.success(res.data.detail);
      })
      .catch((err) => {
        this.setState({
          visible1: false,
          visible2: false,
          visible3: false,
          pop_loading: false,
        });
        if (err.response.status === 422) {
          alert("Fail request, please try again later");
          return false;
        }
        message.error(err.response.data.detail);
      });
  };

  render() {
    const visible1 = this.state.visible1;
    const visible2 = this.state.visible2;
    const visible3 = this.state.visible3;
    const user = this.state.user;
    const kindle_mail = localStorage.getItem("kindle_mail");

    const { uploading, fileList } = this.state;
    const props = {
      onRemove: (file) => {
        message.success(`${file.name} file removed successfully`);
        this.setState({
          fileList: [],
        });
      },
      beforeUpload: (file) => {
        const split = file.name.split(".");
        const ext = split[split.length - 1];
        if (!config.EXT_LIST.includes(ext)) {
          message.success(`Error Extension`);
          return false;
        }
        message.success(`${file.name} file uploaded successfully`);
        this.setState({
          fileList: [file],
        });
        return false;
      },
      fileList,
    };
    return (
      <div style={{ height: "74vh" }}>
        {/* ===================================================================== */}
        <div>
          <Modal
            visible={visible1}
            title="GET book to kindle"
            onOk={this.handleUpload}
            onCancel={this.handleCancel}
            footer={[
              <Button
                onClick={this.handleCancel}
                loading={this.state.pop_loading}
              >
                Cancel
              </Button>,
              <Button
                type="primary"
                onClick={this.handleUpload}
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
            onOk={this.handleUpload}
            onCancel={this.handleCancel}
            footer={[
              <Button
                onClick={this.handleClear}
                loading={this.state.pop_loading}
              >
                clear
              </Button>,
              <Button
                onClick={this.handleCancel}
                loading={this.state.pop_loading}
              >
                Cancel
              </Button>,
              <Button
                type="primary"
                onClick={this.handleUpload}
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
            onOk={this.handleUpload}
            onCancel={this.handleCancel}
            footer={[
              <Button
                onClick={this.handleCancel}
                loading={this.state.pop_loading}
              >
                Cancel
              </Button>,
              <Button
                type="primary"
                onClick={this.handleUpload}
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
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "50px", marginTop: "70px" }}>
            🆄🅿🅻🅾🅰🅳 - 🆈🅾🆄🆁 - 🅵🅸🅻🅴
          </h1>
          <Upload {...props} maxCount={1}>
            <Button size="large" icon={<UploadOutlined />}>
              Click to Upload
            </Button>
          </Upload>
          ,
          <div>
            <Button
              size="large"
              type="primary"
              icon={<ArrowRightOutlined />}
              loading={this.state.pop_loading}
              onClick={this.getButton}
              disabled={fileList.length === 0}
            >
              {uploading ? "Uploading" : "Start Upload"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadBook;
