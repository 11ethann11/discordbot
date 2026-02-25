import Redis from 'ioredis';

// Initialisation du client Redis avec la variable de ta capture d'écran
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    const { method } = req;
    const BOTS_KEY = 'approved_bots_v3';
    const SUGGEST_KEY = 'pending_suggestions_v3';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') return res.status(200).end();

    try {
        if (method === 'GET') {
            const type = req.query.type;
            const key = type === 'pending' ? SUGGEST_KEY : BOTS_KEY;
            
            // ioredis utilise get/set mais demande un JSON.parse car il stocke des strings
            const data = await redis.get(key);
            return res.status(200).json(data ? JSON.parse(data) : []);
        }

        if (method === 'POST') {
            const { action, data, password } = req.body;

            if (action === 'suggest') {
                const currentStr = await redis.get(SUGGEST_KEY);
                const current = currentStr ? JSON.parse(currentStr) : [];
                current.push({ ...data, id: Date.now() });
                await redis.set(SUGGEST_KEY, JSON.stringify(current));
                return res.status(200).json({ success: true });
            }

            if (password !== 'admin123') {
                return res.status(401).json({ error: 'Invalide' });
            }

            if (action === 'approve') {
                const pendingStr = await redis.get(SUGGEST_KEY);
                const approvedStr = await redis.get(BOTS_KEY);
                let pending = pendingStr ? JSON.parse(pendingStr) : [];
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                
                const bot = pending.find(b => b.id === data.id);
                if (bot) {
                    approved.push(bot);
                    pending = pending.filter(b => b.id !== data.id);
                    await redis.set(BOTS_KEY, JSON.stringify(approved));
                    await redis.set(SUGGEST_KEY, JSON.stringify(pending));
                }
                return res.status(200).json({ success: true });
            }

            if (action === 'delete') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                approved = approved.filter(b => b.name !== data.name);
                await redis.set(BOTS_KEY, JSON.stringify(approved));
                return res.status(200).json({ success: true });
            }

            if (action === 'add_direct') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                approved.push({ ...data, id: Date.now() });
                await redis.set(BOTS_KEY, JSON.stringify(approved));
                return res.status(200).json({ success: true });
            }
        }
    } catch (err) {
        console.error("Erreur Redis:", err);
        return res.status(500).json({ error: err.message });
    }
}

