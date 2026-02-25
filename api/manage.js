import Redis from 'ioredis';

// Utilisation d'un try/catch global pour l'initialisation Redis
let redis;
try {
    redis = new Redis(process.env.REDIS_URL);
} catch (e) {
    console.error("Erreur de connexion Redis:", e);
}

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
            
            // Forcer le retour d'un tableau vide si null pour éviter le blocage "Initialisation"
            const result = data ? JSON.parse(data) : [];
            return res.status(200).json(result);
        }

        if (method === 'POST') {
            const { action, data, password } = req.body;

            // Vérification basique de l'action
            if (!action) return res.status(400).json({ error: "Action manquante" });

            if (action === 'suggest') {
                const currentStr = await redis.get(SUGGEST_KEY);
                const current = currentStr ? JSON.parse(currentStr) : [];
                current.push({ ...data, id: Date.now() });
                await redis.set(SUGGEST_KEY, JSON.stringify(current));
                return res.status(200).json({ success: true });
            }

            // Pour add_direct via Admin
            if (action === 'add_direct') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                
                // Si data est un tableau (import JSON massif)
                if (Array.isArray(data)) {
                    const preparedData = data.map(bot => ({ ...bot, id: bot.id || Date.now() + Math.random() }));
                    approved = [...approved, ...preparedData];
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
        }
    } catch (err) {
        console.error("Erreur Backend:", err);
        // Toujours renvoyer du JSON même en cas d'erreur
        return res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
}

