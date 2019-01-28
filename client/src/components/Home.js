import React, {Component} from 'react';
import {connect} from "react-redux";
import {signout} from "../actions/user";

class Home extends Component {

  componentWillMount() {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.user.status !== 'authenticated' || !nextProps.user.userId || nextProps.user.error) {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== prevProps.board) {
      this.props.history.push('/');
    }
  }

  render() {
    const {handleSignout} = this.props;
    return (
      <div className="col-9" id="main-content-left">
        <div id="starred-head">
          <p className="lead lead-modified">Starred</p>
          <hr/>
          <div id="starred-content">
            <div className="alert alert-light border rounded text-center" role="alert">
              When you star items, they will appear here.
            </div>
          </div>
        </div>
        <div id="recent-head" className="mt-5">
          <p className="lead lead-modified">Recent Activity</p>
          <hr/>
          <div id="recent-content">
            <div className="alert alert-light border rounded text-center" role="alert">
              Your recent activities will appear here.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
