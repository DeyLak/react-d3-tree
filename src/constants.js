export const ORIENTATION_HORIZONTAL = 'horizontal';
export const ORIENTATION_VERTICAL = 'vertical';
export const ORIENTATION_HORIZONTAL_MIRRORED = 'horizontalMirrored';
export const ORIENTATION_VERTICAL_MIRRORED = 'verticalMirrored';

export const ORIENTATIONS = {
  [ORIENTATION_HORIZONTAL]: ORIENTATION_HORIZONTAL,
  [ORIENTATION_VERTICAL]: ORIENTATION_VERTICAL,
  [ORIENTATION_HORIZONTAL_MIRRORED]: ORIENTATION_HORIZONTAL_MIRRORED,
  [ORIENTATION_VERTICAL_MIRRORED]: ORIENTATION_VERTICAL_MIRRORED,
};

export const getOrientedCoordinates = (x, y, orientation, containerSize) => {
  let resultX = x;
  let resultY = y;
  let realOrientation = orientation;
  // We will not have container size at initial rendering, so we should render normal orientation,
  // so we can calculate container size
  if (
    !containerSize &&
    (realOrientation === ORIENTATIONS.horizontalMirrored ||
      realOrientation === ORIENTATIONS.verticalMirrored)
  ) {
    realOrientation =
      orientation === ORIENTATIONS.horizontalMirrored
        ? ORIENTATIONS.horizontal
        : ORIENTATIONS.vertical;
  }

  if (realOrientation === ORIENTATIONS.horizontal) {
    resultX = y;
    resultY = x;
  } else if (realOrientation === ORIENTATIONS.horizontalMirrored) {
    resultX = containerSize.width - y;
    resultY = x;
  } else if (realOrientation === ORIENTATIONS.verticalMirrored) {
    resultY = containerSize.height - y;
  }
  return [resultX, resultY];
};
