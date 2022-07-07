DELETE FROM users;
DELETE FROM billboards;
DELETE FROM wards;
DELETE FROM districts;
DELETE FROM cities;

SELECT * FROM cities;
SELECT * FROM districts;
SELECT * FROM wards;

INSERT INTO cities 
(name,abbreviation,photo_url,lat,long)
VALUES 
('Ho Chi Minh City','HCMC','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Saigon_skyline_night_view.jpg/1200px-Saigon_skyline_night_view.jpg',10.762622,106.660172),
('Ha Noi','HN','https://a.cdn-hotels.com/gdcs/production34/d595/f10f5e16-621f-433e-aa26-41336e4243b9.jpg',21.033333,105.849998);


INSERT INTO districts 
(name,abbreviation,photo_url,lat,long,city_id)
VALUES
('Binh Thanh','BT',NULL,10.810583,106.709145,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('7','D7',NULL,10.735719,106.727203,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City'));


INSERT INTO wards 
(name,lat,long,district_id)
VALUES
('Tan Thuan Dong',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Thuan Tay',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Kieng',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Hung',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Quy',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Phong',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Phu',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Binh Thuan',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Phu Thuan',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Phu My',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7'));




