import * as React from "react";

function SvgArrow({ title, titleId, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96.154 96.154"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M.561 20.971l45.951 57.605c.76.951 2.367.951 3.127 0l45.956-57.609c.547-.689.709-1.716.414-2.61a2.686 2.686 0 00-.186-.437 2.004 2.004 0 00-1.765-1.056H2.093c-.736 0-1.414.405-1.762 1.056a2.62 2.62 0 00-.184.426c-.297.905-.136 1.934.414 2.625z" />
    </svg>
  );
}

export default SvgArrow;
