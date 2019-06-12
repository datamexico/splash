import React from "react";
import "./Goal.css";

class Goal extends React.Component {
  render() {
    const {children, icon, value} = this.props;
    return <div className="goal">
      <img className="icon" src={`/icons/ico-${icon}.svg`} alt=""/>
      <span className="number">{value}</span>
      <p>{children}</p>
    </div>;
  }
}

export default Goal;
