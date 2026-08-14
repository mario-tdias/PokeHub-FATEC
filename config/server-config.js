const os = require('os');

/**
 * Obtém automaticamente o IP local da máquina
 * Suporta IPv4 de interfaces de rede ativas
 */
function getServerIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignora endereços internos e apenas pega IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  // Fallback para localhost
  return 'localhost';
}

/**
 * Obtém informações completas do servidor
 */
function getServerInfo() {
  const ip = getServerIP();
  const port = process.env.PORT || 3000;
  
  return {
    ip,
    port,
    url: `http://${ip}:${port}`,
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch()
  };
}

module.exports = {
  getServerIP,
  getServerInfo
};
