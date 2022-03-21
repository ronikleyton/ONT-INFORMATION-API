const ProcessData = (dataBrute: string[][]): object => {
  const infoOnu = dataBrute;
  const data = {
    wifi4: {
      enable: true,
      ssid: '',
      channel: '',
      senha: '',
      bandwidth: '',
      quantConectados: '',
      infoConectados: [''],
    },
    wifi5: {
      enable: true,
      ssid: '',
      channel: '',
      senha: '',
      bandwidth: '',
      quantConectados: '',
      infoConectados: [''],
    },
    dhcpserver: {
      enable: true,
      addressDns: [''],
      totalDhpcLeases: '',
      infoDhcpLeases: { ip: [''], mac: [''] },
    },
    icmpTest: [''],
  };
  // TRATIVA DA INFORMAÇÃO DO ICMP
  data.icmpTest = [...infoOnu[0]];

  // TRATIVA DA INFORMAÇÃO DHCP
  if (infoOnu[3][0].indexOf('false', 0) !== -1) {
    data.dhcpserver.enable = false;
  }
  const totalDhcpLeases = infoOnu[4][0].split('=');
  data.dhcpserver.totalDhpcLeases = `${totalDhcpLeases[1].trim()}`;
  if (Number(data.dhcpserver.totalDhpcLeases) >= 1) {
    infoOnu[4].shift();
    data.dhcpserver.infoDhcpLeases.ip = infoOnu[4].map(linha => {
      const ip = linha.split(' ');
      return ip[0];
    });
    data.dhcpserver.infoDhcpLeases.mac = infoOnu[4].map(linha => {
      let macAdress = linha.split(' ');
      macAdress = macAdress.filter(element => {
        if (!!macAdress === true) {
          return element;
        }
        return true;
      });
      return macAdress[1];
    });
  }

  // TRATIVA INFORMAÇÃO DO DNS
  const dns = infoOnu[3][1].split(' ');
  data.dhcpserver.addressDns = [dns[3], dns[5]];

  // TRATIVA INFORMAÇÃO WIFI 4
  if (infoOnu[1][0].indexOf('false', 0) !== -1) {
    data.wifi4.enable = false;
  }
  const nameWifi4 = infoOnu[1][1].split('=');
  data.wifi4.ssid = `${nameWifi4[1]}`;
  const pskWifi4 = infoOnu[1][2].split(' ');
  data.wifi4.senha = `${pskWifi4[4]}`;
  const channelWifi4 = infoOnu[1][3].split(' ');
  data.wifi4.channel = `${channelWifi4[3]}`;
  data.wifi4.bandwidth = `${infoOnu[1][4]}`;
  const totalConectedWifi4 = infoOnu[5][0].split(' ');
  data.wifi4.quantConectados = `${totalConectedWifi4[5]}`;
  if (Number(data.wifi4.quantConectados) >= 1) {
    infoOnu[5].shift();
    data.wifi4.infoConectados = infoOnu[5].map(linha => {
      const macAdress = linha.split(' ');
      return macAdress[4];
    });
  }

  // TRATIVA INFORMAÇÃO WIFI 5
  if (infoOnu[2][0].indexOf('false', 0) !== -1) {
    data.wifi5.enable = false;
  }
  const nameWifi5 = infoOnu[2][1].split('=');
  data.wifi5.ssid = `${nameWifi5[1]}`;
  const pskWifi5 = infoOnu[2][2].split(' ');
  data.wifi5.senha = `${pskWifi5[4]}`;
  const channelWifi5 = infoOnu[2][3].split(' ');
  data.wifi5.channel = `${channelWifi5[3]}`;
  data.wifi5.bandwidth = `${infoOnu[2][4]}`;
  const totalConectedWifi5 = infoOnu[6][0].split(' ');
  data.wifi5.quantConectados = `${totalConectedWifi5[5]}`;
  if (Number(data.wifi5.quantConectados) >= 1) {
    infoOnu[6].shift();
    data.wifi5.infoConectados = infoOnu[6].map(linha => {
      const macAdress = linha.split(' ');
      return macAdress[4];
    });
  }
  return data;
};
export default ProcessData;
