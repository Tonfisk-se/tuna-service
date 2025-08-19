import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://your-keycloak-domain/auth',
  realm: 'your-realm',
  clientId: 'your-client-id',
});

export default keycloak;