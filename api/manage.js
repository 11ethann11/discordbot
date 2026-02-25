import Redis from 'ioredis';

// Initialisation sécurisée de Redis
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    const { method } = req;
    const BOTS_KEY = 'approved_bots_v3';
    const SUGGEST_KEY = 'pending_suggestions_v3';

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') return res.status(200).end();

    try {
        if (method === 'GET') {
            const type = req.query.type;
            const key = type === 'pending' ? SUGGEST_KEY : BOTS_KEY;
            const data = await redis.get(key);
            
            // CRITIQUE : Toujours renvoyer un tableau vide si Redis est vide
            // Sinon le frontend React reste bloqué sur "Initialisation"
            const result = data ? JSON.parse(data) : [];
            return res.status(200).json(result);
        }

        if (method === 'POST') {
            const { action, data } = req.body;

            if (action === 'suggest') {
                const currentStr = await redis.get(SUGGEST_KEY);
                const current = currentStr ? JSON.parse(currentStr) : [];
                current.push({ ...data, id: Date.now() });
                await redis.set(SUGGEST_KEY, JSON.stringify(current));
                return res.status(200).json({ success: true });
            }

            if (action === 'add_direct') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                
                // GESTION IMPORT MASSIF (Tableau)
                if (Array.isArray(data)) {
                    const cleanData = data.map(bot => ({
                        ...bot,
                        id: bot.id || Date.now() + Math.random()
                    }));
                    approved = [...approved, ...cleanData];
                } else {
                    approved.push({ ...data, id: Date.now() });
                }

                await redis.set(BOTS_KEY, JSON.stringify(approved));
                return res.status(200).json({ success: true });
            }

            if (action === 'delete') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                approved = approved.filter(b => b.name !== data.name);
                await redis.set(BOTS_KEY, JSON.stringify(approved));
                return res.status(200).json({ success: true });
            }

            if (action === 'delete_pending') {
                const pendingStr = await redis.get(SUGGEST_KEY);
                let pending = pendingStr ? JSON.parse(pendingStr) : [];
                pending = pending.filter(b => b.id !== data.id);
                await redis.set(SUGGEST_KEY, JSON.stringify(pending));
                return res.status(200).json({ success: true });
            }
        }
    } catch (err) {
        console.error("Erreur API:", err);
        // On renvoie un 200 avec tableau vide au lieu d'une erreur 500 pour débloquer le UI
        return res.status(200).json([]);
    }
}

