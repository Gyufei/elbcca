import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <defs>
      <clipPath id="a">
        <rect width={20} height={20} x={20} y={20} rx={0} />
      </clipPath>
    </defs>
    <g clipPath="url(#a)" transform="rotate(180 20 20)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22.25 30.75h13.5v-1.5h-13.5v1.5Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m27.416 23.94-.53.53-5 5q-.053.052-.094.113-.04.062-.069.13-.028.068-.043.14-.014.073-.014.147t.014.146q.015.073.043.141.028.068.07.13.04.061.093.113l5 5 .53.53 1.06-1.06-.53-.53-4.47-4.47 4.47-4.47.53-.53-1.06-1.06Z"
      />
    </g>
  </svg>
);
export default SvgComponent;
