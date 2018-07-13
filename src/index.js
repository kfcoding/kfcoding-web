import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from "mobx-react";
import { onSnapshot } from "mobx-state-tree"
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Store } from "./stores";
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
import UserSetting from "./pages/Home/UserSetting";
import BasicLayout from "./layouts/BasicLayout";
import InfoComplete from 'pages/Edu/InfoComplete';
import NarrowLayout from 'layouts/NarrowLayout';
import Courses from "./pages/Edu/Courses";
import Course from "./pages/Edu/Courses/Course";
import CreateCourse from "./pages/Edu/Courses/Create";
import CreateWork from 'pages/Edu/Courses/Course/CreateWork';
import Work from "./pages/Edu/Courses/Work";
import EditWork from 'pages/Edu/Courses/Course/EditWork';

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
        <Route path='/home' exact component={props => <BasicLayout><Home {...props}/></BasicLayout>}/>
        <Route path='/library' component={Library}/>
        <Route path='/books/create' exact component={CreateBook}/>
        <Route path='/books/:kongfu_id' exact component={props => <BasicLayout><Book {...props}/></BasicLayout>}/>
        <Route path='/books/:kongfu_id/settings' component={props => <KongfuSettings {...props}/>}/>
        <Route path='/users/setting' exact component={UserSetting}/>
        <Route path='/users/:user_id' exact component={props => <BasicLayout><UserProfile {...props}/></BasicLayout>}/>
        <Route path='/home/workspaces/create' exact component={CreateWorkspace}/>
        <Route path='/home/workspaces' exact component={props => <BasicLayout><MyWorkspaces {...props}/></BasicLayout>}/>
        <Route path='/complete' exact component={props => <NarrowLayout><InfoComplete {...props}/></NarrowLayout>}/>
        <Route path='/courses' exact component={props => <NarrowLayout><Courses {...props}/></NarrowLayout>}/>
        <Route path='/courses/create' exact component={props => <NarrowLayout><CreateCourse {...props}/></NarrowLayout>}/>
        <Route path='/courses/:course_id' exact component={props => <NarrowLayout><Course {...props}/></NarrowLayout>}/>
        <Route path='/courses/:course_id/works/create' exact component={props => <NarrowLayout><CreateWork {...props}/></NarrowLayout>}/>
        <Route path='/works/:work_id/submissions' exact component={props => <NarrowLayout><Work {...props}/></NarrowLayout>}/>
        <Route path='/works/:work_id/edit' exact component={props => <NarrowLayout><EditWork {...props}/></NarrowLayout>}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
