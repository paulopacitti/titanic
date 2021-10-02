import './App.css';
import React from 'react'
import axios from 'axios'
import {
  Icon,
  Popup,
  Table,
} from 'semantic-ui-react'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      localIp: undefined,
      isLocalIpAnonimous: false,
      loading: true,
      externalIp: undefined,
      city: undefined,
      country: undefined,
      lat: undefined,
      long: undefined,
      state: undefined,
      postal: undefined,
      externalIpError: false,
    }
  }

  componentDidMount() {
    this.getLocalIp();
    this.getExternalIp();
  }

  getLocalIp = () => {
    if (typeof window.RTCPeerConnection == 'undefined') {
      console.error('WebRTC not supported by browser');
      return;
    }

    let pc = new RTCPeerConnection();
    let ips = [];

    pc.createDataChannel("");
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(err => { 
        console.error(err); 
      });
    pc.onicecandidate = event => {
      if (!event || !event.candidate) {
        // All ICE candidates have been sent.
        if (ips.length === 0) {
          console.error('WebRTC disabled or restricted by browser');
        }
        return;
      }

      let parts = event.candidate.candidate.split(' ');
      let [base, componentId, protocol, priority, ip, port, , type, ...attr] = parts;
      let component = ['rtp', 'rtpc'];

      this.setState({ 
        localIp: ip,
        isLocalIpAnonimous: ip.match(/[a-zA-Z0-9-]*.local/) !== null,
      });
    };
  }

  getExternalIp = async () => {
    const response = await axios.get('https://geolocation-db.com/json/');
    const data = response?.data;

    if (response.status === 200 && data !== null) {
        this.setState({
          externalIp: data.IPv4,
          city: data.city,
          country: data['country_name'],
          lat: data.latitude,
          long: data.longitude,
          state: data.state,
          postal: data.postal,
          externalIpError: false,
          loading: false
        });
    } else {
      this.setState({ 
        externalIpError: true,
        loading: false
      });
    }
  }

  getPopUpContent = () => {
    return (
      <div>
        <span>
          Por padrão o google chrome mascara o ip local do usuário. Para vê-lo, digite 
          <b 
            style={{ cursor: 'pointer' }} 
            onClick={async () => {
              try {
                await navigator.clipboard.writeText("chrome://flags/#enable-webrtc-hide-local-ips-with-mdns");
                alert("Copiado para a área de transferência");
              } catch {

              }
            }}
          >
            "chrome://flags/#enable-webrtc-hide-local-ips-with-mdns"
          </b>
          na barra de navegação e desabilite a opção destacada
        </span>
      </div>
    );
  }

  render() {
    console.log(this.state);
    const { loading } = this.state;
    return (
      <div className="container">
        <div className="titanicImage"/>
        <p className="title">Informações da rede</p>
        <div className="tableContainer">
          <Table celled striped>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  IP local
                </Table.Cell>
                <Table.Cell>
                  {!this.state.localIp ? 'Erro ao pegar IP local' : 
                    this.state.isLocalIpAnonimous ? 
                      <Popup
                        position='top right'
                        hoverable
                        on='hover'
                        content={this.getPopUpContent}
                        trigger={<div><span style={{ marginRight: 10 }}>{this.state.localIp}</span><Icon name='question circle outline'/></div>}
                      /> : 
                    this.state.localIp
                  }
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  IP externo
                </Table.Cell>
                <Table.Cell>
                  { loading ? 'carregando' : !this.state.externalIp ? 'Erro ao pegar dados da rede' : this.state.externalIp}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Cidade
                </Table.Cell>
                <Table.Cell>
                  { loading ? 'carregando' : !this.state.city ? 'Erro ao pegar dados da rede' : this.state.city}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  País
                </Table.Cell>
                <Table.Cell>
                  { loading ? 'carregando' : !this.state.country ? 'Erro ao pegar dados da rede' : this.state.country}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Latitude
                </Table.Cell>
                <Table.Cell>
                  { loading ? 'carregando' : !this.state.lat ? 'Erro ao pegar dados da rede' : this.state.lat}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Longitude
                </Table.Cell>
                <Table.Cell>
                  { loading ? 'carregando' : !this.state.long ? 'Erro ao pegar dados da rede' : this.state.long}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Estado
                </Table.Cell>
                <Table.Cell>
                  { loading ? 'carregando' : !this.state.state ? 'Erro ao pegar dados da rede' : this.state.state}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Código postal
                </Table.Cell>
                <Table.Cell>
                  { loading ? 'carregando' : !this.state.postal ? 'Erro ao pegar dados da rede' : this.state.postal}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}
export default App;
