import Redis from 'ioredis';

// Connexion à ta base Redis
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    const BOTS_KEY = 'approved_bots_v3';
    const SUGGEST_KEY = 'pending_suggestions_v3';

    // Autoriser les requêtes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // ACTION : On supprime tout dès que le script est appelé
        await redis.del(BOTS_KEY);
        await redis.del(SUGGEST_KEY);
        
        // On renvoie un tableau vide pour que le site affiche "0 bots"
        return res.status(200).json({ 
            status: "success", 
            message: "La base de données Redis a été vidée." 
        });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
}

