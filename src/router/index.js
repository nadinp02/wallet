import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index.js';
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/users/LoginView.vue'
import RegisterView from '../views/users/RegisterView.vue'
import PurchaseView from '../views/PurchaseView.vue'
import SellView from '../views/SellingView.vue'
import HistoryView from '../views/HistoryView.vue'
import CurrentStateView from '../views/CurrentStateView.vue'



const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { protectedView: true }
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: PurchaseView,
    meta: { protectedView: true }
  },
  {
    path: '/sell',
    name: 'Sell',
    component: SellView,
    meta: { protectedView: true }
  },
  {
    path: '/sell',
    name: 'Sell',
    component: SellView,
    meta: { protectedView: true }
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
    meta: { protectedView: true }
  },
  {
    path: '/current-state',
    name: 'Current State',
    component: CurrentStateView,
    meta: { protectedView: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const view = to.matched.some((item) => item.meta.protectedView);
  if (view && store.state.id == null) {
    next('/')
  } else {
    next();
  }
})
export default router;
