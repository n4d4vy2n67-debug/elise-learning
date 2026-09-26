ELISE LEARNING — V1 déployable

Fichiers:
- index.html : interface
- app.js : logique des exercices et sauvegarde locale
- manifest.webmanifest : installation comme web-app
- sw.js : cache hors-ligne

Déploiement le plus simple:
1. Décompresser l'archive.
2. Déposer le dossier sur un hébergeur statique (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.).
3. Ouvrir l'URL HTTPS dans Safari sur iPhone.
4. Partager > Sur l'écran d'accueil.

Important:
L'envoi automatique des rapports par e-mail n'est pas inclus dans ce paquet statique.
Il doit passer par une fonction serveur/API sécurisée (p. ex. Resend) afin de ne jamais exposer une clé ou un mot de passe dans le navigateur.
