<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from './Components/Home.svelte';
	import Navbar from './Components/Navbar.svelte';
	import StartGame from './Components/StartGame.svelte';

	export let url = "";
</script>
<style>
	.app-container {
		width: 100%;
		height: 100%;
		display: block;
	}

	div.main-content-container {
		height: 90%;
	}
</style>

<Router url={url}>
	<div class="app-container">
		<Navbar />
		<div class="main-content-container">
			<Route component={StartGame} path="game/start"/>
		</div>
	</div>
</Router>