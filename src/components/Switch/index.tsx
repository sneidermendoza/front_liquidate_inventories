import React, { useMemo } from "react";
import "./index.css";
export type SwitchProps = {
    name: string
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function Switch({name, ...rest}: SwitchProps) {
    const id = useMemo(() => {
        return `${name}`
    }, [])
  return (
    <>
      <div className="toggler">
        <input {...rest} id={id} name={id} type="checkbox" value="1" />
        <label htmlFor={id}>
          <svg
            className="toggler-on"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 130.2 130.2"
          >
            <polyline
              className="path check"
              points="100.2,40.2 51.5,88.8 29.8,67.5"
            ></polyline>
          </svg>
          <svg
            className="toggler-off"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 130.2 130.2"
          >
            <line
              className="path line"
              x1="34.4"
              y1="34.4"
              x2="95.8"
              y2="95.8"
            ></line>
            <line
              className="path line"
              x1="95.8"
              y1="34.4"
              x2="34.4"
              y2="95.8"
            ></line>
          </svg>
        </label>
      </div>
    </>
  );
}
