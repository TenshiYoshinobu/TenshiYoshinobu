/* Iconos holográficos de los 11 temas (SVG propios). Clases: a = trazo principal, b = trazo secundario, f = relleno suave */
window.DSA_ICONS=(function(){
  function s(body){return '<svg viewBox="0 0 64 64" class="ico-svg" aria-hidden="true" focusable="false">'+body+'</svg>'}
  return [
  /* 1 Conceptos de seguridad: escudo con candado */
  s('<path class="a f" d="M32 5 54 13v16c0 15-9 26-22 30C19 55 10 44 10 29V13z"/><path class="b" d="M32 11 48 17v12c0 11-6 19-16 23-10-4-16-12-16-23V17z"/><rect class="a" x="23" y="29" width="18" height="14" rx="2"/><path class="a" d="M26 29v-4a6 6 0 0 1 12 0v4"/><circle class="dot" cx="32" cy="36" r="2"/>'),
  /* 2 Docker: ballena con contenedores */
  s('<path class="a f" d="M5 33h43c4 0 7-2 8-5 3 0 4 2 4 2-1-4-4-5-6-5-1-3-3-4-3-4-3 3-2 6-1 7H7c0 11 8 20 23 20 14 0 21-7 24-15"/><g class="b"><rect x="13" y="24" width="7" height="7"/><rect x="21" y="24" width="7" height="7"/><rect x="29" y="24" width="7" height="7"/><rect x="21" y="16" width="7" height="7"/><rect x="29" y="16" width="7" height="7"/><rect x="29" y="8" width="7" height="7"/></g><circle class="dot" cx="47" cy="38" r="1.6"/>'),
  /* 3 Criptografía: candado con binario */
  s('<rect class="a f" x="12" y="27" width="40" height="30" rx="3"/><path class="a" d="M20 27v-8a12 12 0 0 1 24 0v8"/><text class="t" x="32" y="40" text-anchor="middle">1011</text><text class="t" x="32" y="51" text-anchor="middle">0100</text><circle class="dot" cx="32" cy="12" r="0"/>'),
  /* 4 Lynis: lupa sobre auditoría */
  s('<rect class="a f" x="8" y="8" width="34" height="44" rx="3"/><path class="b" d="M15 18h18M15 26h12M15 34h14M15 42h8"/><circle class="a" cx="40" cy="38" r="11"/><path class="a" d="m48 46 11 11"/><path class="dot2" d="m35 38 4 4 7-8"/>'),
  /* 5 CyberChef: matraz con engranaje y burbujas */
  s('<path class="a f" d="M25 6h14M28 6v18L10 54c-1 3 1 5 4 5h36c3 0 5-2 4-5L36 24V6"/><path class="b" d="M16 46h32"/><circle class="dot" cx="26" cy="40" r="3"/><circle class="dot" cx="37" cy="36" r="2"/><circle class="dot" cx="33" cy="49" r="2.4"/><path class="b" d="M44 8l2 3 4-1-1 4 3 2-3 2 1 4-4-1-2 3-2-3-4 1 1-4-3-2 3-2-1-4 4 1z" transform="translate(-4 -2) scale(.8)"/>'),
  /* 6 GPG/PGP: llave con sobre */
  s('<circle class="a f" cx="18" cy="22" r="11"/><circle class="dot" cx="18" cy="22" r="3.5"/><path class="a" d="M26 30 52 56M42 46l6-6M48 52l5-5"/><rect class="b" x="34" y="8" width="24" height="16" rx="2"/><path class="b" d="m34 10 12 9 12-9"/>'),
  /* 7 Blockchain: bloques encadenados */
  s('<g class="a f"><rect x="4" y="22" width="18" height="18" rx="2"/><rect x="23" y="22" width="18" height="18" rx="2" transform="translate(0 0)"/><rect x="42" y="22" width="18" height="18" rx="2"/></g><path class="b" d="M22 31h1M41 31h1"/><path class="a" d="M10 22v-6a4 4 0 0 1 4-4h6M54 40v6a4 4 0 0 1-4 4h-6M32 22v-6M32 40v6"/><path class="dot2" d="M9 31h8M28 31h8M47 31h8"/>'),
  /* 8 Seguridad pasiva equipos: portátil con escudo */
  s('<path class="a f" d="M12 14h40v28H12z"/><path class="a" d="M5 48h54l-4 6H9z"/><path class="b" d="M32 19 42 23v8c0 6-4 9-10 11-6-2-10-5-10-11v-8z"/><path class="dot2" d="m28 30 3 3 5-6"/>'),
  /* 9 CPD: racks de servidores */
  s('<g class="a f"><rect x="8" y="6" width="22" height="52" rx="2"/><rect x="34" y="14" width="22" height="44" rx="2"/></g><path class="b" d="M12 16h14M12 26h14M12 36h14M12 46h14M38 24h14M38 34h14M38 44h14"/><circle class="dot" cx="15" cy="11" r="1.4"/><circle class="dot" cx="41" cy="19" r="1.4"/><circle class="dot" cx="22" cy="21" r="1.2"/><circle class="dot" cx="48" cy="29" r="1.2"/>'),
  /* 10 Almacenamiento: discos duros apilados / RAID */
  s('<g class="a f"><rect x="8" y="8" width="48" height="14" rx="2"/><rect x="8" y="25" width="48" height="14" rx="2"/><rect x="8" y="42" width="48" height="14" rx="2"/></g><circle class="dot" cx="16" cy="15" r="2"/><circle class="dot" cx="16" cy="32" r="2"/><circle class="dot" cx="16" cy="49" r="2"/><path class="b" d="M26 15h22M26 32h22M26 49h22"/>'),
  /* 11 OpenMediaVault: NAS con bahías y nube */
  s('<path class="a f" d="M10 14h44v40H10z"/><path class="b" d="M16 22h8v26h-8zM28 22h8v26h-8zM40 22h8v26h-8z"/><path class="a" d="M22 6h20"/><circle class="dot" cx="20" cy="51" r="1.3"/><circle class="dot" cx="32" cy="51" r="1.3"/><circle class="dot2" cx="44" cy="51" r="1.3"/>')
  ];
})();
