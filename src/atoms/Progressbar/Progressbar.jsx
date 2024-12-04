import React from "react";
import "./Progressbar.scss";
export default function Progressbar({ stat, value }) {
  return (
    <div className="progressbar">
      <span>{stat}</span>
      <div className="progress">
        <span>{value}</span>
        <progress value={value} max="100"></progress>
      </div>
    </div>
  );
}
