import React from "react";
import SearchBook from "./views/search_book";
import Result from "./views/result";
import Detail from "./views/detail";


class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      title: "",
      detail_status: 0,
      book_detail: {},
      detail_loading: 0,
      err: "",
    };
    this.searchHandle = this.searchHandle.bind(this);
    this.handleDetailClick = this.handleDetailClick.bind(this);
    this.backButton = this.backButton.bind(this);
    this.backToSearch = this.backToSearch.bind(this);
  }

  searchHandle(data, title) {
    this.setState({
      data: data,
      title: title,
      detail_status: 0
    })
  }

  handleDetailClick(id) {
    const data = this.state.data;
    const book = data.filter((book) => {
      return book.ID === id;
    });
    if (book) {
      this.setState({
        book_detail: book[0],
        detail_status: 1,
      });
    } else {
      this.setState({
        detail_status: 0,
      });
    }
  }

  backButton() {
    this.setState({
      detail_status: 0,
    });
  }

  backToSearch() {
    this.setState({
      data: [],
      title: "",
    });
  }

  handleGetButton(book_id){
    console.log(book_id)
  }

  render() {
    const data = this.state.data;
    const detail_status = this.state.detail_status;
    return (
      <div>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 650 }}
        >
          {detail_status === 1 && (
            <Detail
              book={this.state.book_detail}
              load={this.state.detail_loading}
              backButton={this.backButton}
              handleGetButton = {this.handleGetButton}
              user = {this.props.user}
            ></Detail>
          )}
          {data.length > 0 && detail_status === 0 && (
            <Result
              data={data}
              title={this.state.title}
              clickDetail={this.handleDetailClick}
              backButton={this.backToSearch}
              handleGetButton = {this.handleGetButton}
              user = {this.props.user}
            ></Result>
          )}
          {data.length === 0 && detail_status === 0 && (
            <SearchBook
              searchHandle={this.searchHandle}
            ></SearchBook>
          )}
        </div>
      </div>
    );
  }
}

export default Body;
