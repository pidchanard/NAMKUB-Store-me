import { Alltime, BestSale, Orders, Products, Restock, Stock, Summary, Supplier, Users } from '../model/products';

export const MOCK_PRODUCTS: Products[] = [
  {
    Product_ID: 1,
    Product_Name: 'Singha Drinking Water',
    Product_Picture: 'singha1500.jpg',
    Product_Size: 1500,
    Product_Price: 15,
    Sup_ID: '1',
    Stock_Quantity: 120,
    Product_status: 'inactive'
  },
  {
    Product_ID: 2,
    Product_Name: 'Crystal Drinking Water',
    Product_Picture: 'crystal 600.jpg',
    Product_Size: 600,
    Product_Price: 8,
    Sup_ID: '2',
    Stock_Quantity: 180,
    Product_status: 'inactive'
  },
  {
    Product_ID: 3,
    Product_Name: 'Nestle Pure Life',
    Product_Picture: 'Neste600.jpg',
    Product_Size: 600,
    Product_Price: 10,
    Sup_ID: '3',
    Stock_Quantity: 95,
    Product_status: 'inactive'
  },
  {
    Product_ID: 4,
    Product_Name: 'Minere Mineral Water',
    Product_Picture: 'Minere1500.png',
    Product_Size: 1500,
    Product_Price: 20,
    Sup_ID: '4',
    Stock_Quantity: 60,
    Product_status: 'inactive'
  },
  {
    Product_ID: 5,
    Product_Name: 'Singha Drinking Water Pack',
    Product_Picture: 'singha600.jpg',
    Product_Size: 600,
    Product_Pack: 12,
    Product_Description: 'น้ำดื่มสิงห์แพ็ค 12 ขวด ขนาด 600 มล. เหมาะสำหรับบ้าน ออฟฟิศ และงานประชุม',
    Product_Price: 50,
    Sup_ID: '1',
    Stock_Quantity: 85,
    Product_status: 'active'
  },
  {
    Product_ID: 6,
    Product_Name: 'Crystal Drinking Water Pack',
    Product_Picture: 'crystal 600.jpg',
    Product_Size: 600,
    Product_Pack: 12,
    Product_Description: 'น้ำดื่มคริสตัลแพ็ค 12 ขวด ขนาด 600 มล. สดชื่น ดื่มง่าย คุ้มค่า',
    Product_Price: 60,
    Sup_ID: '2',
    Stock_Quantity: 110,
    Product_status: 'active'
  },
  {
    Product_ID: 7,
    Product_Name: 'Nestle Pure Life Pack',
    Product_Picture: 'Neste600.jpg',
    Product_Size: 600,
    Product_Pack: 12,
    Product_Description: 'น้ำดื่มเนสท์เล่ เพียวไลฟ์แพ็ค 12 ขวด ขนาด 600 มล. สำหรับใช้ประจำวัน',
    Product_Price: 60,
    Sup_ID: '3',
    Stock_Quantity: 72,
    Product_status: 'active'
  },
  {
    Product_ID: 8,
    Product_Name: 'Minere Mineral Water Pack',
    Product_Picture: 'Minere500.png',
    Product_Size: 500,
    Product_Pack: 12,
    Product_Description: 'น้ำแร่ธรรมชาติมิเนเร่แพ็ค 12 ขวด ขนาด 500 มล. รสชาตินุ่มและสดชื่น',
    Product_Price: 100,
    Sup_ID: '4',
    Stock_Quantity: 48,
    Product_status: 'active'
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { Sup_ID: 1, Sup_Name: 'Singha Corporation' },
  { Sup_ID: 2, Sup_Name: 'Crystal Water' },
  { Sup_ID: 3, Sup_Name: 'Nestle Thailand' },
  { Sup_ID: 4, Sup_Name: 'Minere Supplier' }
];

export const MOCK_STOCKS: Stock[] = [
  { Stock_ID: 1, Product_Name: 'Singha Drinking Water', Stock_Quantity: 120, Sup_Unitprice: 9, Sup_Name: 'Singha Corporation' },
  { Stock_ID: 2, Product_Name: 'Crystal Drinking Water', Stock_Quantity: 180, Sup_Unitprice: 5, Sup_Name: 'Crystal Water' },
  { Stock_ID: 3, Product_Name: 'Nestle Pure Life', Stock_Quantity: 95, Sup_Unitprice: 6, Sup_Name: 'Nestle Thailand' },
  { Stock_ID: 4, Product_Name: 'Minere Mineral Water', Stock_Quantity: 60, Sup_Unitprice: 12, Sup_Name: 'Minere Supplier' },
  { Stock_ID: 5, Product_Name: 'Singha Drinking Water Pack', Stock_Quantity: 85, Sup_Unitprice: 36, Sup_Name: 'Singha Corporation' },
  { Stock_ID: 6, Product_Name: 'Crystal Drinking Water Pack', Stock_Quantity: 110, Sup_Unitprice: 42, Sup_Name: 'Crystal Water' },
  { Stock_ID: 7, Product_Name: 'Nestle Pure Life Pack', Stock_Quantity: 72, Sup_Unitprice: 44, Sup_Name: 'Nestle Thailand' },
  { Stock_ID: 8, Product_Name: 'Minere Mineral Water Pack', Stock_Quantity: 48, Sup_Unitprice: 76, Sup_Name: 'Minere Supplier' }
];

export const MOCK_RESTOCKS: Restock[] = [
  { Restock_ID: 1, Product_Name: 'Singha Drinking Water', Restock_Date: '2026-05-01', Restock_Quantity: 60, Restock_Unitprice: 9, Restock_TotalPrice: 540, Stock_ID: 1 },
  { Restock_ID: 2, Product_Name: 'Crystal Drinking Water', Restock_Date: '2026-05-05', Restock_Quantity: 80, Restock_Unitprice: 5, Restock_TotalPrice: 400, Stock_ID: 2 },
  { Restock_ID: 3, Product_Name: 'Nestle Pure Life', Restock_Date: '2026-05-08', Restock_Quantity: 50, Restock_Unitprice: 6, Restock_TotalPrice: 300, Stock_ID: 3 }
];

export const MOCK_USERS: Users[] = [
  { User_ID: 1, firstname: 'Admin', lastname: 'NAMKUB', username: 'admin', email: 'admin@namkub.test', phone: '0811111111', role: 'admin', picture: 'anya.jpg' },
  { User_ID: 2, firstname: 'Customer', lastname: 'Demo', username: 'customer', email: 'customer@namkub.test', phone: '0822222222', role: 'customer', picture: 'anya.jpg' },
  { User_ID: 3, firstname: 'Deliver', lastname: 'Demo', username: 'deliver', email: 'deliver@namkub.test', phone: '0833333333', role: 'Deliver', picture: 'anya.jpg' }
];

export const MOCK_ORDERS: Orders[] = [
  { Order_ID: 1, Order_Date: '2026-05-10T09:30:00', username: 'customer', Cus_Address: 'Bangkok, Thailand', Product_Name: 'Singha Drinking Water', Order_Quantity: 2, Total_Price: 30, Subtotal_Price: '30' },
  { Order_ID: 2, Order_Date: '2026-05-11T14:10:00', username: 'customer', Cus_Address: 'Chonburi, Thailand', Product_Name: 'Crystal Drinking Water', Order_Quantity: 6, Total_Price: 48, Subtotal_Price: '48' }
];

export const MOCK_SUMMARIES: Summary[] = [
  { No: '1', Month: 'May', Product: 'Singha Drinking Water', Quantity: 42, Income: 630, Capital: 378, Profit: 252 },
  { No: '2', Month: 'May', Product: 'Crystal Drinking Water', Quantity: 75, Income: 600, Capital: 375, Profit: 225 },
  { No: '3', Month: 'April', Product: 'Nestle Pure Life', Quantity: 31, Income: 310, Capital: 186, Profit: 124 }
];

export const MOCK_ALLTIME: Alltime[] = [
  { Quantity: 148, Income: 1540, Capital: 939, Profit: 601 }
];

export const MOCK_BEST_SALE: BestSale[] = [
  { No: '1', Month: 'May', Product: 'Crystal Drinking Water', Quantity: 75, Income: 600, Capital: 375, Profit: 225 }
];
