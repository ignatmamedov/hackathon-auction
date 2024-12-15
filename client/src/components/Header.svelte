<script>
    import { isLoggedIn, user, logout } from '../utils/auth';
    import page from 'page';

    $: userEmail = $user?.email;
    $: isAdmin = $user?.isAdmin;

    const handleLogout = () => {
        logout();
        page('/login');
    };
</script>

<nav>
    <a href="/">Home</a>

    {#if $isLoggedIn}
        <span>Welcome, {userEmail}</span>

        {#if isAdmin}
            <a href="/admin-dashboard">Admin Dashboard</a>
        {:else}
            <a href="/my-dashboard">My Dashboard</a>
        {/if}

        <button on:click={handleLogout}>Logout</button>
    {:else}
        <a href="/login">Login</a>
        <a href="/sign-up">Sign Up</a>
    {/if}
</nav>
