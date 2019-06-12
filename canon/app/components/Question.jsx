import React from "react";
import {Icon} from "@blueprintjs/core";
import "./Question.css";

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen || false
    };
  }
  render() {
    const {children, title} = this.props;
    const {isOpen} = this.state;

    return <div>
      <li className="question" onClick={() => this.setState({isOpen: !isOpen})}>
        <span className="question-title">{title}</span><Icon icon={!isOpen ? "chevron-down" : "chevron-up"} />
      </li>
      {isOpen && <div className="paragraph">{children}</div>}
    </div>;
  }
}

export default Question;
