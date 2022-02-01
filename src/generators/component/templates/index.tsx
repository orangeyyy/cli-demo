import * as React from 'react';

import './index.scss';

export interface IProps {};
<%if(type==='class') {%>export interface IState {};

export default class <%= bigCamelName%> extends React.PureComponent<IProps, IState> {
  static displayName = '<%= bigCamelName%>';

  static defaultProps = {};

  render() {
    return (
      <div className="<%= pascalName%>">Hello I am <%= bigCamelName%></div>
    );
  }
}<%} else {%>
const <%= bigCamelName%>: React.FC<IProps> = (props) => {
  return (
    <div className="<%= pascalName%>">Hello I am <%= bigCamelName%></div>
  );
};

<%= bigCamelName%>.defaultProps = {};

export default <%= bigCamelName%>;
<%}%>
