import { defineStore } from "pinia";
import axios from "axios";
import Swal from "sweetalert2";

export const useAppStore = defineStore("app", {
  state: () => ({
    isLoggedIn: false,
    transactions: [],
    wallets: [],
    categories: [],
    conversionResult: 0,
    cmcResponse: {},
    user: {},
  }),
  actions: {
    checkAuth() {
      this.isLoggedIn = !!localStorage.getItem("access_token");
    },

    handleError(error) {
      Swal.fire({
        icon: "error",
        title: "Backend server returned an error",
        text: error?.response?.data?.message || error.message,
      });
    },

    handleSuccessfulLogin(responseFromBackend) {
      localStorage.setItem("access_token", responseFromBackend.access_token);
      this.isLoggedIn = true;
      Swal.fire({
        icon: "success",
        title: "Successfully logged in!",
      });

      this.getAllTransactions();

      this.router.push("/home");
    },

    async handleRegister(dataRegister) {
      try {
        const result = await axios({
          method: "POST",
          url: `${import.meta.env.VITE_ORIGIN_URL}/users/register`,
          data: dataRegister,
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        Swal.fire({
          icon: "success",
          title:
            result?.data?.messages?.[0] ||
            "Successfully registered a new user!",
        });

        // use nodemailer in the backend, to send successful registration email
        this.handleSendSuccessfulEmail(dataRegister.email)

        this.router.push("/login");
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleSendSuccessfulEmail(email) {
      try {
        const result = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_ORIGIN_URL}/nodemailer/${email}`,
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }
      } catch (error) {
        // this.handleError(error);
      }
    },

    async handleLogin(dataLogin) {
      try {
        const result = await axios({
          method: "POST",
          url: `${import.meta.env.VITE_ORIGIN_URL}/users/login`,
          data: dataLogin,
        });

        if (!result?.data?.access_token) {
          throw new Error(
            "Frontend error: somehow unable to get result.data.access_token"
          );
        }

        this.handleSuccessfulLogin(result.data);
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleLogout() {
      try {
        Swal.fire({
          title: "Are you sure you want to log out?",
          showCancelButton: true,
          confirmButtonText: `Yes`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire("Successfully logged out!", "", "success");
            localStorage.clear();
            this.checkAuth();
            window.location.href = "/";
          }
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    async getAllTransactions() {
      try {
        const result = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_ORIGIN_URL}/transactions`,
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        // also save in pinia's global state
        this.transactions = result.data;

        return result.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async getUser() {
      try {
        const result = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_ORIGIN_URL}/users`,
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        // also save in pinia's global state
        this.user = result.data;

        return result.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async getAllWallets() {
      try {
        const result = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_ORIGIN_URL}/wallets`,
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        // also save in pinia's global state
        this.wallets = result.data;

        return result.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async getAllCategories() {
      try {
        const result = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_ORIGIN_URL}/categories`,
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        // also save in pinia's global state
        this.categories = result.data;

        return result.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async fixerioConvertCurrency(from, to, amount) {
      try {
        const result = await axios({
          method: "GET",
          url: `https://api.freecurrencyapi.com/v1/latest?apikey=${
            import.meta.env.VITE_FIXERIO_API_KEY
          }&currencies=${to}&base_currency=${from}`,
          // url: `https://api.apilayer.com/fixer/latest?base=${from}&symbols=${to}`,
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        Swal.fire({
          icon: "success",
          title: `Successfully converted ${amount} ${from} to ${
            result.data.data["USD"] * amount
          } ${to}`,
        });

        // also save in pinia's global state
        return (this.conversionResult = result.data.data["USD"] * amount);
      } catch (error) {
        this.handleError(error);
      }
    },

    async getCMCWraperAPI() {
      try {
        const result = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_ORIGIN_URL}/information/crypto`,
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        Swal.fire({
          icon: "success",
          title: `Successfully retrieved crypto prices`,
        });

        // also save in pinia's global state
        return (this.cmcResponse = result.data);
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleCreateTransaction(newTransactionObject) {
      try {
        const result = await axios({
          method: "POST",
          url: `${import.meta.env.VITE_ORIGIN_URL}/transactions`,
          data: newTransactionObject,
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        if (!result?.data) {
          throw new Error("Frontend error: somehow unable to get result.data");
        }

        Swal.fire({
          icon: "success",
          title: "Successfully recorded a new transaction!",
        });
        this.router.push("/transactions");
      } catch (error) {
        this.handleError(error);
      }
    },
  },
});
