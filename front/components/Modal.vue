<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Please select your Web3 Wallet
      </p>
    </header>
    <section class="modal-card-body">
      <div class="field is-grouped is-grouped-centered is-grouped-multiline wallets">
        <div class="control">
          <button class="button is-small is-dark is-metamask" @click="_web3Connect('metamask')">
            Metamask
          </button>
        </div>
      </div>
    </section>
    <b-loading :active.sync="initProvider" />
  </div>
</template>
<script>
/* eslint-disable no-console */
import { mapState } from 'vuex'
import NetworkSelect from '@/components/NetworkSelect'

export default {
  components: {
    NetworkSelect
  },
  data() {
    return {
      isBackuped: false,
      preparingModal: null,
      loading: false,
      portisNetwork: 'mainnet',
      mewconnectNetwork: 'mainnet',
      authereumNetwork: 'mainnet'
    }
  },
  computed: {
    ...mapState('metamask', ['initProvider'])
  },
  methods: {
    async _web3Connect(providerName, networkName, version) {
      try {
        await this.$store.dispatch('metamask/askPermission', { providerName, networkName, version })
        this.$parent.close()
      } catch (err) {
        console.error('web3Connect Error', err.message)
      }
    }
  }
}
</script>
