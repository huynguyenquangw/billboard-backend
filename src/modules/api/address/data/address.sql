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
('1','D1','https://file4.batdongsan.com.vn/2021/02/20/JGcIp0rf/20210220130247-1e5b.jpg',10.770941,106.691765,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('3','D3','https://top10tphcm.com/wp-content/uploads/2020/11/cac-tuyen-duong-tai-quan-3-tphcm.jpg',10.784274,106.678627,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('4','D4','https://file4.batdongsan.com.vn/2021/06/17/JGcIp0rf/20210617212626-1a5f.jpg',10.76432,106.70497,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('5','D5','https://top10tphcm.com/wp-content/uploads/2020/11/cac-tuyen-duong-tai-quan-5-tphcm.jpg',10.756129,106.670376,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('6','D6','https://top10tphcm.com/wp-content/uploads/2020/11/cac-tuyen-duong-tai-quan-6-tphcm.jpg',10.742596,106.629535,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('7','D7','https://i.ytimg.com/vi/RioieU8sdnE/maxresdefault.jpg',10.735719,106.727203,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('8','D8','https://top10tphcm.com/wp-content/uploads/2020/11/danh-sach-uy-ban-nhan-dan-quan-8.jpg',10.738327,106.663025,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('10','D10','https://file4.batdongsan.com.vn/2021/03/30/akCJKkFO/20210330173404-99a0.jpg',10.771127,106.669735,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('11','D11','https://upload.wikimedia.org/wikipedia/commons/3/36/Dam-sen-tuonglamphotos.jpg',10.75943,106.65893,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('12','D12','https://top10tphcm.com/wp-content/uploads/2020/11/cac-tuyen-duong-tai-quan-12-tphcm.jpg',10.852357,106.628150,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Binh Tan','BTn','https://binhtan.hochiminhcity.gov.vn/Portal_CMS-portlet/img/no-image.png',10.13489,105.75968,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Go Vap','GV','https://upload.wikimedia.org/wikipedia/commons/a/a6/Nguyen_van_nghi%2C_p7%2C_Go_vap_%2C_hcmvn_-_panoramio.jpg',10.838678,106.665290,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Phu Nhuan','PN','http://displaysolution.vn/Image/Picture/man-hinh-led/quan-phu-nhuan.jpg',10.799194,106.680264,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Tan Binh','TB','https://upload.wikimedia.org/wikipedia/commons/e/e8/Lang_Cha_Ca-_Tan_Binh_-_panoramio.jpg',10.802029,106.649307,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Tan Phu','TP','https://blog.homenext.vn/hs-fs/hubfs/quan-tan-phu.jpg?width=900&name=quan-tan-phu.jpg',11.267745,107.429239,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Binh Chanh','BC','https://phathung.vn/wp-content/uploads/2019/11/binhchanh.jpg',10.687392,106.593854,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Can Gio','CG','https://vcdn-vnexpress.vnecdn.net/2021/04/01/thi-tran-can-thanh-9647-161408-7773-7520-1617284610.jpg',10.405450,106.962912,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Cu Chi','CC','https://znews-photo.zingcdn.me/w660/Uploaded/zdhwqmjwq/2021_03_22/thumbcuchi.jpg',10.97333,106.49325,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Hoc Mon','HM','https://img.dothi.net/2020/09/30/Z9BcC3fq/keu-goi-dau-tu-23-du-an-hoc-mon-d2d3.jpg',10.883968,106.587061,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Nha Be','NB','https://image.thanhnien.vn/660x370/Uploaded/2022/wpxlcqjwq/2022_04_28/549599-hinh-2-duong-nguyen-van-linh-dang-mo-rong-ngoc-duong-4200.jpg?1',10.695264,106.704874,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City')),
('Binh Thanh','BT','https://file4.batdongsan.com.vn/2021/02/20/JGcIp0rf/20210220100718-e421.jpg',10.810583,106.709145,(SELECT "id" FROM "cities" WHERE name='Ho Chi Minh City'));


INSERT INTO wards 
(name,lat,long,district_id)
VALUES
('Ben Thanh',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D1')),
('Vo Thi Sau',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D3')),
('1',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D4')),
('2',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D5')),
('3',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D6')),
('Tan Thuan Dong',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Thuan Tay',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Kieng',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Hung',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Quy',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Phong',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Tan Phu',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Binh Thuan',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Phu Thuan',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7')),
('Phu My',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D7'))
('4',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D8')),
('5',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D10')),
('6',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D11')),
('Tan Thoi Nhat',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='D12')),
('An Lac',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='BTn')),
('15',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='GV')),
('7',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='PN')),
('12',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='TB')),
('Tay Thanh',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='TP')),
('An Phu Tay',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='BC')),
('Can Thanh',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='CG')),
('An Nhon Tay',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='CC')),
('Dong Thanh',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='HM')),
('Phuoc Loc',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='NB')),
('11',NULL,NULL,(SELECT "id" FROM "districts" WHERE abbreviation='BT'));