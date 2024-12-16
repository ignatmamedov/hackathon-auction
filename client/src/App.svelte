<script>
  import logo from './assets/svelte.png'
  import router from 'page';

  import { isLoggedIn, user } from './utils/auth';

  import Header from "./components/Header.svelte";
  import Login from "./pages/Login.svelte";
  import SignUp from "./pages/SignUp.svelte";
  import UserDashboard from "./pages/UserDashboard.svelte";
  import Home from "./pages/Home.svelte";
  import Lot from "./pages/Lot.svelte";

  let page;
  let params;
  let currentRoute;

  router('/', (ctx) => {
    page = Home;
    currentRoute = ctx.pathname;
  });

  router('/lots/:id', (ctx) => {
    page = Lot;
    currentRoute = ctx.pathname;
    params = ctx.params;
  });

  router('/login', (ctx) => {
    if ($isLoggedIn) {
      return router.redirect('/');
    }
      page = Login;
      currentRoute = ctx.pathname;
      params = ctx;
  });

  router('/sign-up', (ctx) => {
    if ($isLoggedIn) {
      return router.redirect('/');
    }
    page = SignUp;
    currentRoute = ctx.pathname;
    params = ctx;
  });

  router('/my-dashboard', (ctx) => {
    if (!$isLoggedIn || ($isLoggedIn && $user?.isAdmin)) {
      return router.redirect('/');
    }
    page = UserDashboard;
    currentRoute = ctx.pathname;
    params = ctx;
  });

  router.start();

</script>

<main>
  <Header active={currentRoute} />
  <svelte:component this={page} {params} />

</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

</style>
