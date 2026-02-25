import Redis from 'ioredis';

// Initialisation sécurisée du client Redis via variable d'environnement
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    const { method } = req;
    const BOTS_KEY = 'approved_bots_v3';
    const SUGGEST_KEY = 'pending_suggestions_v3';

    // Headers CORS pour éviter les erreurs de navigateur sur mobile/Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Gestion de la pré-vérification CORS
    if (method === 'OPTIONS') return res.status(200).end();

    try {
        // --- RÉCUPÉRATION DES DONNÉES (GET) ---
        if (method === 'GET') {
            const type = req.query.type;
            const key = type === 'pending' ? SUGGEST_KEY : BOTS_KEY;
            const data = await redis.get(key);
            
            // On s'assure de toujours renvoyer un tableau vide si Redis est vide
            // Cela empêche le frontend React de rester bloqué sur "Initialisation"
            const parsed = data ? JSON.parse(data) : [];
            return res.status(200).json(Array.isArray(parsed) ? parsed : []);
        }

        // --- ACTIONS DE MODIFICATION (POST) ---
        if (method === 'POST') {
            const { action, data } = req.body;

            // 1. Suggestion publique (Ajout aux bots en attente)
            if (action === 'suggest') {
                const currentStr = await redis.get(SUGGEST_KEY);
                const current = currentStr ? JSON.parse(currentStr) : [];
                current.push({ ...data, id: Date.now() });
                await redis.set(SUGGEST_KEY, JSON.stringify(current));
                return res.status(200).json({ success: true });
            }

            // 2. Ajout direct par l'Admin (Supporte un bot seul OU une liste JSON)
            if (action === 'add_direct') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                if (!Array.isArray(approved)) approved = [];

                if (Array.isArray(data)) {
                    // Importation massive d'un tableau de bots
                    const preparedData = data.map(bot => ({
                        ...bot,
                        id: bot.id || Math.random().toString(36).substr(2, 9)
                    }));
                    approved = [...approved, ...preparedData];
                } else {
                    // Ajout d'un bot unique via le formulaire
                    approved.push({ ...data, id: Date.now() });
                }

                await redis.set(BOTS_KEY, JSON.stringify(approved));
                return res.status(200).json({ success: true });
            }

            // 3. Suppression d'un bot approuvé
            if (action === 'delete') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                if (Array.isArray(approved)) {
                    approved = approved.filter(b => b.name !== data.name);
                    await redis.set(BOTS_KEY, JSON.stringify(approved));
                }
                return res.status(200).json({ success: true });
            }

            // 4. Suppression d'une suggestion
            if (action === 'delete_pending') {
                const pendingStr = await redis.get(SUGGEST_KEY);
                let pending = pendingStr ? JSON.parse(pendingStr) : [];
                if (Array.isArray(pending)) {
                    pending = pending.filter(b => b.id !== data.id);
                    await redis.set(SUGGEST_KEY, JSON.stringify(pending));
                }
                return res.status(200).json({ success: true });
            }

            // 5. Action d'urgence : Vider la base
            if (action === 'flush_all') {
                await redis.del(BOTS_KEY);
                await redis.del(SUGGEST_KEY);
                return res.status(200).json({ success: true, message: "Database cleared" });
            }
        }
    } catch (err) {
        console.error("API Error:", err);
        // On renvoie un tableau vide en cas d'erreur critique pour ne pas casser l'UI
        return res.status(200).json([]);
    }
}

