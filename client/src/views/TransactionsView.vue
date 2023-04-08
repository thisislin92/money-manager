<script>
import { useAppStore } from "@/stores/app";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    ...mapActions(useAppStore, ["getAllTransactions", "checkAuth"]),
  },
  computed: {
    ...mapState(useAppStore, ["transactions"]),

    categoriesFromTransactions() {
      const arrayOfCategories =
        this.transactions.length > 0
          ? this.transactions.map((transaction) => {
              return transaction.Category?.name;
            })
          : [];
      const finalResult = arrayOfCategories.reduce((acc, curr) => {
        if (typeof acc[curr] == "undefined") {
          acc[curr] = 1;
        } else {
          acc[curr] += 1;
        }
        return acc;
      }, {});
      return finalResult;
    },

    transactionsByDate() {
      const transactionsByDate = []
      let currentDate = null

      this.transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.transactionDateTime).toLocaleDateString()

        if (transactionDate !== currentDate) {
          currentDate = transactionDate
          const transactionsForDate = [transaction]
          transactionsByDate.push({ date: currentDate, transactions: transactionsForDate })
        } else {
          const index = transactionsByDate.length - 1
          transactionsByDate[index].transactions.push(transaction)
          transactionsByDate[index].transactions.sort((a, b) => new Date(b.transactionDateTime) - new Date(a.transactionDateTime))
        }
      })

      return transactionsByDate.sort((a, b) => new Date(b.date) - new Date(a.date))
    },
  },
  mounted() {
    this.getAllTransactions();
    this.checkAuth();
  },
};
</script>

<template>
  <div class="card text-dark p-4 mb-4">
    <div class="col-12 mb-4">
      <h1>Your Transactions</h1>
    </div>
    <div class="col-4 p-4">
      <button
        @click="this.$router.push('/transactions-create')"
        class="btn btn-primary"
      >
        Create new Transaction
      </button>
    </div>
    <div v-if="transactions.length > 0" class="row">
      <div class="col-12 pb-4">
        <pie-chart :data="categoriesFromTransactions"></pie-chart>
      </div>
      <div class="col-12 p-3">
        <div class="date-group" v-for="dateGroup of transactionsByDate" :key="dateGroup.date">
          <h3>{{ new Date(dateGroup.date)?.toLocaleString("id-ID", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) }}</h3>
          <div class="transaction-row" v-for="transaction of dateGroup.transactions" :key="transaction.id">
            <div class="d-flex">
              <div class="placeholder me-2 rounded-circle d-flex justify-content-center align-items-center mr-3" style="width: 25px; height: 25px;"></div>
              <span>{{ transaction.name }}</span>
            </div>
            <div>
              <span v-bind:class="{ 'text-red': transaction.type === 'expense', 'text-green': transaction.type !== 'expense' }">
                <strong>
                  {{ transaction.type === 'expense' ? '-' : '+' }}
                  {{ transaction.formattedAmount }}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
        <!-- <table class="table table-light"> -->
        <!--   <thead> -->
        <!--     <tr> -->
        <!--       <th>Transaction Name</th> -->
        <!--       <th>Transaction Amount</th> -->
        <!--       <th>Date Time</th> -->
        <!--       <th>Category</th> -->
        <!--     </tr> -->
        <!--   </thead> -->
        <!--   <tbody> -->
        <!--     <tr v-for="transaction of transactions" v-bind:key="transaction.id"> -->
        <!--       <td>{{ transaction.name }}</td> -->
        <!--       <td>{{ transaction.formattedAmount }}</td> -->
        <!--       <td>{{ transaction.formattedTransactionDate }}</td> -->
        <!--       <td>{{ transaction.Category?.name }}</td> -->
        <!--     </tr> -->
        <!--   </tbody> -->
        <!-- </table> -->
    </div>
    <div v-else>
      <h3 class="text-center">No Transactions found</h3>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    align-items: left;
  }
}

.text-red {
  color: red;
}

.text-green {
  color: green;
}

.transaction-row {
  margin-top: 4px;
  padding: 0.6rem 0.6rem 0.6rem 0.6rem;
  background: #fff9d0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.date-group {
  margin-top: 1rem;
}
</style>
