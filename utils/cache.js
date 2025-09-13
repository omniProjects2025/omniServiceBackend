const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes for better performance

class InMemoryCache {
	constructor() {
		this.store = new Map();
	}

	_generateKey(key) {
		return typeof key === 'string' ? key : JSON.stringify(key);
	}

	set(key, value, ttlMs = DEFAULT_TTL_MS) {
		const cacheKey = this._generateKey(key);
		const expiresAt = Date.now() + ttlMs;
		this.store.set(cacheKey, { value, expiresAt });
	}

	get(key) {
		const cacheKey = this._generateKey(key);
		const entry = this.store.get(cacheKey);
		if (!entry) return undefined;
		if (entry.expiresAt < Date.now()) {
			this.store.delete(cacheKey);
			return undefined;
		}
		return entry.value;
	}

	delete(key) {
		const cacheKey = this._generateKey(key);
		this.store.delete(cacheKey);
	}

	clear() {
		this.store.clear();
	}
}

const cache = new InMemoryCache();

module.exports = { cache, DEFAULT_TTL_MS };


