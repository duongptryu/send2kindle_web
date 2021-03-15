import { Input, Button, Form, Select, Alert } from "antd";
import React from "react";
import {
  SearchOutlined,
  ArrowRightOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import "../../public/css/search_book.css";
import axios from "axios";
import config from "../../config";

const { Option } = Select;

class SearchBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      ext: "all",
      loading: 0,
      disabled: false
    };
    this.handleButtonSearch = this.handleButtonSearch.bind(this);
    this.searching = this.searching.bind(this);
    this.display = this.display.bind(this);
  }

  handleButtonSearch() {
    const input = document.getElementsByName("input_search")[0].value;
    const author = document.getElementsByName("author")[0].value;
    const year = document.getElementsByName("year")[0].value;
    const ext = this.state.ext;
    let data = {};
    if (input.trim().length === 0) {
      this.setState({
        message: "Please give us the title of book ",
        loading: 0,
        disabled: false
      });
    } else {
      data.title = input;
      data.author = author;
      data.year = year;
      data.ext = ext;

      let req =
        data.title +
        "?author=" +
        data.author +
        "&year=" +
        data.year +
        "&ext=" +
        data.ext;

      axios({
        method: "GET",
        url: config.API_URL + "search/" + req,
      })
        .then((res) => {
          this.props.searchHandle(res.data.result, data.title);
          this.setState({
            loading: 0,
            err: "",
            disabled: false
          });
        })
        .catch((err) => {
          this.props.searchHandle([], data.title);
          this.setState({
            message: "Error input, please try again",
            loading: 0,
            disabled: false
          });
        });
    }
  }

  searching() {
    if (this.state.loading === 0) {
      this.setState({
        loading: 1,
        disabled: true
      });
    } else {
      this.setState({
        loading: 0,
        disabled: false
      });
    }
  }

  display() {
    let ele = document.querySelector("#options");
    if (ele.className === "options") {
      ele.className = "options hide";
    } else {
      ele.className = "options";
    }
  }

  // componentDidUpdate() {
  //   if (this.state.loading === 0) {
  //     document.querySelectorAll("Input").forEach((input) => {
  //       input.setAttribute("disabled", "false");
  //     });
  //   }else{
  //     document.querySelectorAll("Input").forEach((input) => {
  //       input.setAttribute("disabled", "true");
  //     });
  //   }
  // }

  render() {
    const message = this.state.message;
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "50px", marginTop: "70px" }}>
          🆂🅴🅰🆁🅲🅷 🅰🅽🅳 🅶🅴🆃 🅱🅾🅾🅺
        </h1>
        {message && (
          <div
            style={{
              width: "50%",
              margin: "0 auto",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            <Alert message={message} type="warning" />
          </div>
        )}
        <Input
          name="input_search"
          size="large"
          placeholder="Input title book"
          className="input_search"
          prefix={<SearchOutlined />}
          pattern="[A-Za-z]"
          title="Invalid Input"
          disabled={this.state.disabled}
        />
        <div className="button_area">
          {this.state.loading === 0 && (
            <div>
              <Button
                size="large"
                type="primary"
                icon={<ArrowRightOutlined />}
                className="button"
                onClick={() => {
                  this.searching();
                  this.handleButtonSearch();
                }}
              >
                Search Book
              </Button>
              <Button
                size="large"
                type="secondary"
                icon={<BarsOutlined />}
                className="button"
                onClick={this.display}
              >
                Options
              </Button>
            </div>
          )}
          {this.state.loading === 1 && (
            <Button type="primary" size="large" loading>
              Finding
            </Button>
          )}
        </div>
        <div id="options" className="options hide">
          {/* <Alert message="Options" type="info" showIcon /> */}
          <h1>Options</h1>
          <div>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
            >
              <Form.Item label="Author: ">
                <Input placeholder="Input author's book" name="author" disabled={this.state.disabled}/>
              </Form.Item>
              <Form.Item label="Year: ">
                <Input placeholder="Input year's book" name="year" disabled={this.state.disabled}/>
              </Form.Item>
              <Form.Item label="Extension">
                <Select
                  defaultValue="all"
                  name="extension"
                  onChange={(e) => {
                    this.setState({ ext: e });
                  }}
                  disabled={this.state.disabled}
                >
                  <Option value="all">All</Option>
                  <Option value="pdf">Pdf</Option>
                  <Option value="epub">Epub</Option>
                  <Option value="mobi">Mobi</Option>
                  <Option value="djvu">Djvu</Option>
                  <Option value="chm">Chm</Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBook;
