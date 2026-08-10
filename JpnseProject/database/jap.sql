DROP DATABASE IF EXISTS Vocab;
CREATE DATABASE Vocab;
USE Vocab;

CREATE TABLE Hiragana(
    Word VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Def VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL
);

CREATE TABLE Katakana(
    Word VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Def VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL
); 

CREATE TABLE Kanji(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Word VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Romanji VARCHAR (50) CHARACTER SET utf8mb4 NOT NULL,
    Def VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL
); 

CREATE TABLE Glossary(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Word VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Romanji VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Def VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL
); 

CREATE TABLE Sentences(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Sentence VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Def VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL
); 

SET NAMES 'utf8mb4';

INSERT INTO Hiragana (Word, Def) VALUES 
('あ','a'), ('え','e'), ('い','i'), ('お','o'), ('う','u'), 
('か','ka'), ('け','ke'), ('き','ki'), ('こ','ko'), ('く','ku'), 
('さ','sa'), ('せ','se'), ('し','shi'), ('そ','so'), ('す','su'), 
('た','ta'), ('て','te'), ('ち','chi'), ('と','to'), ('つ','tsu'), 
('な','na'), ('ね','ne'), ('に','ni'), ('の','no'), ('ぬ','nu'), 
('は','ha'), ('へ','he'), ('ひ','hi'), ('ほ','ho'), ('ふ','fu'), 
('ま','ma'), ('め','me'), ('み','mi'), ('も','mo'), ('む','mu'), 
('や','ya'), ('よ','yo'), ('ゆ','yu'), ('ら','ra'), ('れ','re'), 
('り','ri'), ('ろ','ro'), ('る','ru'), ('わ','wa'), ('を','wo'), 
('ん','n'), ('が','ga'), ('げ','ge'), ('ぎ','gi'), ('ご','go'), 
('ぐ','gu'), ('ざ','za'), ('ぜ','ze'), ('じ','ji'), ('ぞ','zo'), 
('ず','zu'), ('だ','da'), ('で','de'), ('ぢ','ji'), ('ど','do'), 
('づ','ji'), ('ば','ba'), ('べ','be'), ('び','bi'), ('ぼ','bo'), 
('ぶ','bu'), ('ぱ','pa'), ('ぺ','pe'), ('ぴ','pi'), ('ぽ','po'), 
('ぷ','pu');

INSERT INTO Katakana (Word, Def) VALUES 
('ア', 'a'), ('エ','e'), ('イ', 'i'), ('オ','o'), ('ウ','u'),
('カ', 'ka'), ('ケ','ke'), ('キ', 'ki'), ('コ','ko'), ('ク','ku'),
('サ', 'sa'), ('セ','se'), ('シ', 'shi'), ('ソ','so'), ('ス','su'),
('タ', 'ta'), ('テ','te'), ('チ', 'chi'), ('ト','to'), ('ツ','tsu'),
('ナ', 'na'), ('ネ','ne'), ('ニ', 'ni'), ('ノ','no'), ('ヌ','nu'),
('ハ', 'ha'), ('ヘ','he'), ('ヒ', 'hi'), ('ホ','ho'), ('フ','fu'),
('マ', 'ma'), ('メ','me'), ('ミ', 'mi'), ('モ','mo'), ('ム','mu'),
('ヤ', 'ya'), ('ヨ','yo'), ('ユ', 'yu'), ('ラ','ra'), ('レ','re'),
('リ', 'ri'), ('ロ','ro'), ('ル', 'ru'), ('ワ','wa'), ('ヲ','wo'),
('ン', 'n'), ('ガ','ga'), ('ゲ', 'ge'), ('ギ','gi'), ('ゴ','go'),
('グ', 'gu'), ('ザ','za'), ('ゼ', 'ze'), ('ジ','ji'), ('ゾ','zo'),
('ズ', 'zu'), ('ダ','da'), ('デ', 'de'), ('ヂ','ji'), ('ド','do'),
('ヅ', 'ji'), ('バ','ba'), ('ベ', 'be'), ('ビ','bi'), ('ボ','bo'),
('ブ', 'bu'), ('パ','pa'), ('ペ', 'pe'), ('ピ','pi'), ('ポ','po'),
('プ','pu');

INSERT INTO Kanji (Word, Romanji, Def) VALUES
('日','nichi','day'), ('日','jitsu','day'), ('日','hi','sun'), ('日','ka','counter for days');

INSERT INTO Sentences (Sentence, Def) VALUES
('これは小さいです','This is small');

INSERT INTO Glossary (Word, Romanji, Def) VALUES
('あなた','anata','You');
