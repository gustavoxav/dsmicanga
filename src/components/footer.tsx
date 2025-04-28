import React from "react";

export function Footer() {
  return (
    <footer className="flex flex-row items-center justify-center p-2 bg-[#f0f0f0]">
      <p className="text-xs text-[#5d5d5d]">Desenvolvido por Gustavo Xavier - {2025}</p>
      <div className="flex flex-row gap-4 ml-4">
        <a
          href="https://github.com/gustavoxav"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-xs text-[#5d5d5d]">
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/gustavosaldxav/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-xs text-[#5d5d5d]">
          LinkedIn
        </a>
      </div>
    </footer>
  );
}

export default Footer;
