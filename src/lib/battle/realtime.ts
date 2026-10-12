import { recordDiagnostic } from '#lib/diagnostics.js';
import { supabaseClient } from '#lib/supabase.js';
import type { SupabaseRoomRow } from './types';

export function subscribeToLobbyRealtime(onRoomsChange: () => void) {
	const channel = supabaseClient
		.channel('battle-lobby-changes')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => onRoomsChange())
		.subscribe((status) => {
			if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
				recordDiagnostic('battle.realtime_connection_failed', { scope: 'lobby', status }, 'warn');
			}
		});
	return () => void supabaseClient.removeChannel(channel);
}

export function subscribeToRoomRealtime(roomId: string, onUpdate: (room: SupabaseRoomRow) => void) {
	const channel = supabaseClient
		.channel(`room-${roomId}`)
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'rooms', filter: `room_id=eq.${roomId}` },
			(payload) => {
				if (payload.new && (payload.new as SupabaseRoomRow).room_id === roomId) {
					onUpdate(payload.new as SupabaseRoomRow);
				}
			}
		)
		.subscribe((status) => {
			if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
				recordDiagnostic(
					'battle.realtime_connection_failed',
					{ scope: 'room', roomId, status },
					'warn'
				);
			}
		});
	return () => void supabaseClient.removeChannel(channel);
}
