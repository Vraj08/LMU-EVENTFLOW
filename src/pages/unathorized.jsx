import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function Unauthorized3DPage() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const orbitingPlanets = useRef([
    { angle: 0, radius: 60, speed: 0.01, color: "#ffaa33" },
    { angle: Math.PI / 2, radius: 90, speed: 0.007, color: "#33ccff" },
    { angle: Math.PI, radius: 120, speed: 0.005, color: "#cc33ff" }
  ]);

  const theme = 'error';

  const allFunFacts = [
    "🔐 Over 30% of data breaches are due to unauthorized access.",
    "🛡️ Role-based access control is used in 85% of secure systems.",
    "🚫 403 errors are your system's polite way of saying 'Nope!'.",
    "📜 Logging unauthorized access attempts is a security best practice.",
    "🎯 Unauthorized access attempts are often the first sign of a breach.",
    "🔎 Most unauthorized access incidents are caused by weak or stolen credentials.",
    "🧠 Social engineering is a common method to gain unauthorized access.",
    "📱 Mobile devices increase the risk of unauthorized access in networks.",
    "🕵️‍♂️ Insider threats often go unnoticed and lead to unauthorized breaches.",
    "📊 62% of breaches involve credentials as a factor.",
    "💻 Public Wi-Fi can easily expose devices to unauthorized access.",
    "📂 Encrypting data helps reduce damage from unauthorized access.",
    "📈 Multi-factor authentication (MFA) helps block unauthorized logins.",
    "🚷 Unauthorized access attempts are logged in secure systems.",
    "🔔 Alerts can be triggered by unauthorized access patterns.",
    "🔒 Always lock your workstation when unattended.",
    "🌐 Network segmentation can limit the scope of unauthorized access.",
    "🧑‍💼 Only 50% of employees receive regular security training.",
    "🛠️ Patching systems regularly helps prevent exploits.",
    "🧬 Zero-trust architecture can limit lateral movement after access is gained."
  ];

  const [funFacts, setFunFacts] = useState([]);
  const [factIndex, setFactIndex] = useState(0);
  const [typedFact, setTypedFact] = useState("");

  useEffect(() => {
    const shuffled = [...allFunFacts].sort(() => Math.random() - 0.5);
    setFunFacts(shuffled);
    setFactIndex(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypedFact("");
      setFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [funFacts]);

  useEffect(() => {
    let i = 0;
    const currentFact = funFacts[factIndex] || "";
    setTypedFact("");
    const interval = setInterval(() => {
      const char = currentFact?.[i];
      if (i < currentFact.length && char !== undefined) {
        setTypedFact((prev) => prev + char);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [factIndex, funFacts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#ff3333", "#ffaa33", "#33ccff", "#cc33ff", "#00ffcc"];

    const particles = Array.from({ length: 400 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      radius: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkle: Math.random() * 2 + 0.5,
      direction: Math.random() > 0.5 ? 1 : -1
    }));

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + (mouse.current.x - canvas.width / 2) * 0.05;
      const centerY = canvas.height / 2 + (mouse.current.y - canvas.height / 2) * 0.05;

      orbitingPlanets.current.forEach((planet) => {
        planet.angle += planet.speed;
        const x = centerX + planet.radius * Math.cos(planet.angle);
        const y = centerY + planet.radius * Math.sin(planet.angle);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = planet.color;
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = 20;
        ctx.fill();
      });

      particles.forEach((p) => {
        const scale = canvas.width / p.z;
        const x = (p.x - canvas.width / 2) * scale + centerX;
        const y = (p.y - canvas.height / 2) * scale + centerY;

        const isTextArea = x > centerX - 300 && x < centerX + 300 && y > centerY - 100 && y < centerY + 200;
        if (isTextArea) return;

        p.z -= 1.5;
        if (p.z <= 0) p.z = canvas.width;

        p.radius += 0.02 * p.direction;
        if (p.radius > 3 || p.radius < 0.5) p.direction *= -1;

        ctx.beginPath();
        ctx.arc(x, y, p.radius * scale, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.radius * scale * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    render();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white text-center px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}>
        <div
          className={`backdrop-blur-md p-6 rounded-2xl flex flex-col items-center shadow-xl border text-white 
            ${theme === 'error' ? 'bg-red-900/80 border-red-500' : ''} 
            ${theme === 'info' ? 'bg-blue-900/80 border-blue-400' : ''} 
            ${theme === 'warning' ? 'bg-yellow-800/80 border-yellow-400 text-black' : ''} 
            ${theme === 'success' ? 'bg-green-900/80 border-green-400' : ''}`}
        >
          <h1 className="text-5xl font-extrabold drop-shadow-lg">🚫 Unauthorized</h1>
          <p className="text-lg max-w-xl drop-shadow mt-4">
            You do not have permission to access this page. Please go back or contact your administrator.
          </p>
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glow-box bg-black/70 border border-white/20 shadow-xl backdrop-blur-md p-4 rounded-2xl mt-6 text-sm max-w-lg italic text-gray-300 transition-all duration-500"
          >
            {typedFact}<span className="animate-pulse">|</span>
          </motion.p>
          <a
            href="/"
            className="group mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2"
            title="Return to homepage"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Go to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
