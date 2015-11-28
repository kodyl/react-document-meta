import React from 'react';
import Root from './root';
import Nested from './nested';

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <Nested />
      </Root>
    );
  }
}
