import React from 'react';
import { getToken } from "services/users";
import { Spin } from 'antd';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class Callback extends React.Component {

  constructor() {
    super();
    getToken(getParameterByName('code')).then(msg => {
      //alert(JSON.stringify(msg))
      if (msg.data.code != 200) {
        alert(msg.data.message);
        return;
      }
      window.opener.postMessage({token: msg.data.result.token}, window.location.protocol + '//' + window.location.host);
      window.close();
    })
  }

  render() {
    return (
      <div style={{textAlign: 'center', paddingTop: '100px'}}>
        <Spin />正在努力加载...
      </div>
    );
  }
}


export default (Callback);