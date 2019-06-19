### MrBot
###### Il vous fera péter les plombs à coup sûr !
___

### *Présentation*
*MrBot* est un bot qui s'apparente à un **trolleur professionnel**, ne dites pas que vous n'étiez pas prévenus x)

Ce projet est destiné aux **développeurs** qui souhaitent construire leur propre bot Discord.  
C'est une base pour vous aider ou découvrir les librairies utilisées.  
**Ce projet a été conçu en TypeScript !**

### Installation & configuration
*MrBot* se veut être simple dans son utilisation, autant de votre côté, en tant que DEV, que du côté de vos utilisateurs.

Pour ajouter *MrBot* à votre projet npm:
~~~~
npm install --save mr-bot
~~~~

Avant de lancer le bot, assurez vous d'avoir remplacé:
- **DISCORD_BOT_TOKEN** par le token de votre bot discord
- **YOUTUBE_DATA_API_TOKEN** par le token de votre application Youtube Data Api

Pour lancer le bot: 
~~~~typescript
import Bot from 'mr-bot'

const config = require('../path/to/config.json')
new Bot(config)
~~~~

### *Commandes*
Le préfixe des commandes est **!** *(point d'exclamation)*, vous **devrez** *faire précéder le nom de la commande de ce préfixe*.  
Voici la liste des commandes actuellement fonctionnelles
- **!info**
- **!help**
- **!ping**


- **!tts \<message\>**
- **!say \<message\>**
- **!everyone \<message\>**


- **!soundbox help**
- **!soundbox list**

### SoundBox
*MrBot* possède une **SoundBox** qui lui permet de sauvegarder des vidéos YouTube qu'il pourra venir jouer dans votre salon lorsque vous le souhaitez !

Pour ce faire, rien de plus simple, commencez par ajouter un son à la SoundBox, vous aurez besoin de 2 choses:
1. Un nom unique pour votre son, sans espaces (tirets (-) et underscores (_) autorisés)
2. Le lien d'une vidéo YouTube

Une fois que vous êtes munis de ces 2 informations, envoyez la commande suivante: 
(N'oubliez pas de remplacer <nom_du_son> par le nom que vous avez choisis et <lien_youtube> par le lien de la vidéo que vous voulez enregistrer)

**!<nom_du_son> <lien_youtube>**

Une fois chose faite, vous pouvez demander à *MrBot* de venir jouer votre son lorsque vous êtes dans un channel vocal en envoyant la commande suivante:

**!<nom_du_son>**

Si vous souhaitez retirer un son de la SoundBox, vous pouvez le faire en ajoutant 'remove', comme ceci: 

**!<nom_du_son> remove**