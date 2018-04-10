import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import openSocket from 'socket.io-client';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: ''
    }
  }

  async componentDidMount() {
    const res = await axios.get('/filename');
    if (res.data) {
      console.log(res.data);
      this.socket = openSocket('http://localhost:8525');

      this.socket.emit('init', res.data);
      this.socket.on('newMarkdown', this.handleMarkdown.bind(this));
    }
  }

  handleMarkdown(markdown) {
    console.log('this', markdown);
    this.setState({
      markdown
    });
  }

  render() {
    return <ReactMarkdown source={this.state.markdown} />;
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
