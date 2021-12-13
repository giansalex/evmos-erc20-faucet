const networkConfig = {
  netId9000: {
    verifyingContract: '0x11Dd65D6FD791E69CBF6bc9cB4c71E22E790198A',
    rpcCallRetryAttempt: 10,
    currencyName: 'PHOTON',
    explorerUrl: {
      tx: 'https://evm.evmos.org'
    },
    networkName: 'Evmos Olympus',
    rpcUrl: 'http://128.199.41.167:8545/',
    gasPrice: { fast: 1, low: 0, standard: 1 },
    smartContractPollTime: 15
  }
}

export default networkConfig
