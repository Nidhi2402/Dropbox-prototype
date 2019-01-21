import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Header from './components/Header';

import App from './components/App';
import User from './components/User';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Header}/>
    <Route path="login" component={User}/>
    <Route path="header" component={Header}/>
  </Route>
);
