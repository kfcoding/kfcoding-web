import React from 'react';
import { Terminal } from 'xterm';
import io from 'socket.io-client';
import 'xterm/dist/xterm.css';
import * as fit from 'xterm/lib/addons/fit/fit';

class Term extends React.Component {

  constructor(props) {
    super(props);console.log(props)
    Terminal.applyAddon(fit);
    this.state = {
      terminal: new Terminal(),
      wsaddr: this.props.ws,
      ws: null,
      connectSuccess: false,
      id: new Date().getTime()
    }

    this.termDom = React.createRef();
  }

  pasteCode = (v) => {
    // alert(this.ws.readyState !== 1)
    if (!this.ws)
      return;
    // this.ws.send(JSON.stringify({Op: 'stdin', Data: v}));
    this.ws.emit('term.input', {id: this.state.id.toString(), input: v})
  }

  componentDidMount() {
    let { terminal, id } = this.state;
    terminal.open(this.termDom.current);
    terminal.fit();
    this.ws = io(this.state.wsaddr);
    var ws = this.ws;
    ws.on('term.output', (data) => {
      terminal.write(data.output)
    });
    ws.on('connect', () => {
      ws.emit('term.open', {id: id.toString(), cols: terminal.cols, rows: terminal.rows, path: '/'});
    });
    terminal.on('key', (key, ev) => {
      ws.emit('term.input', {id: id.toString(), input: key});
    });
    terminal.on('resize', ({cols, rows}) => {
      ws.emit('term.resize', {id: id.toString(), cols: cols, rows: rows})
    })
  }

  render() {
    return (
      <div ref={this.termDom} style={{width: '100%', height: '85%', position: 'absolute'}}></div>
    );
  }
}

export default Term;