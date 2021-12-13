/* eslint-disable no-console */
import Portis from '@portis/web3'
import MewConnect from '@myetherwallet/mewconnect-web-client'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { toChecksumAddress, fromWei, isAddress } from 'web3-utils'
import networkConfig from '@/networkConfig'
let Authereum
if (process.client) {
  Authereum = require('authereum').Authereum
}

const onAccountsChanged = ({ newAccount, commit }) => {
  const account = toChecksumAddress(newAccount[0])
  commit('IDENTIFY', account)
}

const state = () => {
  return {
    ethAccount: null,
    netId: 1,
    domainData: {},
    balance: '0',
    address: {
      value: null,
      valid: false
    },
    gasPrice: { fast: 1, low: 1, standard: 1 },
    providerName: '',
    networkName: '',
    initProvider: false
  }
}

const getters = {
  netId(state) {
    return state.netId
  },
  networkName(state) {
    return networkConfig[`netId${state.netId}`].networkName
  },
  currency(state) {
    return networkConfig[`netId${state.netId}`].currencyName
  },
  networkConfig(state) {
    return networkConfig[`netId${state.netId}`]
  },
  getEthereumProvider: (state) => {
    const { providerName, networkName } = state
    switch (providerName) {
      // case 'torus':
      //   await this.enableTorusTxProvider()
      //   break
      // case 'bitski':
      //   await this.enableBitskiTxProvider()
      //   break
      // case 'ledger':
      //   await this.enableLedgerTxProvider()
      //   break
      case 'metamask':
      default:
        return window.ethereum
    }
  }
}

const mutations = {
  IDENTIFY(state, ethAccount) {
    state.ethAccount = ethAccount
  },
  SET_NET_ID(state, netId) {
    netId = parseInt(netId, 10)
    state.netId = netId
  },
  INIT_PROVIDER_REQUEST(state) {
    state.initProvider = true
  },
  INIT_PROVIDER_FAILED(state) {
    state.initProvider = false
  },
  INIT_PROVIDER_SUCCESS(state) {
    state.initProvider = false
  },
  SET_BALANCE(state, balance) {
    state.balance = fromWei(balance)
  },
  SET_ADDRESS(state, { address, valid = false }) {
    state.address = {
      value: address,
      valid
    }
  },
  SAVE_GAS_PRICE(state, gasPrice) {
    state.gasPrice = gasPrice
  },
  SET_PROVIDER_NAME(state, providerName) {
    state.providerName = providerName
  },
  SET_NETWORK_NAME(state, networkName) {
    state.networkName = networkName
  }
}

const actions = {
  setAddress({ dispatch, commit }, { address }) {
    const isAddressValid = address.length >= 42 && isAddress(address)
    commit('SET_ADDRESS', {
      address,
      valid: isAddressValid
    })
  },
  onNetworkChanged({ commit }, { netId }) {
    commit('SET_NET_ID', netId)
  },
  async getBalance({ state, commit }) {
    try {
      const balance = await this.$provider.getBalance({ address: state.ethAccount })
      commit('SET_BALANCE', balance)

      return balance
    } catch (err) {
      throw new Error(err.message)
    }
  },
  async askPermission({ commit, dispatch, getters }, { providerName, networkName, version }) {
    commit('SET_PROVIDER_NAME', providerName)
    commit('SET_NETWORK_NAME', networkName)

    try {
      commit('INIT_PROVIDER_REQUEST')

      const provider = await getters.getEthereumProvider
      const address = await this.$provider.initProvider(provider, { version })

      commit('IDENTIFY', address)
      dispatch('setAddress', { address })

      // const netId = await this.$provider.checkNetworkVersion()
      let netId = await this.$provider.sendRequest({
        method: 'eth_chainId',
        params: []
      })
      netId = Number(netId)
      console.log('netId', netId)
      dispatch('onNetworkChanged', { netId })

      this.$provider.initWeb3(networkConfig[`netId${netId}`].rpcUrl)

      await dispatch('getBalance')

      this.$provider.on({
        method: 'chainChanged',
        callback: () => {
          dispatch('onNetworkChanged', { netId })
        }
      })

      this.$provider.on({
        method: 'accountsChanged',
        callback: (newAccount) => {
          onAccountsChanged({ dispatch, commit, newAccount })
        }
      })

      dispatch('token/getTokenAddress', {}, { root: true })
      dispatch('token/getTokenBalance', {}, { root: true })

      commit('INIT_PROVIDER_SUCCESS')
      dispatch('fetchGasPrice', {})
      return { netId, ethAccount: address }
    } catch (err) {
      commit('INIT_PROVIDER_FAILED')
      throw new Error(err.message)
    }
  },
  async fetchGasPrice({ rootState, commit, dispatch, rootGetters, state }, { oracleIndex = 0 }) {
    // eslint-disable-next-line prettier/prettier
    const { smartContractPollTime, gasPrice, gasOracleUrls } = rootGetters['metamask/networkConfig']
    const { netId } = rootState.metamask
    console.log('netId', netId)
    try {
      if (netId === 1) {
        const response = await fetch(gasOracleUrls[oracleIndex % gasOracleUrls.length])
        if (response.status === 200) {
          const json = await response.json()

          const gasPrices = { ...gasPrice }
          if (json.slow) {
            gasPrices.low = Number(json.slow) + 0.5
          }
          if (json.safeLow) {
            gasPrices.low = Number(json.safeLow) + 0.5
          }
          if (json.fast) {
            gasPrices.fast = Number(json.fast)
          }
          if (json.standard) {
            gasPrices.standard = Number(json.standard)
          }
          commit('SAVE_GAS_PRICE', gasPrices)
        } else {
          throw Error('Fetch gasPrice failed')
        }
        setTimeout(() => dispatch('fetchGasPrice', {}), 1000 * smartContractPollTime)
      } else {
        console.log('gasPrice', gasPrice)
        commit('SAVE_GAS_PRICE', gasPrice)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      oracleIndex++
      setTimeout(() => dispatch('fetchGasPrice', { oracleIndex }), 1000 * smartContractPollTime)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
