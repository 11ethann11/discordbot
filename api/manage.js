import Redis from 'ioredis';

// Initialisation du client Redis
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

            // Logique de suggestion (publique)
            if (action === 'suggest') {
                const currentStr = await redis.get(SUGGEST_KEY);
                const current = currentStr ? JSON.parse(currentStr) : [];
                current.push({ ...data, id: Date.now() });
                await redis.set(SUGGEST_KEY, JSON.stringify(current));
                return res.status(200).json({ success: true });
            }

            // --- ACTIONS ADMIN (Vérification simple du password ici si nécessaire) ---
            
            // Action : Modifier un bot existant
            if (action === 'edit') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                
                // On cherche l'index du bot par son ancien nom
                const index = approved.findIndex(b => b.name === data.oldName);
                
                if (index !== -1) {
                    // On met à jour les données en conservant l'ID s'il existe
                    approved[index] = { 
                        ...approved[index], 
                        ...data.updatedData 
                    };
                    await redis.set(BOTS_KEY, JSON.stringify(approved));
                    return res.status(200).json({ success: true });
                } else {
                    return res.status(404).json({ error: "Bot non trouvé" });
                }
            }

            // Action : Approuver une suggestion
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

            // Action : Supprimer un bot approuvé
            if (action === 'delete') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                approved = approved.filter(b => b.name !== data.name);
                await redis.set(BOTS_KEY, JSON.stringify(approved));
                return res.status(200).json({ success: true });
            }

            // Action : Supprimer une requête en attente
            if (action === 'delete_pending') {
                const pendingStr = await redis.get(SUGGEST_KEY);
                let pending = pendingStr ? JSON.parse(pendingStr) : [];
                pending = pending.filter(b => b.id !== data.id);
                await redis.set(SUGGEST_KEY, JSON.stringify(pending));
                return res.status(200).json({ success: true });
            }

            // Action : Ajouter directement (Admin)
            if (action === 'add_direct') {
                const approvedStr = await redis.get(BOTS_KEY);
                let approved = approvedStr ? JSON.parse(approvedStr) : [];
                approved.push({ ...data, id: Date.now() });
                await redis.set(BOTS_KEY, JSON.stringify(approved));
                return res.status(200).json({ success: true });
            }
        }
    } catch (err) {
        console.error("Erreur Backend:", err);
        return res.status(500).json({ error: err.message });
    }
}

