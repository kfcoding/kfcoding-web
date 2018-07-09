import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from "mobx-react";
import { onSnapshot } from "mobx-state-tree"
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Store } from "./store";
import Index from "./pages/Index";
import WrappedSignin from "./pages/Signin";
import WrappedSignUp from "./pages/Signup";
import Home from "./pages/Home";
import CreateBook from 'pages/CreateBook';
import MyWorkspaces from 'pages/Home/Workspaces';
import CreateWorkspace from 'pages/Home/CreateWorkspace';
import Library from "./pages/Library";
import Book from 'pages/Book';
import Reader from "./pages/Reader";
import Editor from 'pages/Editor';
import KongfuSettings from "./pages/Home/KongfuSettings";
import Callback from "./pages/Signin/Callback";
import UserProfile from 'pages/Profile/UserProfile';

if (window.location.hostname.substr(0, 3) == 'www') {
  window.location.replace('http://kfcoding.com');
}

const store = Store.create(
  {}
);

onSnapshot(store, (snapshot) => {
  console.dir(snapshot)
})

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Index}/>
        <Route path='/signup' exact component={WrappedSignUp}/>
        <Route path='/signin' exact component={WrappedSignin}/>
        <Route exact path='/editor/:kongfu_id' component={props => <Editor {...props}/>}/>
        <Route path='/reader/:kongfu_id' component={props => <Reader {...props}/>}/>
        <Route path='/auth/callback' component={Callback}/>
        <Route path='/home' exact component={Home}/>
        <Route path='/library' component={Library}/>
        <Route path='/books/create' exact component={CreateBook}/>
        <Route path='/books/:kongfu_id' exact component={props => <Book {...props}/>}/>
        <Route path='/books/:kongfu_id/settings' component={props => <KongfuSettings {...props}/>}/>
        {/*<Route path='/users/setting' exact component={UserSetting}/>*/}
        <Route path='/users/:user_id' exact component={props => <UserProfile {...props}/>}/>
        <Route path='/home/workspaces/create' exact component={CreateWorkspace}/>
        <Route path='/home/workspaces' exact component={MyWorkspaces}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
