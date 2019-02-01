import React, {Component} from 'react';
import {connect} from "react-redux";
import {
  starFile, downloadFile, deleteFile, getDirectories, getFiles, getStarredFiles, getStarredDirectories, getActivities, createShareLink,
  shareFile,
} from "../actions/content";
import {changePath} from "../actions/board";

class File extends Component {

  state = {
    sharers: '',
  };

  componentWillMount() {
    this.setState({
      sharers: '',
    });
    console.log('1');
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.user.status !== 'authenticated' || !nextProps.user.userId || nextProps.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== nextProps.board) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== prevProps.board) {
      this.props.history.push('/');
    } else if (this.props.content.alert !== prevProps.content.alert) {
      if(this.props.board.toLoad !== 'files') {
        this.props.handleGetStarredFiles();
        this.props.handleGetStarredDirectories();
        this.props.handleGetActivities(5);
      } else{
        let path = this.props.board.currentPath;
        this.props.handleGetFiles(path);
        this.props.handleGetDirectories(path);
      }
      }
    }

  render() {
  const {key, file, handleStarFile, handleDownloadFile, handleDeleteFile, handleCreateShareLink, handleFileShare} = this.props;
  console.log(this.state.id);
  return (
    <div>
      <div className="file-div clearfix">
        <i
          className="material-icons file-icon">insert_drive_file</i><span>&nbsp;&nbsp;{file.name}&nbsp;&nbsp;</span><span
        className="float-right">{file.shared ?
        <i className="material-icons share-icon text-secondary">supervisor_account</i> : ''}&nbsp;&nbsp;&nbsp;&nbsp;<a
        href=""><i className="material-icons star-icon text-primary" onClick={(e) => {
        e.preventDefault();
        handleStarFile({
          id: file.id,
          starred: !file.starred,
        });
        if (!this.props.content.error) {
          file.starred = !file.starred
        }
      }}>{file.starred ? 'star' : 'star_border'}</i></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a className="btn btn-light btn-sm share-btn" href="" role="button" data-toggle="modal"
           data-target={"#" + file.id}>Share</a>&nbsp;&nbsp;&nbsp;&nbsp;

        <div className="modal center fade mh-75" id={file.id} tabIndex="-1" role="dialog"
             aria-labelledby="share-modal-label" aria-hidden="true">
              <div className="modal-dialog" role="document">
              <div className="modal-content">
               <div className="modal-header">

               <input type="text" className="form-control" placeholder="To: ',' separated emails" autoFocus
                      onChange={(e) => {
                        this.setState({
                          ...this.state,
                          sharers: e.target.value,
                        });
                      }
                      }/>

               </div>
              <div className="modal-body">
                {file.link ?
                  <input type="text" className="form-control form-control-sm" value={file.link || ''} readOnly/> : ''}
                {file.link ?
                  <span><i className="material-icons text-secondary float-left">link</i><p
                    className="lead lead-modified float-left"><strong>Anyone</strong> with this <strong>link</strong> can download this file.</p></span> :
                  <span><i className="material-icons text-secondary float-left">link</i><p
                    className="lead lead-modified float-left"><strong>No</strong> link created yet.</p><p
                    className="lead lead-modified float-right"><a href="" data-dismiss="modal" onClick={(e) => {
                    e.preventDefault();
                    handleCreateShareLink(file.id);
                    if (!this.props.content.error) {
                      file.link = this.props.content.alert;
                    }
                  }}>Create</a> a shareable link.</p></span>}
              </div>
              <div className="modal-footer">
             <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
               <button type="button" className="btn btn-primary btn-sm" data-dismiss="modal" onClick={(e) => {
                 let sharers = this.state.sharers.split(',');
                 handleFileShare({
                   id: file.id,
                   name: file.name,
                   path: file.path,
                   owner: file.owner,
                   sharers: sharers,
                 });
               }}>Share</button>
              </div>
               </div>
              </div>
            </div>
            <span className="dropdown show clearfix">
                          <a className="btn text-center option-icon-btn" href="" role="button"
                             data-toggle="dropdown"
                             aria-haspopup="true" aria-expanded="false">
                            <i className="material-icons option-icon text-secondary">more_horiz</i>
                          </a>

                          <span className="dropdown-menu dropdown-menu-right mt-2">
                            <a className="dropdown-item" href="" onClick={(e) => {
                              e.preventDefault();
                              handleDownloadFile({
                                name: file.name,
                                path: file.path,
                                userId: file.owner,
                              });
                            }}>Download</a>
                            <a className="dropdown-item" href="" onClick={(e) => {
                              e.preventDefault();
                              handleDeleteFile({
                                name: file.name,
                                path: file.path,
                                id: file.id,
                              });
                              if (!this.props.content.error) {
                                this.props.content.files.splice(key, 1);
                              }
                            }}>Delete</a>
                          </span>
                        </span>
                        </span>
      </div>
      <hr/>
    </div>
  );
}


function mapDispatchToProps(dispatch) {
  return {
    handleDownloadFile: (data) => dispatch(downloadFile(data)),
    handleStarFile: (data) => dispatch(starFile(data)),
    handleDeleteFile: (data) => dispatch(deleteFile(data)),
    handleGetFiles: (path) => dispatch(getFiles(path)),
    handleGetDirectories: (path) => dispatch(getDirectories(path)),
    handleChangePath: (path) => dispatch(changePath(path)),
    handleGetStarredFiles: () => dispatch(getStarredFiles()),
    handleGetStarredDirectories: () => dispatch(getStarredDirectories()),
    handleGetActivities: (count) => dispatch(getActivities(count)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(File);
