// src/components/ui/CardContent.jsx
export default function CardContent({ children, className = "" }) {
  return (
    <div className={`p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md ${className}`}>
      {children}
    </div>
  );
}
