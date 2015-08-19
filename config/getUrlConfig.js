export default function(name, protocol, host, port) {
  return {
    [name + 'Port']: port || (protocol === 'https' ? 443 : 80),
    [name + 'Hostname']: host,
    [name + 'Protocol']: protocol,
    [name + 'Endpoint']: protocol + '://' + host + (port ? ':' + port : '')
  };
}
