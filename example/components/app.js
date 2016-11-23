import React from 'react';
import Root from './root';
import PageOne from './page-one';
import PageTwo from './page-two';

const pages = [PageOne, PageTwo];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: null
    };
  }

  changePage(page) {
    this.setState({ page });
  }

  render() {
    const Page = typeof this.state.page === 'number' && pages[ this.state.page ];

    return (
      <Root>
        { Page ? <Page /> : <h2>We are at the root</h2> }
        <hr />
        <button onClick={() => this.changePage(null)}>Root</button>
        <button onClick={() => this.changePage(0)}>Page 1</button>
        <button onClick={() => this.changePage(1)}>Page 2</button>
      </Root>
    );
  }
}
