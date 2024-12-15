<script>
  import logo from './assets/svelte.png'
  import router from 'page';

  import { isLoggedIn } from './utils/auth';

  import Header from "./components/Header.svelte";
  import Login from "./pages/Login.svelte";
  import SignUp from "./pages/SignUp.svelte";
  import UserDashboard from "./pages/UserDashboard.svelte";
  import Lots from "./pages/Lots.svelte";

  let page;
  let params;
  let currentRoute;

  router('/', (ctx) => {
    page = Lots;
    currentRoute = ctx.pathname;
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
    page = UserDashboard;
    currentRoute = ctx.pathname;
    params = ctx;
  });

  router.start();
</script>

<main>
  <img src={logo} alt="Svelte Logo" />
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

  img {
    height: 16rem;
    width: 16rem;
  }

</style>
