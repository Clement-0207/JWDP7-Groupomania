NetWork Groupomania

Création réseau social Groupomania style "Reddit" afin que les employés écrivent et/ou partagent sur des sujets divers.

Le projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 7.0.2.

Pour faire fonctionner le projet, vous devez installer node-sass à part.

## Development server

Démarrez `ng serve` pour avoir accès au serveur de développement. Rendez-vous sur `http://localhost:4200/`.

Les fonctionnalités importantes :

- Mise en ligne d'un titre et d'un post principal
- Répondre au post, le modifier, l'évaluer au moyen d'un like ou dislike et le supprimer
- Créer, identifier, modifier et supprimer un compte
- Créer un compte administrateur via MySQL

Tout d'abord il faut cloner le repo : https://github.com/Clement-0207/JWDP7-Groupomania

Puis entrons dans le dossier Groupomania grâce au terminal ou à l'invite de commande :

cd JWDP7_groupomania

______________________________________________

Lancement Backend:

Nous allons recréer la base de données.

Connectez vous à MySQL avec vos identifiants, puis:

Vous avez le script sql pour initialiser la base de donnée dans le projet au nom de : setupdb.sql

Commande sql:`CREATE DATABASE mygroupo;`

______________________________________________

Table structure for table `account`

DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_on` timestamp NOT NULL,
  `last_login` timestamp NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `password_UNIQUE` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
______________________________________________

Table structure for table `comment`

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_body` varchar(255) DEFAULT NULL,
  `post_message_id` int NOT NULL,
  `account_id` int NOT NULL,
  `written_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `fk_comments_post1_idx` (`post_message_id`),
  KEY `fk_comments_account1_idx` (`account_id`),
  CONSTRAINT `fk_comments_account1_cascade` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_post1_cascade` FOREIGN KEY (`post_message_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
______________________________________________

Table structure for table `comment_like`

DROP TABLE IF EXISTS `comment_like`;
CREATE TABLE `comment_like` (
  `comment_id` int NOT NULL,
  `account_id` int NOT NULL,
  `comment_like` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`comment_id`,`account_id`),
  KEY `comment_like_ibfk_2_cascade` (`account_id`),
  CONSTRAINT `comment_like_ibfk_1_cascade` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `comment_like_ibfk_2_cascade` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
______________________________________________

Table structure for table `post`

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `body` varchar(355) NOT NULL,
  `written_on` timestamp NOT NULL,
  `account_id` int NOT NULL,
  PRIMARY KEY (`post_id`),
  UNIQUE KEY `message_id_UNIQUE` (`post_id`),
  KEY `fk_message_account1_idx` (`account_id`),
  CONSTRAINT `fk_message_account1_cascade` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
______________________________________________

Table structure for table `post_like`

DROP TABLE IF EXISTS `post_like`;
CREATE TABLE `post_like` (
  `post_id` int NOT NULL,
  `account_id` int NOT NULL,
  `post_like` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`post_id`,`account_id`),
  KEY `post_like_ibfk_2_cascade` (`account_id`),
  CONSTRAINT `post_like_ibfk_1_cascade` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `post_like_ibfk_2_cascade` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#########################################

Retour sur le projet, dans le terminal nous sommes dans le dossier JWDP7_groupomania.
Lancez les commandes suivantes:
- cd backend
- npm install
    
Création d'un fichier .env :

TOKEN= "Créez votre propre Token"

DB_HOST=localhost

DB_USER="Votre username MySQL"

DB_PASS="Votre mot de passe MySQL"

DB_DATABASE=mygroupo



Installez ensuite nodemon : 
- npm install -g nodemon

Et on lance le backend (dans le terminal toujours) :
- nodemon server
   

Votre backend est à présent opérationnel
    
#########################################


:arrow_right: Frontend:

Dans un nouveau terminal ouvert depuis le dossier groupomania,
utilisez la commande suivante : 
- cd frontend

Puis :

- npm install

Et finalement :

- ng serve

##########################

Pour créer un compte admin :

Il suffit de créer un compte grâce au site sur la page signup

Allez ensuite dans MySQL où il faut rentrer le code suivant :

``
UPDATE account
SET is_admin = 1
WHERE account_id = "(l’id du compte à passer en admin)";
``

Par défaut le serveur client est accessible en local via le port 4200: http://localhost:4200/