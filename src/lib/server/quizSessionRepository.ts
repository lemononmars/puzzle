import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { QuizSession } from './quizSessionStore';
import { recordDiagnostic } from '#lib/diagnostics.js';

export interface QuizSessionRepository {
	get(id: string): Promise<QuizSession | null>;
	put(session: QuizSession): Promise<void>;
	delete(id: string): Promise<void>;
}

export class InMemoryQuizSessionRepository implements QuizSessionRepository {
	private sessions = new Map<string, QuizSession>();

	async get(id: string) {
		return this.sessions.get(id) || null;
	}
	async put(session: QuizSession) {
		this.sessions.set(session.id, session);
	}
	async delete(id: string) {
		this.sessions.delete(id);
	}
}

class SupabaseQuizSessionRepository implements QuizSessionRepository {
	constructor(private client: SupabaseClient) {}

	async get(id: string): Promise<QuizSession | null> {
		const { data, error } = await this.client
			.from('quiz_sessions')
			.select('payload, expires_at')
			.eq('id', id)
			.maybeSingle();
		if (error) throw error;
		if (!data || new Date(data.expires_at).getTime() <= Date.now()) {
			if (data) await this.delete(id);
			return null;
		}
		return data.payload as QuizSession;
	}

	async put(session: QuizSession): Promise<void> {
		const expiresAt = new Date(session.createdAt + 2 * 60 * 60 * 1000).toISOString();
		const { error } = await this.client
			.from('quiz_sessions')
			.upsert({ id: session.id, payload: session, expires_at: expiresAt });
		if (error) throw error;
	}

	async delete(id: string): Promise<void> {
		const { error } = await this.client.from('quiz_sessions').delete().eq('id', id);
		if (error) throw error;
	}
}

export function createQuizSessionRepository(): QuizSessionRepository {
	const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (url && serviceKey) {
		return new SupabaseQuizSessionRepository(
			createClient(url, serviceKey, {
				auth: { persistSession: false, autoRefreshToken: false }
			})
		);
	}
	recordDiagnostic('quiz.session_repository_fallback', { adapter: 'memory' }, 'warn');
	return new InMemoryQuizSessionRepository();
}
