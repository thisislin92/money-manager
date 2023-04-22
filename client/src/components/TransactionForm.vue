<script>
import { useAppStore } from "@/stores/app";
import { mapState, mapActions } from "pinia";
import { component as VueNumber } from '@coders-tm/vue-number-format'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  name: "TransactionForm",
  components: {
    VueNumber,
    Datepicker
  },
  methods: {
    ...mapActions(useAppStore, [
      "handleCreateTransaction",
      "getAllTransactions",
      "getAllWallets",
      "getAllCategories",
    ]),

    handleFormSubmit() {
      return this.handleCreateTransaction({
        name: this.name,
        amount: this.integerAmount,
        type: this.type,
        transactionDateTime: this.transactionDateTime,
        CategoryId: this.CategoryId,
        WalletId: this.WalletId,
      });
    },
  },
  computed: {
    ...mapState(useAppStore, ["categories", "wallets"]),
    formattedAmount: function () {
      if (!this.amount) return ''
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      })
      return formatter.format(this.amount)
    },
    integerAmount: function() {
      return Number(this.amount)
    }
  },
  data() {
    return {
      name: "",
      amount: null,
      type: "",
      transactionDateTime: new Date(),
      CategoryId: 0,
      WalletId: 0,
      number: {
        decimal: ',',
        separator: '.',
        prefix: 'Rp. ',
        precision: 2,
        masked: false,
      },
    };
  },
  mounted() {
    this.getAllWallets();
    this.getAllCategories();
  },
  watch: {
    // TODO: does not work yet
    wallets: function (newVal) {
      if (newVal.length > 1) {
        this.WalletId = newVal[0].id;
      }
    }
  },
};
</script>

<template>
  <form @submit.prevent="handleFormSubmit" class="form text-dark">
    <div class="form-group">
      <div>
        <vue-number
          class="form-control border-0 bg-light fs-1 mb-4"
          v-model="amount"
          v-bind="number"
          inputmode="numeric"
        ></vue-number>
      </div>
    </div> 
    <div class="form-group">
      <label for="name">Transaction Name</label>
      <input class="form-control" id="name" v-model="name" />
    </div>
    <div class="form-group">
      <label for="type">Type</label>
      <select v-model="type" class="form-select">
        <option disabled value="">Choose transaction type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>
    <div class="form-group">
      <label for="transactionDateTime">Transaction Date And Time</label>
      <Datepicker :format="'yyyy MMMM dd HH:mm:ss'" v-model="transactionDateTime" />
    </div>
    <div class="form-group">
      <label for="category">Category</label>
      <select v-model="CategoryId" class="form-select">
        <option disabled value="">Select</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label for="wallet">Wallet</label>
      <select v-model="WalletId" class="form-select">
        <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
          {{ wallet.name }}
        </option>
      </select>
    </div>
    <button type="submit" class="mt-3 btn btn-success">Submit</button>
  </form>
</template>
