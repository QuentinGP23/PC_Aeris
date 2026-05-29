# Comment utiliser le deck `PRESENTATION_FINALE_DECK.md`

Le deck est écrit en **format Marp** (Markdown enrichi). Il peut être visualisé ou exporté en PDF / PPTX / HTML.

## Aperçu rapide dans VS Code

1. Installer l'extension **[Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)**
2. Ouvrir `PRESENTATION_FINALE_DECK.md`
3. Cliquer sur l'icône "Open preview to the side" — le deck s'affiche slide par slide

## Export en PDF (recommandé pour le rendu jury)

Avec Marp CLI installé globalement (`npm install -g @marp-team/marp-cli`) :

```bash
marp docs/PRESENTATION_FINALE_DECK.md --pdf --allow-local-files
```

Génère `docs/PRESENTATION_FINALE_DECK.pdf` au format 16:9.

Pour inclure les notes de présentation (script oral) dans le PDF :

```bash
marp docs/PRESENTATION_FINALE_DECK.md --pdf --pdf-notes --allow-local-files
```

## Export en PowerPoint

```bash
marp docs/PRESENTATION_FINALE_DECK.md --pptx --allow-local-files
```

Génère `docs/PRESENTATION_FINALE_DECK.pptx` éditable dans PowerPoint / Google Slides / Keynote.

> ⚠️ L'export PPTX rend les slides en images (les styles CSS sont aplatis). Pour éditer le texte ensuite, mieux vaut repartir d'un template PowerPoint et copier-coller le contenu slide par slide.

## Export en HTML (présentation web)

```bash
marp docs/PRESENTATION_FINALE_DECK.md --html
```

Génère `docs/PRESENTATION_FINALE_DECK.html` — ouvrable dans n'importe quel navigateur, navigation au clavier (←/→).

## Structure du deck

| Slide | Sujet | Source du script |
|---|---|---|
| 1 | Couverture | PITCH.md |
| 2 | Le problème | PITCH.md |
| 3 | Trois frustrations | PITCH.md |
| 4 | Notre réponse | PITCH.md, BUSINESS_MODEL.md |
| 5 | Trois profils | PITCH.md |
| 6 | Différenciateur prix | PITCH.md, Sprint 2 |
| 7 | Démo produit | MVP Sprints 1-5 |
| 8 | Marché | ETUDE_MARCHE.md |
| 9 | Cible | BUSINESS_MODEL.md |
| 10 | Positionnement | BUSINESS_PLAN.md |
| 11 | Modèle économique | BUSINESS_MODEL.md |
| 12 | Projections | BUSINESS_PLAN.md |
| 13 | Avancement | mvp-scope.md, sprint reviews |
| 14 | Roadmap | agile/roadmap.md |
| 15 | Équipe | EQUIPE_IDEALE.md |
| 16 | L'ask | BUSINESS_PLAN.md |
| 17 | Closing | PITCH.md |

Chaque slide contient également le **script oral** dans un commentaire HTML (`<!-- -->`), visible uniquement en mode présentateur.

## Personnalisation visuelle

Le thème est défini dans le frontmatter `style:` du `.md` (Aeris Dark : `#04040A` / indigo `#6366F1`). Pour ajuster :
- Couleurs : modifier les valeurs hex dans le bloc CSS
- Typo : nécessite que `Inter`, `Space Grotesk` et `JetBrains Mono` soient installées (déjà chargées via Google Fonts dans le projet)
- Fond : remplacer `background: #04040A` dans la règle `section` par une image ou un gradient

## Itérations recommandées avant le jury

1. **Captures HD du produit** — remplacer la slide 6 (démo) par 3-4 vraies captures de l'app en prod
2. **Validation chiffres** — vérifier que les projections financières correspondent au discours de pitch attendu en M2
3. **Backup démo vidéo** — enregistrer 30 sec de l'application pour parer à un problème de connexion
4. **Répétitions chronométrées** — viser 18-22 min sur l'ensemble, ne pas dépasser
5. **One-pager A4** — produire un résumé imprimé à laisser au jury
