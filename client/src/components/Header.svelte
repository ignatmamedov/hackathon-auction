<script>
    import { isLoggedIn, user, logout } from '../utils/auth';
    import page from 'page';

    $: userEmail = $user?.email;
    $: userInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : '';
    $: isAdmin = $user?.isAdmin;

    /**
     * Logs out the current user and redirects to the login page.
     */
    const handleLogout = () => {
        logout();
        page('/login');
    };
</script>

<nav class="sticky top-0 left-0 w-full flex justify-between items-center border-b border-gray-300 p-4 bg-blue-600 shadow-md z-50">
    <div class="text-left">
        <a href="/" class="block text-2xl font-bold text-white">CodeMarket</a>
        <p class="block text-sm italic text-gray-200">"Where Hackathon Projects Find New Life"</p>
    </div>

    {#if $isLoggedIn}
        <div class="flex items-center gap-4">
            {#if !isAdmin}
                <a href="/my-dashboard" class="text-white hover:underline">My Dashboard</a>
            {/if}

            <button on:click={handleLogout} class="text-red-200 hover:text-white hover:underline">Logout</button>

            <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-blue-600 font-bold">
                {userInitials}
            </div>
        </div>
    {:else}
        <div class="flex items-center gap-4">
            <a href="/login" class="text-white hover:underline">Login</a>
            <a href="/sign-up" class="text-white hover:underline">Sign Up</a>
        </div>
    {/if}
</nav>
