import telnetSession from 'telnet-engine';

const onuRequest = async (oltID: number, FHTT: string): Promise<string[][]> => {
  try {
    return new Promise((resolve, reject) => {
      let ip = '';
      if (oltID === 1) {

        ip = '172.17.50.230';
      } else if (oltID === 2) {

        ip = '172.17.50.222';
      } else if (oltID === 3) {

        ip = '172.17.50.250';
      } else if (oltID === 4) {

        ip = '172.17.50.254';
      } else if (oltID === 5) {

        ip = '172.17.50.226';
      } else if (oltID === 6) {

        ip = '172.17.50.234';
      } else if (oltID === 7) {

        ip = '172.17.50.2';
      } else if (oltID === 8) {

        ip = '172.17.50.246';
      } else if (oltID === 9) {

        ip = '172.17.50.6';
      } else {
        const data: string[][] = [['OLT SELECIONADA NÃO EXISTE']];
        return resolve(data);
      }

      const createSession = new telnetSession.Engine(ip, 23);
      const oltRequest = (): Promise<string[]> => {
        return new Promise((resolve, reject) => {
          const onuInfo: string[] = [];
          createSession.requestString('ADMIN');
          createSession.requestString('PASSWORD');
          createSession.requestString('terminal length 0');
          createSession.requestString('enable');
          createSession.requestString('PASSWORD');
          createSession.requestString('cd onu');
          createSession
            .requestString('show whitelist phy-sn', (linha: string) => {
              onuInfo.push(linha);
            })
            .then(response => {
              // console.log(linhas)
              // resolve(linhas)
            })
            .catch(error => {
              resolve(onuInfo);
            });
        });
      };

      const GetVersionSlot = (infoSlot: string[]): Promise<string[]> => {
        return new Promise((resolve, reject) => {
          const slot = infoSlot[0];
          const version: string[] = [];
          createSession.requestString('cd ..');
          createSession.requestString('cd service');
          createSession.requestString(`telnet slot ${slot}`);
          createSession.requestString('cd service');
          createSession.requestString(`terminal length 0`);
          createSession.requestString('cd ..');
          createSession
            .requestString('show version', (linha: string) => {
              version.push(linha);
            })
            .then(() => {
              // console.log(linhas)
              // resolve(linhas)
            })
            .catch(() => {
              resolve(version);
            });
        });
      };

      const GetHardwareOnu = (infoOnu: string[]): Promise<string[]> => {
        return new Promise((resolve, reject) => {
          let pon = Number(infoOnu[1]);
          const onuId = infoOnu[2];
          const version = infoOnu[4];
          let comando = `telnetonu data ponno ${pon} onuno ${onuId}`;

          if (
            version === 'WKE2.200.012R1P.' ||
            version === 'WKE2.200.012R1C.'
          ) {
            pon -= 1;
            comando = `telnetonu data ${pon} ${onuId}`;
          }
          const hardwareOnu: string[] = [];
          createSession.requestString('cd service');
          createSession.requestString(comando);
          createSession.requestString('gpon');
          createSession.requestString('gpon');
          createSession.requestString('terminal length 0');
          createSession.requestString('enable');
          createSession.requestString('gpon');
          createSession
            .requestString('show version', (linha: string) => {
              hardwareOnu.push(linha);
            })
            .then(() => {
              // console.log(linhas)
              // resolve(linhas)
            })
            .catch(() => {
              resolve(hardwareOnu);
            });
        });
      };

      const OnuGetInformationOnuWifi = (): Promise<string[][]> => {
        return new Promise((resolve, reject) => {
          const wifi_24Info: string[] = [];
          const wifi_24ClientsInfo: string[] = [];
          const wifi_5Info: string[] = [];
          const wifi_5ClientsInfo: string[] = [];
          const dhcpInfo: string[] = [];
          const dhcpClientsList: string[] = [];
          const ping: string[] = [];

          createSession.requestString('cd service', s => {
            console.log(s);
          });
          createSession.requestString(
            'ping -count 3  -waittime 1 200.147.3.157',
            (linha: string) => {
              ping.push(linha);
            }
          );
          createSession.requestString('cd ..');
          createSession.requestString('cd wan');
          createSession.requestString(
            'get dhcpserver state',
            (linha: string) => {
              dhcpInfo.push(linha);
            }
          );
          createSession.requestString(
            'set dhcpserver dns one 186.208.96.2 two 186.208.96.3'
          );
          createSession.requestString('get dhcpserver dns', (linha: string) => {
            dhcpInfo.push(linha);
          });
          createSession.requestString('show dhcp ip', (linha: string) => {
            dhcpClientsList.push(linha);
          });
          createSession.requestString('cd ..');
          createSession.requestString('cd wlan');
          createSession.requestString(
            'get wifi 0 ssid 1 state',
            (linha: string) => {
              wifi_24Info.push(linha);
            }
          );
          createSession.requestString(
            'get wifi 0 ssid 1 name',
            (linha: string) => {
              wifi_24Info.push(linha);
            }
          );
          createSession.requestString(
            'get wifi 0 ssid 1 pskkey',
            (linha: string) => {
              wifi_24Info.push(linha);
            }
          );
          createSession.requestString('get wifi 0 channel', (linha: string) => {
            wifi_24Info.push(linha);
          });
          createSession.requestString(
            'get wifi 0 nmode bandwidth',
            (linha: string) => {
              wifi_24Info.push(linha);
            }
          );
          createSession.requestString(
            'get wifi 0 ssid 1 stainfo',
            (linha: string) => {
              wifi_24ClientsInfo.push(linha);
            }
          );
          createSession.requestString(
            'get wifi 1 ssid 1 state',
            (linha: string) => {
              wifi_5Info.push(linha);
            }
          );
          createSession.requestString(
            'get wifi 1 ssid 1 name',
            (linha: string) => {
              wifi_5Info.push(linha);
            }
          );
          createSession.requestString(
            'get wifi 1 ssid 1 pskkey',
            (linha: string) => {
              wifi_5Info.push(linha);
            }
          );
          createSession.requestString('get wifi 1 channel', (linha: string) => {
            wifi_5Info.push(linha);
          });
          createSession.requestString(
            'get wifi 1 nmode bandwidth',
            (linha: string) => {
              wifi_5Info.push(linha);
            }
          );
          createSession
            .requestString('get wifi 1 ssid 1 stainfo', (linha: string) => {
              wifi_5ClientsInfo.push(linha);
            })

            .then(() => {
              resolve();
            })
            .catch(() => {
              createSession.terminate();
              resolve([
                wifi_24Info,
                wifi_5Info,
                dhcpInfo,
                ping,
                wifi_24ClientsInfo,
                wifi_5ClientsInfo,
                dhcpClientsList,
              ]);
            });
          createSession.terminate();
        });
      };

      oltRequest()
        .then((response: string[]) => {
          const onuInformation: string[] = [];
          // const fhtt = 'FHTT11a4a518'
          const fhtt = FHTT;

          for (let index = 0; index < response.length; index += 1) {
            const achou = response[index].indexOf(fhtt, 0);
            if (achou !== -1) {
              const splitedList = response[index].split(' ');
              onuInformation.push(
                splitedList[0],
                splitedList[5],
                splitedList[10],
                splitedList[15]
              );
            }
          }
          GetVersionSlot(onuInformation).then((responseVersion: string[]) => {
            for (let index = 0; index < responseVersion.length; index += 1) {
              if (responseVersion[index].indexOf('Hardware', 0) !== -1) {
                const splitedListVersion = responseVersion[index].split(' ');
                onuInformation.push(splitedListVersion[4]);
              }
            }
            GetHardwareOnu(onuInformation).then((hardwareOnu: string[]) => {
              for (let index = 0; index < hardwareOnu.length; index += 1) {
                if (hardwareOnu[index].indexOf('Hardware', 0) !== -1) {
                  const splitedListVersion = hardwareOnu[index].split(' ');
                  onuInformation.push(splitedListVersion[3]);
                }
              }
            });
            OnuGetInformationOnuWifi()
              .then(respostaFinal => {
                const [
                  wifi_24Info,
                  wifi_5Info,
                  dhcpInfo,
                  ping,
                  wifi_24ClientsInfo,
                  wifi_5ClientsInfo,
                  dhcpClientsList,
                ] = respostaFinal;
                const pingData = [
                  ping[3],
                  ping[6],
                  ping[7],
                  ping[8],
                  ping[11],
                  ping[12],
                ];
                const wifi4Data = [
                  wifi_24Info[2],
                  wifi_24Info[5],
                  wifi_24Info[8],
                  wifi_24Info[11],
                  wifi_24Info[14],
                ];
                const wifi5Data = [
                  wifi_5Info[2],
                  wifi_5Info[5],
                  wifi_5Info[8],
                  wifi_5Info[11],
                  wifi_5Info[14],
                ];

                const dhcpStatusData = [dhcpInfo[1]];
                for (let index = 0; index < dhcpInfo.length; index += 1) {
                  if (dhcpInfo[index].indexOf('dns 186', 0) !== -1) {
                    dhcpStatusData.push(dhcpInfo[index]);
                  }
                }
                const dhcpClientsData = [dhcpClientsList[1]];
                const wifi_4ClientsInfoData = [wifi_24ClientsInfo[2]];
                const wifi_5ClientsInfoData = [wifi_5ClientsInfo[2]];
                const addRestInfo = (
                  pos: number,
                  arg: string,
                  array: number
                ): void => {
                  for (let index = pos; index < array; index += 1) {
                    if (arg === 'dhcp') {
                      if (dhcpClientsList[index]) {
                        dhcpClientsData.push(dhcpClientsList[index]);
                      }
                    } else if (arg === 'wifi4') {
                      if (wifi_24ClientsInfo[index]) {
                        wifi_4ClientsInfoData.push(wifi_24ClientsInfo[index]);
                      }
                    } else if (wifi_5ClientsInfo[index]) {
                      wifi_5ClientsInfoData.push(wifi_5ClientsInfo[index]);
                    }
                  }
                };
                addRestInfo(3, 'wifi4', wifi_24ClientsInfo.length);
                addRestInfo(3, 'wifi5', wifi_5ClientsInfo.length);
                addRestInfo(5, 'dhcp', dhcpClientsList.length);
                resolve([
                  pingData,
                  wifi4Data,
                  wifi5Data,
                  dhcpStatusData,
                  dhcpClientsData,
                  wifi_4ClientsInfoData,
                  wifi_5ClientsInfoData,
                ]);
              })
              .catch(err => {
                console.warn(err);
              });
          });
        })

        .catch(() => {
          console.warn({ error: 'Erro' });
        });
    });
  } catch (err) {
    throw new Error('Erro ao executar o script');
  }
};

export default onuRequest;
