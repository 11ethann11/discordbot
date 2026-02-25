import Redis from 'ioredis';

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
            const data = await redis.get(key);
            return res.status(200).json(data ? JSON.parse(data) : []);
        }

        if (method === 'POST') {
            const { action, data, password } = req.body;

            // Une simple vérification de mot de passe (à adapter selon tes besoins)
            // if (action !== 'suggest' && password !== "TON_PASSWORD") return res.status(403).json({error: 'Interdit'});

            if (action === 'suggest') {
                const currentStr = await redis.get(SUGGEST_KEY);
                const current = currentStr ? JSON.parse(currentStr) : [];
                current.push({ ...data, id: Date.now() });
                await redis.set(SUGGEST_KEY, JSON.stringify(current));
                return res.status(200).json({ success: true });
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

            // --- NOUVELLE ACTION : UPDATE ---
            if (action === 'update') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                const index = approved.findIndex(b => b.id === data.id);
                if (index !== -1) {
                    approved[index] = { ...approved[index], ...data };
                    await redis.set(BOTS_KEY, JSON.stringify(approved));
                    return res.status(200).json({ success: true });
                }
                return res.status(404).json({ error: 'Bot non trouvé' });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

