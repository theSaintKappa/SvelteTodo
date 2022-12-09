<script>
    import { getAuth, signInWithPopup, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";
    import Todos from "./Todos.svelte";
    import FaGithub from "svelte-icons/fa/FaGithub.svelte";

    let user;
    const auth = getAuth();
    const provider = new GithubAuthProvider();

    const login = () => {
        signInWithPopup(auth, provider).catch((error) => {
            console.error("An error occured while signing in.", error);
        });
    };

    onAuthStateChanged(auth, (u) => (user = u));
</script>

{#if user}
    <header class="logged-in">
        <span><strong>Hyia,</strong> {user.displayName}!</span>
        <img src={user.photoURL} alt="" />
        <button on:click={() => auth.signOut()}>Sign out</button>
    </header>

    <Todos uid={user.uid} />
{:else}
    <header class="logged-out">
        <button on:click={login}
            >Login with
            <div class="icon" aria-label="GitHub"><FaGithub /></div>
        </button>
    </header>
{/if}

<style>
    button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        border-radius: 10px;
        transition: scale 250ms cubic-bezier(0.68, -0.55, 0.27, 1.55), transform 100ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
        background: linear-gradient(#eeeeee, transparent);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    button::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 0%;
        background-color: #3110567a;
        bottom: 0;
        z-index: -1;
        transition: height 150ms ease;
    }
    button:hover::before {
        height: 100%;
    }
    button:active {
        transform: scale(0.85);
    }
    .icon {
        display: inline-block;
        height: 1.2rem;
    }
    header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100vw;
    }
    .logged-in > * {
        pointer-events: auto;
    }
    img {
        height: 64px;
        border-radius: 50%;
    }
    .logged-in {
        justify-content: end;
        padding: 0.3rem 1rem;
        position: sticky;
        top: 0;
        pointer-events: none;
        backdrop-filter: blur(3px);
    }
    .logged-in button {
        padding: 0.2rem 0.28rem;
    }
    .logged-out {
        height: 100vh;
        justify-content: center;
    }
    .logged-out button {
        font-size: 32px;
        padding: 0.25rem 0.5rem;
    }
</style>
