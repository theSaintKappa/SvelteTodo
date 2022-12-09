<script>
    import { db } from "../lib/firebaseConfig";
    import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import FaPlus from "svelte-icons/fa/FaPlus.svelte";

    export let uid;

    let todos = [];
    const colRef = collection(db, "users", uid, "todos");
    let message = "Fetching data...";
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
        message = snapshot.empty ? "No todos found!" : null;

        let fbTodosArray = [];
        snapshot.forEach((doc) => {
            let todo = { ...doc.data(), id: doc.id };

            fbTodosArray = [todo, ...fbTodosArray];
        });

        todos = fbTodosArray;
    });

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) unsubscribe && unsubscribe();
    });

    let newTodoTitle = "";
    let inpudError = false;

    const addTodo = async (e) => {
        e.preventDefault();

        if (newTodoTitle === "") return (inpudError = true);

        const colRef = await addDoc(collection(db, "users", uid, "todos"), {
            title: newTodoTitle,
            isCompleted: false,
            createdAt: serverTimestamp(),
            uid,
        });
        inpudError = false;
        newTodoTitle = "";
    };

    const markTodoComplete = async (todo) => {
        await updateDoc(doc(db, "users", uid, "todos", todo.id), {
            isCompleted: !todo.isCompleted,
        });
    };

    const deleteTodo = async (todo) => {
        await deleteDoc(doc(db, "users", uid, "todos", todo.id));
    };

    // $: console.table(todos);
</script>

<section>
    <form>
        <input class:input-error={inpudError} type="text" placeholder="Add todo" bind:value={newTodoTitle} />
        <button on:click={addTodo} class="add-btn"><div class="icon"><FaPlus /></div></button>
    </form>

    <ol>
        {#if message !== null}
            <p class="message">{message}</p>
        {/if}

        {#each todos as todo}
            <li class:completed={todo.isCompleted}>
                <span>{todo.title}</span>
                <button class="mark-done" on:mouseup={() => markTodoComplete(todo)}>✔️</button>
                {#if todo.isCompleted}
                    <button class="mark-done" on:mouseup={() => deleteTodo(todo)}>🗑️</button>
                {/if}
            </li>
        {/each}
    </ol>
</section>

<style>
    :root {
        --clr-border: #3d2259;
    }
    p {
        margin: 1rem;
    }
    li::marker {
        color: #ffffff;
    }
    ol {
        list-style-position: inside;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 0.35rem;
        margin-bottom: 0.5rem;
        gap: 0.2rem;
    }
    form {
        display: flex;
        justify-content: center;
        position: sticky;
        top: 0.5rem;
    }
    input,
    .add-btn {
        padding: 0.3rem;
    }
    input {
        border-radius: 10000px 0 0 10000px;
        padding-left: 0.45rem;
        outline: none;
        border: none;
        border: 2px solid var(--clr-border);
        border-right: 1px solid var(--clr-border);
    }
    .icon {
        height: 0.85rem;
        transition: rotate 500ms cubic-bezier(0.68, -0.55, 0.27, 1.55), scale 150ms ease;
    }
    .add-btn:hover > .icon {
        rotate: 90deg;
        scale: 1.25;
    }
    .add-btn {
        border-radius: 0 10000px 10000px 0;
        padding-right: 0.45rem;
        border: 2px solid var(--clr-border);
        border-left: 1px solid var(--clr-border);
    }
    .mark-done {
        transition: scale 150ms, rotate 100ms;
        background-color: transparent;
        outline: none;
        border: none;
    }
    .mark-done:hover {
        scale: 1.2;
        rotate: 5deg;
    }
    .input-error {
        background-color: rgb(255, 78, 62);
    }
    .completed {
        text-decoration: line-through;
    }
    .message {
        font-weight: bold;
        letter-spacing: 4px;
    }
</style>
