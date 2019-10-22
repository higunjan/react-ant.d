import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import { push } from 'connected-react-router';
import Home from '../home/home-component';
import Login from '../auth/login/login-component';
import Dashboard from '../dashboard/dashboard-component';

class App extends Component {
  render() {
    return (
      <div>
        <main>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </main>
      </div>
    );
  }
}


export default App
