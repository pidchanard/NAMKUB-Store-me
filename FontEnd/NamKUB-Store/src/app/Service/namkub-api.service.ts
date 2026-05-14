import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Alltime, BestSale, Orders, Products, Restock, Stock, Summary, Supplier, Users } from '../model/products';
import { MOCK_ALLTIME, MOCK_BEST_SALE, MOCK_ORDERS, MOCK_PRODUCTS, MOCK_RESTOCKS, MOCK_STOCKS, MOCK_SUMMARIES, MOCK_SUPPLIERS, MOCK_USERS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class NAMKUBAPIService {

  private readonly storagePrefix = 'namkub:';

  private products = this.loadCollection<Products>('products', MOCK_PRODUCTS);
  private stocks = this.loadCollection<Stock>('stocks', MOCK_STOCKS);
  private restocks = this.loadCollection<Restock>('restocks', MOCK_RESTOCKS);
  private users = this.loadCollection<Users>('users', MOCK_USERS, 'mockUsers');
  private orders = this.loadCollection<Orders>('orders', MOCK_ORDERS);
  private summaries = this.loadCollection<Summary>('summaries', MOCK_SUMMARIES);
  private alltime = this.loadCollection<Alltime>('alltime', MOCK_ALLTIME);
  private bestSale = this.loadCollection<BestSale>('bestSale', MOCK_BEST_SALE);
  private suppliers = this.loadCollection<Supplier>('suppliers', MOCK_SUPPLIERS);

  constructor() { }

  getAllProduct(): Observable<Products[]> {
    return of([...this.products]);
  }
  
  getAllStockView(): Observable<Stock[]>{
    return of([...this.stocks]);
  }

  getAllRestock(): Observable<Restock[]>{
    return of([...this.restocks]);
  }

  getAllUsers(): Observable<Users[]>{
    return of([...this.users]);
  }
  getAllOrders(): Observable<Orders[]>{
    return of([...this.orders]);
  }
  getActiveProducts(): Observable<Products[]>{
    const activeProducts = this.products.filter(product => product.Product_status === 'active');
    return of(activeProducts);
  }
  getSummary():Observable<Summary[]>{
    return of([...this.summaries]);
  }
  getAlltime():Observable<Alltime[]>{
    return of([...this.alltime]);
  }
  getBestSale():Observable<BestSale[]>{
    return of([...this.bestSale]);
  }
  getSuppliers():Observable<Supplier[]>{
    return of([...this.suppliers]);
  }

  searchProducts(query: string): Observable<Products[]> {
    const keyword = this.normalize(query);
    return of(this.products.filter(product =>
      this.normalize(product.Product_Name).includes(keyword) ||
      String(product.Product_ID).includes(keyword)
    ));
  }

  addProduct(product: Partial<Products> & { StockQuantity?: number; SupUnitPrice?: number }): Observable<Products> {
    const newProduct: Products = {
      Product_ID: this.nextId(this.products, 'Product_ID'),
      Product_Name: product.Product_Name || 'Local Product',
      Product_Picture: product.Product_Picture || 'namkub.png',
      Product_Size: Number(product.Product_Size),
      Product_Price: Number(product.Product_Price),
      Sup_ID: String(product.Sup_ID),
      Stock_Quantity: Number(product.StockQuantity || product.Stock_Quantity || 0),
      Product_status: 'active'
    };

    this.products = [...this.products, newProduct];
    this.stocks = [...this.stocks, {
      Stock_ID: this.nextId(this.stocks, 'Stock_ID'),
      Product_Name: newProduct.Product_Name,
      Stock_Quantity: newProduct.Stock_Quantity,
      Sup_Unitprice: 0,
      Sup_Name: this.suppliers.find(supplier => String(supplier.Sup_ID) === String(newProduct.Sup_ID))?.Sup_Name || 'Local Supplier'
    }];
    this.saveCollection('products', this.products);
    this.saveCollection('stocks', this.stocks);

    return of(newProduct);
  }

  updateProduct(productId: number, product: Partial<Products>): Observable<Products> {
    this.products = this.products.map(item =>
      item.Product_ID === productId ? { ...item, ...product, Sup_ID: String(product.Sup_ID ?? item.Sup_ID) } : item
    );
    this.saveCollection('products', this.products);

    return of(this.products.find(item => item.Product_ID === productId) as Products);
  }

  deleteProduct(productId: number): Observable<void> {
    this.products = this.products.filter(product => product.Product_ID !== productId);
    this.saveCollection('products', this.products);
    return of(void 0);
  }

  addSupplier(supplier: Pick<Supplier, 'Sup_Name'>): Observable<Supplier> {
    const newSupplier = { Sup_ID: this.nextId(this.suppliers, 'Sup_ID'), Sup_Name: supplier.Sup_Name };
    this.suppliers = [...this.suppliers, newSupplier];
    this.saveCollection('suppliers', this.suppliers);
    return of(newSupplier);
  }

  searchUsers(query: string): Observable<Users[]> {
    const keyword = this.normalize(query);
    return of(this.users.filter(user =>
      this.normalize(`${user.firstname} ${user.lastname} ${user.username} ${user.email} ${user.role}`).includes(keyword)
    ));
  }

  updateUser(userData: Partial<Users>): Observable<Users> {
    const username = userData.username || this.users[0].username;
    this.users = this.users.map(user =>
      user.username === username ? { ...user, ...userData } as Users : user
    );
    this.saveUsers();

    return of(this.users.find(user => user.username === username) || this.users[0]);
  }

  searchOrders(query: string): Observable<Orders[]> {
    const keyword = this.normalize(query);
    return of(this.orders.filter(order =>
      this.normalize(`${order.username} ${order.Product_Name} ${order.Cus_Address}`).includes(keyword)
    ));
  }

  addOrder(orderData: { username: string | null; Cus_Address: string; item: Array<{ Product_ID: number; Order_Quantity: number; Subtotal_Price: number }>; totalPrice: number }): Observable<Orders[]> {
    const createdOrders = orderData.item.map(item => {
      const product = this.products.find(productItem => productItem.Product_ID === item.Product_ID);
      return {
        Order_ID: this.nextId(this.orders, 'Order_ID'),
        Order_Date: new Date().toISOString(),
        Product_Name: product?.Product_Name || 'Local Product',
        Cus_Address: orderData.Cus_Address,
        Order_Quantity: item.Order_Quantity,
        Total_Price: orderData.totalPrice,
        username: orderData.username || 'customer',
        Subtotal_Price: String(item.Subtotal_Price)
      };
    });

    this.orders = [...this.orders, ...createdOrders];
    this.saveCollection('orders', this.orders);
    return of(createdOrders);
  }

  searchStocks(query: string): Observable<Stock[]> {
    const keyword = this.normalize(query);
    return of(this.stocks.filter(stock =>
      this.normalize(`${stock.Product_Name} ${stock.Sup_Name}`).includes(keyword)
    ));
  }

  searchRestocks(query: string, date: string): Observable<Restock[]> {
    const keyword = this.normalize(query);
    return of(this.restocks.filter(restock => {
      const matchesText = this.normalize(restock.Product_Name).includes(keyword);
      const matchesDate = !date || restock.Restock_Date.includes(date);
      return matchesText && matchesDate;
    }));
  }

  addRestock(restockData: Pick<Restock, 'Restock_Quantity' | 'Restock_Unitprice' | 'Stock_ID'>): Observable<Restock> {
    const stock = this.stocks.find(item => item.Stock_ID === Number(restockData.Stock_ID));
    const quantity = Number(restockData.Restock_Quantity);
    const unitPrice = Number(restockData.Restock_Unitprice);
    const newRestock: Restock = {
      Restock_ID: this.nextId(this.restocks, 'Restock_ID'),
      Product_Name: stock?.Product_Name || 'Local Product',
      Restock_Date: new Date().toISOString(),
      Restock_Quantity: quantity,
      Restock_Unitprice: unitPrice,
      Restock_TotalPrice: quantity * unitPrice,
      Stock_ID: Number(restockData.Stock_ID)
    };

    this.restocks = [...this.restocks, newRestock];
    this.stocks = this.stocks.map(item =>
      item.Stock_ID === Number(restockData.Stock_ID)
        ? { ...item, Stock_Quantity: item.Stock_Quantity + quantity, Sup_Unitprice: unitPrice }
        : item
    );
    this.saveCollection('restocks', this.restocks);
    this.saveCollection('stocks', this.stocks);

    return of(newRestock);
  }

  searchSummariesByMonth(month: number): Observable<Summary[]> {
    const monthName = new Date(2026, Number(month) - 1, 1).toLocaleString('en-US', { month: 'long' });
    return of(this.summaries.filter(summary => summary.Month === monthName));
  }

  login(username: string, password: string): Observable<{ token: string }> {
    const user = this.users.find(item => item.username === username);
    if (!user || password.trim().length === 0) {
      return throwError(() => ({ status: 401, message: 'Invalid username or password' }));
    }

    return of({ token: this.createLocalJwt(user) });
  }

  registerUser(userData: Partial<Users>): Observable<Users> {
    const newUser: Users = {
      User_ID: this.nextId(this.users, 'User_ID'),
      firstname: userData.firstname || '',
      lastname: userData.lastname || '',
      username: userData.username || `user${this.users.length + 1}`,
      email: userData.email || '',
      phone: userData.phone || '',
      role: 'customer',
      picture: userData.picture || ''
    };

    this.users = [...this.users, newUser];
    this.saveUsers();
    return of(newUser);
  }

  registerAdmin(adminData: Partial<Users>): Observable<Users> {
    const newUser: Users = {
      User_ID: this.nextId(this.users, 'User_ID'),
      firstname: adminData.firstname || '',
      lastname: adminData.lastname || '',
      username: adminData.username || `deliver${this.users.length + 1}`,
      email: adminData.email || '',
      phone: adminData.phone || '',
      role: 'admin',
      picture: adminData.picture || ''
    };

    this.users = [...this.users, newUser];
    this.saveUsers();
    return of(newUser);
  }

  private loadUsers(): Users[] {
    if (typeof localStorage === 'undefined') {
      return [...MOCK_USERS];
    }

    const savedUsers = localStorage.getItem(this.storageKey('users')) || localStorage.getItem('mockUsers');
    if (!savedUsers) {
      return [...MOCK_USERS];
    }

    try {
      return JSON.parse(savedUsers);
    } catch (error) {
      console.error('Failed to load mock users', error);
      return [...MOCK_USERS];
    }
  }

  private saveUsers(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    this.saveCollection('users', this.users);
  }

  private normalize(value: string | number | null | undefined): string {
    return String(value ?? '').toLowerCase().trim();
  }

  private nextId<T>(items: T[], key: keyof T): number {
    return Math.max(0, ...items.map(item => Number(item[key]) || 0)) + 1;
  }

  private createLocalJwt(user: Users): string {
    const header = this.base64Url({ alg: 'none', typ: 'JWT' });
    const payload = this.base64Url({ user, exp: Math.floor(Date.now() / 1000) + 86400 });
    return `${header}.${payload}.local-signature`;
  }

  private base64Url(value: object): string {
    return btoa(JSON.stringify(value))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private loadCollection<T>(key: string, fallback: T[], legacyKey?: string): T[] {
    if (typeof localStorage === 'undefined') {
      return [...fallback];
    }

    const storageKey = this.storageKey(key);
    const savedValue = localStorage.getItem(storageKey) || (legacyKey ? localStorage.getItem(legacyKey) : null);

    if (!savedValue) {
      localStorage.setItem(storageKey, JSON.stringify(fallback));
      return [...fallback];
    }

    try {
      const parsedValue = JSON.parse(savedValue) as T[];
      localStorage.setItem(storageKey, JSON.stringify(parsedValue));
      return parsedValue;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage`, error);
      localStorage.setItem(storageKey, JSON.stringify(fallback));
      return [...fallback];
    }
  }

  private saveCollection<T>(key: string, items: T[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey(key), JSON.stringify(items));
  }

  private storageKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }
}


