/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50703
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50703
File Encoding         : 65001

Date: 2019-12-19 14:43:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog_list
-- ----------------------------
DROP TABLE IF EXISTS `blog_list`;
CREATE TABLE `blog_list` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `account` varchar(10) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT NULL,
  `like_num` int(20) DEFAULT NULL,
  `read_num` int(20) DEFAULT NULL,
  `vote_down` varchar(1) NOT NULL DEFAULT '0',
  `like` varchar(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of blog_list
-- ----------------------------
INSERT INTO `blog_list` VALUES ('22', 'a标题2', 'a内容2', 'a', '2019-12-11 17:12:17', '15', '89', '0', '0');
INSERT INTO `blog_list` VALUES ('23', 'b标题1', 'b内容1', 'b', '2019-12-12 14:12:17', '0', '0', '1', '0');
INSERT INTO `blog_list` VALUES ('24', 'a标题3', 'a内容3', 'a', '2019-12-12 13:49:30', '0', '0', '1', '0');

-- ----------------------------
-- Table structure for user_list
-- ----------------------------
DROP TABLE IF EXISTS `user_list`;
CREATE TABLE `user_list` (
  `account` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `head_portrait` varchar(50) DEFAULT NULL,
  UNIQUE KEY `account_id` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_list
-- ----------------------------
INSERT INTO `user_list` VALUES ('a', '1', '/uploadImgs/1576228043660a.png');
INSERT INTO `user_list` VALUES ('b', '2', '/uploadImgs/1575878901422a.png');
