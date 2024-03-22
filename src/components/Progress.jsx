import PropTypes from "prop-types";

const Progress = ({ strokeWidth, percentage }) => {
  const radius = 50 - strokeWidth / 2;
  const pathDescription = `M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}`;

  const diameter = Math.PI * 2 * radius;
  const progressStyle = {
    strokeDasharray: `${diameter}px ${diameter}px`,
    strokeDashoffset: `${((100 - percentage) / 100) * diameter}px`,
  };

  return (
    <>
      <svg className="CircularProgressbar" viewBox="0 0 100 100">
        <path
          className="CircularProgressbar-trail"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          style={{
            stroke: "#ffffff",
          }}
        />

        <path
          className="CircularProgressbar-path"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          style={progressStyle}
        />
      </svg>
    </>
  );
};

export default Progress;
Progress.propTypes = {
  strokeWidth: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
};
