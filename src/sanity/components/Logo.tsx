import React from "react";

export function Logo(props: any) {
  const { renderDefault, title } = props;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src="/logo.svg"
        alt="SmallCar Logo"
        style={{ width: "32px", height: "32px", objectFit: "contain" }}
      />
      <span style={{ fontWeight: 700, fontSize: "18px", color: "#a38a59", letterSpacing: "0.05em" }}>
        SmallCar Admin
      </span>
    </div>
  );
}
