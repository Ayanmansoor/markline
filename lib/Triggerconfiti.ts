const SHAPES = ["circle", "square", "triangle"]; // Example shapes

function generateRandomColor() {
  const colors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7", "#7ED957", "#FF69B4"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function TriggerConfetti(containerRef: any) {
  const container = containerRef.current;

  if (container) {
    const containerWidth = container.offsetWidth;

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");

      const positionX = Math.random() * containerWidth;
      const size = Math.floor(Math.random() * (8 - 2 + 1)) + 4;
      const animationDuration = Math.random() * 2 + 2; // Between 2s and 4s
      const animationDelay = Math.random(); // 0 - 1s

      confetti.style.position = "absolute";
      confetti.style.left = `${positionX}px`;
      confetti.style.top = `0px`;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = generateRandomColor();
      confetti.style.zIndex = "9999";
      confetti.style.opacity = "0.9";
      confetti.style.borderRadius = "2px";
      confetti.style.animation = `fall ${animationDuration}s linear ${animationDelay}s forwards`;

      confetti.className = "confetti " + SHAPES[Math.floor(Math.random() * SHAPES.length)];

      container.appendChild(confetti);

      setTimeout(() => {
        container.removeChild(confetti);
      }, (animationDuration + animationDelay) * 1000);
    }
  }
}
