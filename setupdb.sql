
CREATE DATABASE mygroupo;
USE mygroupo;

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

