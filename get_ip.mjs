// get_ip.mjs — ローカルIPアドレスを stdout に出力
import { networkInterfaces } from 'os';
const nets = networkInterfaces();
let ip = 'localhost';
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      ip = net.address;
      break;
    }
  }
  if (ip !== 'localhost') break;
}
process.stdout.write(ip);
