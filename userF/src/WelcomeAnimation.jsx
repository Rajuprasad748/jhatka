import React, { useEffect, useState } from "react";
import "./welcomeAnimation.css";

function WelcomeAnimation({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 3000); // total duration of animation

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className="welcome-container">
      <div className="currency-wrapper">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="currency-note"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${20 + Math.random() * 40}px`,
            }}
          >
            💵
          </span>
        ))}
      </div>
      <h1 className="welcome-text">Welcome to RoyalMoney10X</h1>
    </div>
  );
}

export default WelcomeAnimation;
