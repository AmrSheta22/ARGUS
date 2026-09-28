function Header() {
  return (
    <header className="absolute top-0 right-[clamp(20px,4vw,64px)] left-[clamp(20px,4vw,64px)] z-[4] flex h-[78px] items-center justify-between border-b border-line text-[9px] font-extrabold tracking-[0.18em] uppercase">
      <span className="text-[18px] tracking-[0.35em]">ARGUS</span>
      <span>FCDS · Student Research Lab</span>
    </header>
  );
}

export default Header;
