import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const { method } = req;
    const BOTS_KEY = 'approved_bots_v2';
    const SUGGEST_KEY = 'pending_suggestions_v2';

    // Autoriser les requêtes depuis ton domaine
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // --- LECTURE DES DONNÉES (GET) ---
        if (method === 'GET') {
            const type = req.query.type; // 'approved' ou 'pending'
            const key = type === 'pending' ? SUGGEST_KEY : BOTS_KEY;
            const data = await kv.get(key);
            return res.status(200).json(data || []);
        }

        // --- MODIFICATION DES DONNÉES (POST) ---
        if (method === 'POST') {
            const { action, data, password } = req.body;

            // 1. Suggestion publique (pas besoin de mot de passe)
            if (action === 'suggest') {
                const current = await kv.get(SUGGEST_KEY) || [];
                current.push({ ...data, id: Date.now() });
                await kv.set(SUGGEST_KEY, current);
                return res.status(200).json({ success: true });
            }

            // 2. Actions Admin (Vérification du mot de passe)
            if (password !== 'admin123') {
                return res.status(401).json({ error: 'Mot de passe incorrect' });
            }

            if (action === 'approve') {
                let pending = await kv.get(SUGGEST_KEY) || [];
                let approved = await kv.get(BOTS_KEY) || [];
                const botIndex = pending.findIndex(b => b.id === data.id);
                
                if (botIndex > -1) {
                    approved.push(pending[botIndex]);
                    pending.splice(botIndex, 1);
                    await kv.set(BOTS_KEY, approved);
                    await kv.set(SUGGEST_KEY, pending);
                }
                return res.status(200).json({ success: true });
            }

            if (action === 'delete') {
                let approved = await kv.get(BOTS_KEY) || [];
                approved = approved.filter(b => b.name !== data.name);
                await kv.set(BOTS_KEY, approved);
                return res.status(200).json({ success: true });
            }

            if (action === 'add_direct') {
                let approved = await kv.get(BOTS_KEY) || [];
                approved.push({ ...data, id: Date.now() });
                await kv.set(BOTS_KEY, approved);
                return res.status(200).json({ success: true });
            }
        }

        return res.status(405).json({ error: 'Méthode non autorisée' });

    } catch (error) {
        console.error('Erreur KV:', error);
        return res.status(500).json({ error: 'Erreur serveur base de données' });
    }
}

