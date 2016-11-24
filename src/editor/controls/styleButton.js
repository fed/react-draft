import React from 'react';
import styles from '../styles.css';

export default class StyleButton extends React.Component {
  constructor() {
    super();

    this.onToggle = (event) => {
      event.preventDefault();

      this.props.onToggle(this.props.style);
    };
  }

  render() {
    const {active, label} = this.props;

    return (
      <span className={active ? styles.styleButtonActive : styles.styleButton} onMouseDown={this.onToggle}>
        {label}
      </span>
    );
  }
}

StyleButton.propTypes = {
  onToggle: React.PropTypes.func,
  active: React.PropTypes.bool,
  label: React.PropTypes.string,
  style: React.PropTypes.string
};
