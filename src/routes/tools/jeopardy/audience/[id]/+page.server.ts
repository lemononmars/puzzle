export async function load({ params }: { params: { id: string } }) {
	const { id } = params;
	return { id };
}
