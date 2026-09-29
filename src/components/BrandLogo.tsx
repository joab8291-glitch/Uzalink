export function BrandLogo({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <img
      src="/uzalink-logo.svg"
      alt="UZALINK — Turn Links Into Sales."
      className={`block h-auto w-[150px] object-contain ${className}`}
      style={{ aspectRatio: "800 / 206" }}
      draggable={false}
    />
  );
}
