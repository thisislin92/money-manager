<template>
  <footer>
    <nav class="navbar justify-content-center fixed-bottom navbar-light bg-light pb-4" style="font-size: 0.65rem">
      <div class="row w-100">
        <div class="col-3 text-center">
          <router-link to="/">
            <i class="bi bi-house-fill fs-2"></i>
            <div class="navbar-label">Home</div>
          </router-link>
        </div>
        <div class="col-2 text-center">
          <router-link to="/wallets">
            <i class="bi bi-wallet fs-2"></i>
            <div class="navbar-label">Wallets</div>
          </router-link>
        </div>
        <div class="col-2 text-center justify-content-center px-0">
          <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%);">
            <router-link to="/transactions-create">
              <button class="btn btn-success rounded-circle plus-button" type="button" style="border-radius: 50%;">
                <i class="bi bi-plus-lg fs-2"></i>
              </button>
            </router-link>
          </div>
        </div>
        <div class="col-2 text-center px-0">
          <router-link to="/transactions">
            <i class="bi bi-cash-stack fs-2"></i>
            <div class="navbar-label">Transactions</div>
          </router-link>
        </div>
        <div class="col-3 text-center">
          <router-link to="/settings">
            <i class="bi bi-gear-wide-connected fs-2"></i>
            <div class="navbar-label">Settings</div>
          </router-link>
        </div>
      </div>
    </nav>
  </footer>
</template>

