import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

export default class NodeWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      enableTransitions: props.transitionDuration > 0,
      containerSize: undefined,
    };
    this.callOnRender = this.callOnRender.bind(this);
  }

  componentDidMount() {
    this.callOnRender();
  }

  componentDidUpdate() {
    this.callOnRender();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.transitionDuration !== this.props.transitionDuration) {
      this.setState({
        enableTransitions: nextProps.transitionDuration > 0,
      });
    }
  }

  callOnRender() {
    if (!this.state.containerSize && this.props.onRender && this.node) {
      const containerSize = this.node.getBoundingClientRect();
      this.setState({ containerSize });
      this.props.onRender(containerSize);
    }
  }

  render() {
    if (this.state.enableTransitions) {
      return (
        <TransitionGroup
          component={this.props.component}
          className={this.props.className}
          transform={this.props.transform}
        >
          <g
            ref={n => {
              this.node = n;
            }}
          >
            {this.props.children}
          </g>
        </TransitionGroup>
      );
    }

    return (
      <g
        className={this.props.className}
        transform={this.props.transform}
        ref={n => {
          this.node = n;
        }}
      >
        {this.props.children}
      </g>
    );
  }
}

NodeWrapper.defaultProps = {
  component: 'g',
  onRender: undefined,
};

NodeWrapper.propTypes = {
  transitionDuration: PropTypes.number.isRequired,
  component: PropTypes.string,
  onRender: PropTypes.func,
  className: PropTypes.string.isRequired,
  transform: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};
