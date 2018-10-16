import React from 'react';
import PropTypes from 'prop-types';
import { svg, select } from 'd3';

import './style.css';

import { ORIENTATIONS, getOrientedCoordinates } from '../constants';

export default class Link extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialStyle: {
        opacity: 0,
      },
    };
  }

  componentDidMount() {
    this.applyOpacity(1, this.props.transitionDuration);
  }

  componentWillLeave(done) {
    this.applyOpacity(0, this.props.transitionDuration, done);
  }

  applyOpacity(opacity, transitionDuration, done = () => {}) {
    if (transitionDuration === 0) {
      select(this.link).style('opacity', opacity);
      done();
    } else {
      select(this.link)
        .transition()
        .duration(transitionDuration)
        .style('opacity', opacity)
        .each('end', done);
    }
  }

  diagonalPath(linkData, orientation, containerSize) {

    const diagonal = svg
      .diagonal()
      .projection(d => getOrientedCoordinates(d.x, d.y, orientation, containerSize));
    return diagonal(linkData);
  }

  straightPath(linkData, orientation, containerSize) {
    const straight = svg
      .line()
      .interpolate('basis')
      .x(d => d.x)
      .y(d => d.y);

    const [sourceX, sourceY] = getOrientedCoordinates(
      linkData.source.x,
      linkData.source.y,
      orientation,
      containerSize,
    );
    const [targetX, targetY] = getOrientedCoordinates(
      linkData.target.x,
      linkData.target.y,
      orientation,
      containerSize,
    );

    const data = [{ x: sourceX, y: sourceY }, { x: targetX, y: targetY }];

    return straight(data);
  }

  elbowPath(linkData, orientation, containerSize) {
    const [sourceX, sourceY] = getOrientedCoordinates(
      linkData.source.x,
      linkData.source.y,
      orientation,
      containerSize,
    );
    const [targetX, targetY] = getOrientedCoordinates(
      linkData.target.x,
      linkData.target.y,
      orientation,
      containerSize,
    );
    return `M${sourceX},${sourceY}V${targetY}H${targetX}`;
  }

  drawPath() {
    const { linkData, orientation, pathFunc, containerSize } = this.props;

    if (typeof pathFunc === 'function') {
      return pathFunc(linkData, orientation, containerSize);
    }

    if (pathFunc === 'elbow') {
      return this.elbowPath(linkData, orientation, containerSize);
    }

    if (pathFunc === 'straight') {
      return this.straightPath(linkData, orientation, containerSize);
    }

    return this.diagonalPath(linkData, orientation, containerSize);
  }

  render() {
    const { styles } = this.props;
    return (
      <path
        ref={l => {
          this.link = l;
        }}
        style={{ ...this.state.initialStyle, ...styles }}
        className="linkBase"
        d={this.drawPath()}
      />
    );
  }
}

Link.defaultProps = {
  styles: {},
  containerSize: undefined,
};

Link.propTypes = {
  linkData: PropTypes.object.isRequired,
  orientation: PropTypes.oneOf(Object.values(ORIENTATIONS)).isRequired,
  containerSize: PropTypes.object,
  pathFunc: PropTypes.oneOfType([
    PropTypes.oneOf(['diagonal', 'elbow', 'straight']),
    PropTypes.func,
  ]).isRequired,
  transitionDuration: PropTypes.number.isRequired,
  styles: PropTypes.object,
};
