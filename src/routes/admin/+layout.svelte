<script lang="ts">
	import { onMount, setContext } from 'svelte';
	const session = { password: '' };
	setContext('admin-session', session);
	let password = '';
	let authenticated = false;
	let loading = true;
	let error = '';
	onMount(async () => {
		password = sessionStorage.getItem('admin_password') || '';
		if (password) await login();
		else loading = false;
	});
	async function login() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/admin/session', {
				method: 'POST',
				headers: { 'x-admin-password': password }
			});
			if (!response.ok)
				throw new Error(response.status === 401 ? 'รหัสผ่านไม่ถูกต้อง' : 'เข้าสู่ระบบไม่สำเร็จ');
			sessionStorage.setItem('admin_password', password);
			session.password = password;
			authenticated = true;
			password = '';
		} catch (cause) {
			sessionStorage.removeItem('admin_password');
			error = cause instanceof Error ? cause.message : 'เข้าสู่ระบบไม่สำเร็จ';
		} finally {
			loading = false;
		}
	}
	function logout() {
		authenticated = false;
		session.password = '';
		password = '';
		sessionStorage.removeItem('admin_password');
		sessionStorage.removeItem('question_review_password');
		sessionStorage.removeItem('weekly_admin_auth');
	}
</script>

{#if authenticated}
	<nav
		aria-label="Admin"
		class="flex flex-wrap items-center gap-2 p-4 bg-base-200 text-base-content"
	>
		<a class="btn btn-ghost" href="/admin/logic">Logic</a>
		<a class="btn btn-ghost" href="/admin/questions">Quiz</a>
		<button class="btn btn-ghost ml-auto" on:click={logout}>ออกจากระบบ</button>
	</nav>
	<slot />
{:else}
	<div class="min-h-screen flex items-center justify-center p-4">
		<form
			class="card w-full max-w-sm bg-base-200 text-base-content shadow-xl"
			on:submit|preventDefault={login}
		>
			<div class="card-body">
				<h1 class="card-title">Code Breaker Admin</h1>
				<label for="admin-password">รหัสผ่าน (Password)</label>
				<input
					id="admin-password"
					class="input "
					type="password"
					autocomplete="current-password"
					bind:value={password}
					required
				/>
				{#if error}<p role="alert" class="text-error-content">{error}</p>{/if}
				<button class="btn btn-primary text-primary-content" disabled={loading || !password}
					>{loading ? 'กำลังโหลด…' : 'เข้าสู่ระบบ'}</button
				>
			</div>
		</form>
	</div>
{/if}
