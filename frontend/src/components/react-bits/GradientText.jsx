import React from 'react';

export default function GradientText({
  children,
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 8,
  showBorder = false,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    animation: `gradient ${animationSpeed}s linear infinite`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div className={`gradient-text-container ${className}`}>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div
        className="gradient-text-content"
        style={{
          ...gradientStyle,
          position: "relative",
          display: "inline-block",
          zIndex: 2,
        }}
      >
        {children}
      </div>
      {showBorder && (
        <div
          className="gradient-text-border"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to right, ${colors.join(", ")})`,
            backgroundSize: "300% 100%",
            animation: `gradient ${animationSpeed}s linear infinite`,
            zIndex: 1,
            borderRadius: "inherit",
            padding: "2px",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
    </div>
  );
}
