export async function load({ fetch, params }: any) {
	const { id } = params;
	const res = await fetch(`/api/puzzle/rebus/${id}`);
	const content = await res.json();

	return {
		content,
		id
	};
}
