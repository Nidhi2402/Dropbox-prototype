import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Home from './components/Home';

import App from './components/App';
import Board from './components/Board';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Board}/>
    <Route path="login" component={Board}/>
    <Route path="header" component={Home}/>
  </Route>
);
