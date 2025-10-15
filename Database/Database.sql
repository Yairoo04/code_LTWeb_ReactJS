

-- 0) Drop DB if exists (dev only)
IF DB_ID('GTN_Shop') IS NOT NULL
BEGIN
    ALTER DATABASE GTN_Shop SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE GTN_Shop;
END
GO

-- 1) Create DB and use it
CREATE DATABASE GTN_Shop;
GO
USE GTN_Shop;
GO

-- ============================
-- Roles & Users (auth)
-- ============================
CREATE TABLE dbo.Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) UNIQUE NULL,
    Email NVARCHAR(255) UNIQUE NULL,
    PasswordHash VARBINARY(8000) NOT NULL,
    PasswordSalt VARBINARY(128) NULL,
    FullName NVARCHAR(200) NULL,
    Phone NVARCHAR(30) NULL,
    RoleId INT NOT NULL DEFAULT 2, -- default Customer
    IsActive BIT DEFAULT 1,
    FailedLoginAttempts INT DEFAULT 0,
    LockedUntil DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT FK_Users_Role FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId)
);
GO

-- Login history & audit logs
CREATE TABLE dbo.LoginHistory (
    LoginHistoryId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    LoginTime DATETIME2 DEFAULT SYSUTCDATETIME(),
    IPAddress NVARCHAR(100) NULL,
    UserAgent NVARCHAR(1000) NULL,
    Success BIT NOT NULL,
    CONSTRAINT FK_LoginHistory_User FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.AuditLogs (
    AuditLogId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    Action NVARCHAR(500) NOT NULL,
    Meta NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AuditLogs_User FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
GO

-- ============================
-- Categories, Products, Discounts
-- ============================
CREATE TABLE dbo.Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL,
    Slug NVARCHAR(150) NULL,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(300) NOT NULL,
    Description NVARCHAR(1000) NULL,
    CategoryId INT NULL,
    SKU NVARCHAR(100) NULL,
    Price DECIMAL(18,2) NOT NULL CHECK (Price >= 0),
    DiscountPrice DECIMAL(18,2) NULL CHECK (DiscountPrice >= 0),
    Stock INT DEFAULT 0 CHECK (Stock >= 0),
    ImageUrl NVARCHAR(1000) NULL,
    IsPublished BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    CONSTRAINT FK_Products_Category FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(CategoryId),
    CONSTRAINT FK_Products_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_Products_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.Discounts (
    DiscountId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    DiscountPercent DECIMAL(5,2) NULL CHECK (DiscountPercent BETWEEN 0 AND 100),
    StartDate DATETIME2 NULL,
    EndDate DATETIME2 NULL,
    CONSTRAINT FK_Discounts_Product FOREIGN KEY (ProductId) REFERENCES dbo.Products(ProductId)
);
GO

-- ============================
-- Cart & CartItems
-- ============================
CREATE TABLE dbo.Carts (
    CartId UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    UserId INT NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT FK_Carts_User FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.CartItems (
    CartItemId INT IDENTITY(1,1) PRIMARY KEY,
    CartId UNIQUEIDENTIFIER NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1 CHECK (Quantity > 0),
    PriceAtAdded DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_CartItems_Cart FOREIGN KEY (CartId) REFERENCES dbo.Carts(CartId),
    CONSTRAINT FK_CartItems_Product FOREIGN KEY (ProductId) REFERENCES dbo.Products(ProductId)
);
GO

-- ============================
-- Orders & OrderItems
-- ============================
CREATE TABLE dbo.OrderStatus (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL UNIQUE
);
GO

INSERT INTO dbo.OrderStatus(StatusName) VALUES (N'Pending'), (N'Preparing'), (N'Shipping'), (N'Delivered'), (N'Completed'), (N'Cancelled');
GO

CREATE TABLE dbo.Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    RecipientName NVARCHAR(200) NOT NULL,
    RecipientPhone NVARCHAR(30) NOT NULL,
    RecipientAddress NVARCHAR(1000) NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0 CHECK (TotalAmount >= 0),
    StatusId INT NOT NULL DEFAULT 1, -- reference OrderStatus
    PaymentMethod NVARCHAR(100) NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT FK_Orders_User FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_Orders_Status FOREIGN KEY (StatusId) REFERENCES dbo.OrderStatus(StatusId)
);
GO

CREATE TABLE dbo.OrderItems (
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    ProductName NVARCHAR(300) NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    LineTotal AS (UnitPrice * Quantity) PERSISTED,
    CONSTRAINT FK_OrderItems_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId),
    CONSTRAINT FK_OrderItems_Product FOREIGN KEY (ProductId) REFERENCES dbo.Products(ProductId)
);
GO

-- ============================
-- Helper: TVP type for creating orders
-- ============================
CREATE TYPE dbo.OrderItemsType AS TABLE(
    ProductId INT,
    ProductName NVARCHAR(300),
    UnitPrice DECIMAL(18,2),
    Quantity INT
);
GO

-- ============================
-- Indexes for performance
-- ============================
CREATE INDEX IX_Products_Name ON dbo.Products(Name);
CREATE INDEX IX_Products_CategoryId ON dbo.Products(CategoryId);
CREATE INDEX IX_Orders_CreatedAt ON dbo.Orders(CreatedAt);
CREATE INDEX IX_Orders_UserId ON dbo.Orders(UserId);
CREATE INDEX IX_LoginHistory_IP ON dbo.LoginHistory(IPAddress);
CREATE INDEX IX_Users_Phone ON dbo.Users(Phone);
GO

-- ============================
-- Stored Procedures
-- ============================

-- RegisterUser: with password strength + salt+hash
CREATE OR ALTER PROCEDURE dbo.RegisterUser
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @Password NVARCHAR(4000),
    @RoleId INT = 2,             -- default Customer
    @Phone NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Check duplicates
    IF EXISTS (SELECT 1 FROM dbo.Users WHERE Username = @Username OR Email = @Email)
    BEGIN
        RAISERROR('Username or Email already exists.', 16, 1);
        RETURN;
    END

    DECLARE @pwd NVARCHAR(4000) = ISNULL(LTRIM(RTRIM(@Password)), '');

    IF LEN(@pwd) < 8
    BEGIN
        RAISERROR (N'Password must be at least 8 characters long.', 16, 1);
        RETURN;
    END
    IF @pwd COLLATE Latin1_General_CS_AS NOT LIKE '%[A-Z]%'
    BEGIN
        RAISERROR (N'Password must contain at least one uppercase letter.', 16, 1);
        RETURN;
    END
    IF @pwd COLLATE Latin1_General_CS_AS NOT LIKE '%[a-z]%'
    BEGIN
        RAISERROR (N'Password must contain at least one lowercase letter.', 16, 1);
        RETURN;
    END
    IF @pwd NOT LIKE '%[0-9]%'
    BEGIN
        RAISERROR (N'Password must contain at least one digit.', 16, 1);
        RETURN;
    END

    DECLARE @salt VARBINARY(32) = CRYPT_GEN_RANDOM(32);
    DECLARE @pw_bin VARBINARY(MAX) = CONVERT(VARBINARY(MAX), @Password);
    DECLARE @hash VARBINARY(8000) = HASHBYTES('SHA2_512', @salt + @pw_bin);

    INSERT INTO dbo.Users (
        Username, Email, Phone,
        PasswordSalt, PasswordHash, RoleId,
        FailedLoginAttempts, LockedUntil,
        CreatedAt, UpdatedAt
    )
    VALUES (
        @Username, @Email, @Phone,
        @salt, @hash, @RoleId,
        0, NULL,
        SYSUTCDATETIME(), SYSUTCDATETIME()
    );

    DECLARE @newUserId INT = SCOPE_IDENTITY();

    INSERT INTO dbo.AuditLogs(UserId, Action, Meta)
    VALUES (@newUserId, 'Register', CONCAT('Email=', @Email));

    SELECT @newUserId AS NewUserId;
END;
GO

-- LoginUser (with lockout)
CREATE OR ALTER PROCEDURE dbo.LoginUser
    @UsernameOrEmail NVARCHAR(255),
    @Password NVARCHAR(4000),
    @OutUserId INT OUTPUT,
    @OutRole NVARCHAR(50) OUTPUT,
    @IPAddress NVARCHAR(45) = NULL,
    @UserAgent NVARCHAR(512) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @IPAddress IS NOT NULL
    BEGIN
        DECLARE @recentFails INT = (SELECT COUNT(1) FROM dbo.LoginHistory WHERE IPAddress = @IPAddress AND Success = 0 AND LoginTime >= DATEADD(MINUTE,-15,SYSUTCDATETIME()));
        IF @recentFails >= 10
        BEGIN
            INSERT INTO dbo.LoginHistory(UserId, Success, IPAddress, UserAgent) VALUES(NULL, 0, @IPAddress, @UserAgent);
            RAISERROR('Too many failed login attempts from your IP. Try again later.',16,1);
            RETURN;
        END
    END

    SET @OutUserId = NULL; SET @OutRole = NULL;

    DECLARE @uid INT, @salt VARBINARY(100), @storedHash VARBINARY(8000), @failed INT, @lockedUntil DATETIME2;

    SELECT @uid = UserId, @salt = PasswordSalt, @storedHash = PasswordHash, @failed = FailedLoginAttempts, @lockedUntil = LockedUntil
    FROM dbo.Users
    WHERE (Username = @UsernameOrEmail OR Email = @UsernameOrEmail);

    IF @uid IS NULL
    BEGIN
        INSERT INTO dbo.LoginHistory(UserId, Success, IPAddress, UserAgent) VALUES(NULL, 0, @IPAddress, @UserAgent);
        RAISERROR('Invalid username/email or password.',16,1);
        RETURN;
    END

    IF @lockedUntil IS NOT NULL AND @lockedUntil > SYSUTCDATETIME()
    BEGIN
        DECLARE @lockedUntilStr NVARCHAR(30);
        SET @lockedUntilStr = CONVERT(NVARCHAR(30), @lockedUntil, 120);
        RAISERROR('Account locked until %s',16,1, @lockedUntilStr);
        RETURN;
    END

    DECLARE @pw_bin VARBINARY(MAX);
    SET @pw_bin = CONVERT(VARBINARY(MAX), @Password);
    DECLARE @computedHash VARBINARY(8000);
    SET @computedHash = HASHBYTES('SHA2_512', @salt + @pw_bin);

    IF @computedHash = @storedHash
    BEGIN
        UPDATE dbo.Users SET FailedLoginAttempts = 0, LockedUntil = NULL, UpdatedAt = SYSUTCDATETIME() WHERE UserId = @uid;
        SELECT @OutUserId = u.UserId, @OutRole = r.RoleName
        FROM dbo.Users u JOIN dbo.Roles r ON u.RoleId = r.RoleId WHERE u.UserId = @uid;
        INSERT INTO dbo.LoginHistory(UserId, Success, IPAddress, UserAgent) VALUES(@uid, 1, @IPAddress, @UserAgent);
        INSERT INTO dbo.AuditLogs(UserId, Action) VALUES(@uid, 'LoginSuccess');
    END
    ELSE
    BEGIN
        SET @failed = ISNULL(@failed,0) + 1;
        DECLARE @newLocked DATETIME2 = NULL;
        IF @failed >= 5 SET @newLocked = DATEADD(MINUTE, 15, SYSUTCDATETIME());

        UPDATE dbo.Users SET FailedLoginAttempts = @failed, LockedUntil = @newLocked, UpdatedAt = SYSUTCDATETIME() WHERE UserId = @uid;
        INSERT INTO dbo.LoginHistory(UserId, Success, IPAddress, UserAgent) VALUES(@uid, 0, @IPAddress, @UserAgent);
        INSERT INTO dbo.AuditLogs(UserId, Action, Meta) VALUES(@uid, 'LoginFailed', CONCAT('failed=', @failed));
        RAISERROR('Invalid username/email or password.',16,1);
    END
END;
GO

-- ChangePassword
CREATE OR ALTER PROCEDURE dbo.ChangePassword
    @UserId INT,
    @OldPassword NVARCHAR(4000),
    @NewPassword NVARCHAR(4000)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @salt VARBINARY(128), @stored VARBINARY(8000);
    SELECT @salt = PasswordSalt, @stored = PasswordHash FROM dbo.Users WHERE UserId = @UserId;
    IF @stored IS NULL
    BEGIN
        RAISERROR('User not found.',16,1); RETURN;
    END
    IF HASHBYTES('SHA2_512', @salt + CONVERT(VARBINARY(MAX), @OldPassword)) <> @stored
    BEGIN
        RAISERROR('Old password incorrect.',16,1); RETURN;
    END

    -- Password strength checks
    IF LEN(@NewPassword) < 12
    BEGIN
        RAISERROR('New password must be at least 12 characters long.',16,1); RETURN;
    END
    IF @NewPassword NOT LIKE '%[A-Z]%'
    BEGIN
        RAISERROR('New password must contain at least one uppercase letter.',16,1); RETURN;
    END
    IF @NewPassword NOT LIKE '%[a-z]%'
    BEGIN
        RAISERROR('New password must contain at least one lowercase letter.',16,1); RETURN;
    END
    IF @NewPassword NOT LIKE '%[0-9]%'
    BEGIN
        RAISERROR('New password must contain at least one digit.',16,1); RETURN;
    END
    IF @NewPassword NOT LIKE '%[^a-zA-Z0-9]%'
    BEGIN
        RAISERROR('New password must contain at least one special character.',16,1); RETURN;
    END

    IF HASHBYTES('SHA2_512', @salt + CONVERT(VARBINARY(MAX), @NewPassword)) = @stored
    BEGIN
        RAISERROR('New password must be different from the current password.',16,1); RETURN;
    END

    DECLARE @newSalt VARBINARY(64);
    SET @newSalt = CRYPT_GEN_RANDOM(32);
    DECLARE @newHash VARBINARY(8000);
    SET @newHash = HASHBYTES('SHA2_512', @newSalt + CONVERT(VARBINARY(MAX), @NewPassword));
    UPDATE dbo.Users SET PasswordSalt = @newSalt, PasswordHash = @newHash, UpdatedAt = SYSUTCDATETIME() WHERE UserId = @UserId;
    INSERT INTO dbo.AuditLogs(UserId, Action) VALUES(@UserId, 'ChangePassword');
END;
GO

-- Product management procedures (Admin)
CREATE OR ALTER PROCEDURE dbo.AddProduct
    @Name NVARCHAR(300),
    @Description NVARCHAR(1000) = NULL,
    @CategoryId INT = NULL,
    @SKU NVARCHAR(100) = NULL,
    @Price DECIMAL(18,2),
    @DiscountPrice DECIMAL(18,2) = NULL,
    @Stock INT = 0,
    @ImageUrl NVARCHAR(1000) = NULL,
    @CreatedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Products(Name, Description, CategoryId, SKU, Price, DiscountPrice, Stock, ImageUrl, CreatedAt, CreatedBy)
    VALUES(@Name, @Description, @CategoryId, @SKU, @Price, @DiscountPrice, @Stock, @ImageUrl, SYSUTCDATETIME(), @CreatedBy);
    INSERT INTO dbo.AuditLogs(Action, Meta) VALUES('AddProduct', @Name);
END;
GO

CREATE OR ALTER PROCEDURE dbo.UpdateProduct
    @ProductId INT,
    @Name NVARCHAR(300),
    @Description NVARCHAR(1000) = NULL,
    @CategoryId INT = NULL,
    @SKU NVARCHAR(100) = NULL,
    @Price DECIMAL(18,2),
    @DiscountPrice DECIMAL(18,2) = NULL,
    @Stock INT = NULL,
    @ImageUrl NVARCHAR(1000) = NULL,
    @UpdatedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Products
    SET Name=@Name, Description=@Description, CategoryId=@CategoryId, SKU=@SKU, Price=@Price, DiscountPrice=@DiscountPrice, Stock=@Stock, ImageUrl=@ImageUrl, UpdatedAt=SYSUTCDATETIME(), UpdatedBy=@UpdatedBy
    WHERE ProductId = @ProductId;
    INSERT INTO dbo.AuditLogs(Action, Meta) VALUES('UpdateProduct', CONCAT('ProductId=', @ProductId));
END;
GO

CREATE OR ALTER PROCEDURE dbo.DeleteProduct
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.Products WHERE ProductId = @ProductId;
    INSERT INTO dbo.AuditLogs(Action, Meta) VALUES('DeleteProduct', CONCAT('ProductId=', @ProductId));
END;
GO

-- Search & get details
CREATE OR ALTER PROCEDURE dbo.SearchProducts
    @Keyword NVARCHAR(300) = NULL,
    @MinPrice DECIMAL(18,2) = NULL,
    @MaxPrice DECIMAL(18,2) = NULL,
    @CategoryId INT = NULL,
    @Page INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH q AS (
        SELECT p.ProductId, p.Name, p.Description, p.Price, p.DiscountPrice, p.Stock, p.ImageUrl, c.Name AS CategoryName
        FROM dbo.Products p
        LEFT JOIN dbo.Categories c ON p.CategoryId = c.CategoryId
        WHERE ( @Keyword IS NULL OR p.Name LIKE '%' + @Keyword + '%' OR p.Description LIKE '%' + @Keyword + '%' )
          AND ( @MinPrice IS NULL OR ISNULL(p.DiscountPrice, p.Price) >= @MinPrice )
          AND ( @MaxPrice IS NULL OR ISNULL(p.DiscountPrice, p.Price) <= @MaxPrice )
          AND ( @CategoryId IS NULL OR p.CategoryId = @CategoryId )
          AND p.IsPublished = 1
    )
    SELECT * FROM q
    ORDER BY Name
    OFFSET (@Page-1)*@PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetProductDetails
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.*, c.Name AS CategoryName
    FROM dbo.Products p
    LEFT JOIN dbo.Categories c ON p.CategoryId = c.CategoryId
    WHERE p.ProductId = @ProductId;
END;
GO

-- Cart operations
CREATE OR ALTER PROCEDURE dbo.AddToCart
    @CartId UNIQUEIDENTIFIER = NULL OUTPUT,
    @UserId INT = NULL,
    @ProductId INT,
    @Quantity INT = 1
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @cid UNIQUEIDENTIFIER;
    SET @cid = @CartId;

    IF @cid IS NULL
    BEGIN
        IF @UserId IS NOT NULL
        BEGIN
            SELECT TOP 1 @cid = CartId FROM dbo.Carts WHERE UserId = @UserId;
        END
        IF @cid IS NULL
        BEGIN
            SET @cid = NEWID();
            INSERT INTO dbo.Carts(CartId, UserId) VALUES(@cid, @UserId);
        END
    END

    DECLARE @price DECIMAL(18,2);
    SET @price = (SELECT ISNULL(DiscountPrice, Price) FROM dbo.Products WHERE ProductId = @ProductId);

    IF EXISTS (SELECT 1 FROM dbo.CartItems WHERE CartId = @cid AND ProductId = @ProductId)
    BEGIN
        UPDATE dbo.CartItems SET Quantity = Quantity + @Quantity, PriceAtAdded = @price WHERE CartId = @cid AND ProductId = @ProductId;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.CartItems(CartId, ProductId, Quantity, PriceAtAdded) VALUES(@cid, @ProductId, @Quantity, @price);
    END

    SET @CartId = @cid;
    UPDATE dbo.Carts SET UpdatedAt = SYSUTCDATETIME() WHERE CartId = @cid;
    INSERT INTO dbo.AuditLogs(UserId, Action, Meta) VALUES(@UserId, 'AddToCart', CONCAT('CartId=', @cid, '; ProductId=', @ProductId, '; Qty=', @Quantity));
END;
GO

CREATE OR ALTER PROCEDURE dbo.ViewCart
    @CartId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ci.CartItemId, ci.CartId, ci.ProductId, p.Name AS ProductName, ci.Quantity, ci.PriceAtAdded, (ci.PriceAtAdded * ci.Quantity) AS LineTotal, p.Stock
    FROM dbo.CartItems ci
    JOIN dbo.Products p ON ci.ProductId = p.ProductId
    WHERE ci.CartId = @CartId;
END;
GO

-- Checkout (from cart) -> create Order (supports guest)
CREATE OR ALTER PROCEDURE dbo.PlaceOrderFromCart
    @CartId UNIQUEIDENTIFIER,
    @UserId INT = NULL,
    @RecipientName NVARCHAR(200),
    @RecipientPhone NVARCHAR(30),
    @RecipientAddress NVARCHAR(1000),
    @OutOrderId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRAN;

        IF NOT EXISTS(SELECT 1 FROM dbo.CartItems WHERE CartId = @CartId)
        BEGIN
            RAISERROR('Cart is empty.',16,1);
            ROLLBACK TRAN; RETURN;
        END

        IF EXISTS (
            SELECT 1 FROM dbo.CartItems ci JOIN dbo.Products p ON ci.ProductId = p.ProductId WHERE p.Stock < ci.Quantity AND ci.CartId = @CartId
        )
        BEGIN
            RAISERROR('Insufficient stock for one or more items.',16,1);
            ROLLBACK TRAN; RETURN;
        END

        DECLARE @total DECIMAL(18,2);
        SET @total = (SELECT SUM(ci.PriceAtAdded * ci.Quantity) FROM dbo.CartItems ci WHERE ci.CartId = @CartId);

        INSERT INTO dbo.Orders(UserId, RecipientName, RecipientPhone, RecipientAddress, TotalAmount)
        VALUES(@UserId, @RecipientName, @RecipientPhone, @RecipientAddress, @total);

        SET @OutOrderId = SCOPE_IDENTITY();

        INSERT INTO dbo.OrderItems(OrderId, ProductId, ProductName, UnitPrice, Quantity)
        SELECT @OutOrderId, ci.ProductId, p.Name, ci.PriceAtAdded, ci.Quantity
        FROM dbo.CartItems ci JOIN dbo.Products p ON ci.ProductId = p.ProductId
        WHERE ci.CartId = @CartId;

        UPDATE p SET p.Stock = p.Stock - ci.Quantity
        FROM dbo.Products p JOIN dbo.CartItems ci ON p.ProductId = ci.ProductId
        WHERE ci.CartId = @CartId;

        DELETE FROM dbo.CartItems WHERE CartId = @CartId;
        DELETE FROM dbo.Carts WHERE CartId = @CartId;

        COMMIT TRAN;

        INSERT INTO dbo.AuditLogs(UserId, Action, Meta) VALUES(@UserId, 'PlaceOrder', CONCAT('OrderId=', @OutOrderId, '; CartId=', @CartId));
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRAN;
        DECLARE @msg NVARCHAR(4000);
        SET @msg = ERROR_MESSAGE();
        RAISERROR('PlaceOrder failed: %s',16,1,@msg);
    END CATCH
END;
GO

-- Orders queries, cancel, admin functions
CREATE OR ALTER PROCEDURE dbo.GetOrdersByUserId
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT o.*, oi.OrderItemId, oi.ProductId, oi.ProductName, oi.UnitPrice, oi.Quantity
    FROM dbo.Orders o
    LEFT JOIN dbo.OrderItems oi ON o.OrderId = oi.OrderId
    WHERE o.UserId = @UserId
    ORDER BY o.CreatedAt DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.CancelOrder
    @OrderId INT,
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderId = @OrderId AND StatusId IN (1,2))
    BEGIN
        UPDATE dbo.Orders SET StatusId = (SELECT StatusId FROM dbo.OrderStatus WHERE StatusName = N'Cancelled'), UpdatedAt = SYSUTCDATETIME() WHERE OrderId = @OrderId;
        UPDATE p
        SET p.Stock = p.Stock + oi.Quantity
        FROM dbo.Products p
        JOIN dbo.OrderItems oi ON p.ProductId = oi.ProductId
        WHERE oi.OrderId = @OrderId;
        INSERT INTO dbo.AuditLogs(UserId, Action, Meta) VALUES(@UserId, 'CancelOrder', CONCAT('OrderId=', @OrderId));
    END
    ELSE
    BEGIN
        RAISERROR('Order cannot be cancelled (status not allowed).',16,1);
    END
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetAllOrders
AS
BEGIN
    SET NOCOUNT ON;
    SELECT o.*, u.Username, u.Email FROM dbo.Orders o LEFT JOIN dbo.Users u ON o.UserId = u.UserId ORDER BY o.CreatedAt DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetOrderDetails
    @OrderId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT o.*, oi.OrderItemId, oi.ProductId, oi.ProductName, oi.UnitPrice, oi.Quantity
    FROM dbo.Orders o
    LEFT JOIN dbo.OrderItems oi ON o.OrderId = oi.OrderId
    WHERE o.OrderId = @OrderId;
END;
GO

CREATE OR ALTER PROCEDURE dbo.UpdateOrderStatus
    @OrderId INT,
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @sid INT = (SELECT StatusId FROM dbo.OrderStatus WHERE StatusName = @Status);
    IF @sid IS NULL
    BEGIN
        RAISERROR('Invalid status value.',16,1); RETURN;
    END
    UPDATE dbo.Orders SET StatusId = @sid, UpdatedAt = SYSUTCDATETIME() WHERE OrderId = @OrderId;
    INSERT INTO dbo.AuditLogs(Action, Meta) VALUES('UpdateOrderStatus', CONCAT('OrderId=', @OrderId, '; Status=', @Status));
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetCustomers
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserId, Username, Email, FullName, Phone, RoleId, IsActive, CreatedAt FROM dbo.Users WHERE RoleId = (SELECT RoleId FROM dbo.Roles WHERE RoleName='Customer');
END;
GO

-- Revenue report (by day / month)
CREATE OR ALTER PROCEDURE dbo.GetRevenueReport
    @Period NVARCHAR(10) -- 'day' or 'month'
AS
BEGIN
    SET NOCOUNT ON;
    IF @Period = 'day'
    BEGIN
        SELECT CAST(CreatedAt AS DATE) AS [Date], SUM(TotalAmount) AS Revenue, COUNT(OrderId) AS Orders
        FROM dbo.Orders
        WHERE StatusId <> (SELECT StatusId FROM dbo.OrderStatus WHERE StatusName = N'Cancelled')
        GROUP BY CAST(CreatedAt AS DATE)
        ORDER BY [Date] DESC;
    END
    ELSE
    BEGIN
        SELECT YEAR(CreatedAt) AS [Year], MONTH(CreatedAt) AS [Month], SUM(TotalAmount) AS Revenue, COUNT(OrderId) AS Orders
        FROM dbo.Orders
        WHERE StatusId <> (SELECT StatusId FROM dbo.OrderStatus WHERE StatusName = N'Cancelled')
        GROUP BY YEAR(CreatedAt), MONTH(CreatedAt)
        ORDER BY [Year] DESC, [Month] DESC;
    END
END;
GO

-- Stored procedure tổng hợp cho cả 3 chế độ (ngày/tuần/tháng)
CREATE OR ALTER PROCEDURE dbo.sp_ThongKeDoanhThu
    @FromDate DATE,
    @ToDate DATE,
    @Mode NVARCHAR(10) = N'Ngay'  -- 'Ngay' | 'Tuan' | 'Thang'
AS
BEGIN
    SET NOCOUNT ON;

    IF @Mode = N'Ngay'
    BEGIN
        SELECT * FROM dbo.View_DoanhThuNgay
        WHERE Ngay BETWEEN @FromDate AND @ToDate
        ORDER BY Ngay;
    END
    ELSE IF @Mode = N'Tuan'
    BEGIN
        SELECT * FROM dbo.View_DoanhThuTuan
        WHERE CONCAT(Nam, '-', Tuan) BETWEEN CONCAT(YEAR(@FromDate), '-', DATEPART(WEEK, @FromDate)) 
              AND CONCAT(YEAR(@ToDate), '-', DATEPART(WEEK, @ToDate))
        ORDER BY Nam, Tuan;
    END
    ELSE IF @Mode = N'Thang'
    BEGIN
        SELECT * FROM dbo.View_DoanhThuThang
        WHERE CONCAT(Nam, '-', Thang) BETWEEN CONCAT(YEAR(@FromDate), '-', MONTH(@FromDate)) 
              AND CONCAT(YEAR(@ToDate), '-', MONTH(@ToDate))
        ORDER BY Nam, Thang;
    END
END;
GO

-- ============================
-- Triggers
-- ============================

-- Recalculate Orders.TotalAmount when OrderItems change
CREATE OR ALTER TRIGGER trg_RecalcOrderTotal
ON dbo.OrderItems
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE o
    SET TotalAmount = ISNULL(t.Total,0)
    FROM dbo.Orders o
    LEFT JOIN (
        SELECT oi.OrderId, SUM(oi.UnitPrice * oi.Quantity) AS Total
        FROM dbo.OrderItems oi
        GROUP BY oi.OrderId
    ) t ON o.OrderId = t.OrderId;
END;
GO

-- Audit trigger for Products
CREATE OR ALTER TRIGGER trg_Audit_Products
ON dbo.Products
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Action NVARCHAR(50);

    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
        SET @Action = 'UPDATE';
    ELSE IF EXISTS(SELECT * FROM inserted)
        SET @Action = 'INSERT';
    ELSE
        SET @Action = 'DELETE';

    INSERT INTO dbo.AuditLogs(UserId, Action, Meta)
    SELECT NULL, @Action, CONCAT('ProductId=', COALESCE(i.ProductId, d.ProductId), '; Name=', COALESCE(i.Name, d.Name))
    FROM inserted i
    FULL OUTER JOIN deleted d ON i.ProductId = d.ProductId;
END;
GO

-- ============================
-- Views for revenue (day/week/month)
-- ============================
CREATE OR ALTER VIEW dbo.View_DoanhThuNgay AS
SELECT 
    CAST(O.CreatedAt AS DATE) AS Ngay,
    SUM(OI.Quantity * OI.UnitPrice) AS TongDoanhThu,
    COUNT(DISTINCT O.OrderId) AS SoLuongDonHang
FROM dbo.Orders O
INNER JOIN dbo.OrderItems OI ON O.OrderId = OI.OrderId
WHERE O.StatusId IN ((SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Completed'),(SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Delivered'))
GROUP BY CAST(O.CreatedAt AS DATE);
GO

CREATE OR ALTER VIEW dbo.View_DoanhThuTuan AS
SELECT 
    DATEPART(YEAR, O.CreatedAt) AS Nam,
    DATEPART(WEEK, O.CreatedAt) AS Tuan,
    SUM(OI.Quantity * OI.UnitPrice) AS TongDoanhThu,
    COUNT(DISTINCT O.OrderId) AS SoLuongDonHang
FROM dbo.Orders O
INNER JOIN dbo.OrderItems OI ON O.OrderId = OI.OrderId
WHERE O.StatusId IN ((SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Completed'),(SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Delivered'))
GROUP BY DATEPART(YEAR, O.CreatedAt), DATEPART(WEEK, O.CreatedAt);
GO

CREATE OR ALTER VIEW dbo.View_DoanhThuThang AS
SELECT 
    DATEPART(YEAR, O.CreatedAt) AS Nam,
    DATEPART(MONTH, O.CreatedAt) AS Thang,
    SUM(OI.Quantity * OI.UnitPrice) AS TongDoanhThu,
    COUNT(DISTINCT O.OrderId) AS SoLuongDonHang
FROM dbo.Orders O
INNER JOIN dbo.OrderItems OI ON O.OrderId = OI.OrderId
WHERE O.StatusId IN ((SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Completed'),(SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Delivered'))
GROUP BY DATEPART(YEAR, O.CreatedAt), DATEPART(MONTH, O.CreatedAt);
GO

-- ============================
-- Seed sample data (roles/users/products/categories/orders/cart)
-- ============================

-- Roles
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE RoleName = 'Admin')
    INSERT INTO dbo.Roles(RoleName) VALUES('Admin');
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE RoleName = 'Customer')
    INSERT INTO dbo.Roles(RoleName) VALUES('Customer');
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE RoleName = 'Staff')
    INSERT INTO dbo.Roles(RoleName) VALUES('Staff');
GO

-- Sample users (admin, staff, customers)
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'admin@gtn.vn')
BEGIN
    DECLARE @adm_salt VARBINARY(64);
    SET @adm_salt = CRYPT_GEN_RANDOM(32);

    DECLARE @adm_hash VARBINARY(8000);
    SET @adm_hash = HASHBYTES('SHA2_512', @adm_salt + CONVERT(VARBINARY(MAX), N'Admin@123'));

    INSERT INTO dbo.Users(Username, Email, PasswordHash, PasswordSalt, FullName, RoleId)
    VALUES('admin','admin@gtn.vn', @adm_hash, @adm_salt, N'Quản trị viên', (SELECT RoleId FROM dbo.Roles WHERE RoleName='Admin'));
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Username = 'staff')
BEGIN
    DECLARE @s_salt VARBINARY(64);
    SET @s_salt = CRYPT_GEN_RANDOM(32);

    DECLARE @s_hash VARBINARY(8000);
    SET @s_hash = HASHBYTES('SHA2_512', @s_salt + CONVERT(VARBINARY(MAX), N'Staff@123'));

    INSERT INTO dbo.Users(Username, Email, PasswordHash, PasswordSalt, FullName, RoleId)
    VALUES('staff','staff@gtn.vn', @s_hash, @s_salt, N'Nhân viên GTN', (SELECT RoleId FROM dbo.Roles WHERE RoleName='Staff'));
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Username = 'customer1')
BEGIN
    DECLARE @c_salt VARBINARY(64);
    SET @c_salt = CRYPT_GEN_RANDOM(32);

    DECLARE @c_hash VARBINARY(8000);
    SET @c_hash = HASHBYTES('SHA2_512', @c_salt + CONVERT(VARBINARY(MAX), N'User@123'));

    INSERT INTO dbo.Users(Username, Email, PasswordHash, PasswordSalt, FullName, RoleId)
    VALUES('customer1','cus1@gtn.vn', @c_hash, @c_salt, N'Khách hàng A', (SELECT RoleId FROM dbo.Roles WHERE RoleName='Customer'));
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Username = 'customer2')
BEGIN
    DECLARE @c2_salt VARBINARY(64);
    SET @c2_salt = CRYPT_GEN_RANDOM(32);

    DECLARE @c2_hash VARBINARY(8000);
    SET @c2_hash = HASHBYTES('SHA2_512', @c2_salt + CONVERT(VARBINARY(MAX), N'User@123'));

    INSERT INTO dbo.Users(Username, Email, PasswordHash, PasswordSalt, FullName, RoleId)
    VALUES('customer2','cus2@gtn.vn', @c2_hash, @c2_salt, N'Khách hàng B', (SELECT RoleId FROM dbo.Roles WHERE RoleName='Customer'));
END
GO

-- Categories
IF NOT EXISTS (SELECT 1 FROM dbo.Categories)
BEGIN
    INSERT INTO dbo.Categories(Name, Slug, Description) VALUES
    (N'Laptop','laptop','Laptop - nhiều phân khúc'),
    (N'PC','pc','Desktop/PC gaming & workstation'),
    (N'Màn hình','monitor','Màn hình chơi game và văn phòng'),
    (N'Bàn phím','keyboard','Bàn phím cơ và thường'),
    (N'Chuột','mouse','Chuột gaming và văn phòng');
END
GO

-- Products
IF NOT EXISTS (SELECT 1 FROM dbo.Products)
BEGIN
    INSERT INTO dbo.Products (Name, Description, CategoryId, SKU, Price, DiscountPrice, Stock, ImageUrl, CreatedAt)
    VALUES
    (N'Laptop Dell XPS 13', N'Laptop cao cấp, màn hình 13 inch, Intel i7', (SELECT CategoryId FROM dbo.Categories WHERE Name='Laptop'), 'DLXPS13', 25000000, NULL, 10, '/images/products/view_vx2528j.jpg', SYSUTCDATETIME()),
    (N'PC Gaming ASUS ROG', N'Desktop gaming, RTX 3080, Intel i9', (SELECT CategoryId FROM dbo.Categories WHERE Name='PC'), 'ASUSROG1',35000000, 33000000, 5, '/images/products/view_vx2479a-hd-pro.jpg', SYSUTCDATETIME()),
    (N'Laptop HP Pavilion', N'Laptop văn phòng, AMD Ryzen 5', (SELECT CategoryId FROM dbo.Categories WHERE Name='Laptop'), 'HPPA15',15000000, NULL, 15, '/images/products/view_vx2528j.jpg', SYSUTCDATETIME()),
    (N'PC Lenovo Workstation', N'Máy trạm mạnh mẽ, Intel Xeon', (SELECT CategoryId FROM dbo.Categories WHERE Name='PC'), 'LENWS1',40000000, NULL, 3, '/images/products/acer_kg240y_x1.jpg', SYSUTCDATETIME()),
    (N'Màn hình Acer KG240Y X1', N'Màn 240 HZ, 24inch', (SELECT CategoryId FROM dbo.Categories WHERE Name='Màn hình'), 'ACERKG240',2100000, NULL, 12, '/images/products/acer_kg240y_x1.jpg', SYSUTCDATETIME()),
    (N'Màn hình Viewsonic VA2432A-H', N'Màn gaming 180HZ, 24 inch', (SELECT CategoryId FROM dbo.Categories WHERE Name='Màn hình'), 'VSV2432',1800000, NULL, 3, '/images/products/view_va2432a-h.jpg', SYSUTCDATETIME()),
    (N'Keychron K2', N'Bàn phím cơ Bluetooth Gateron Brown', (SELECT CategoryId FROM dbo.Categories WHERE Name='Bàn phím'), 'K2',1890000, NULL, 15, '/images/products/keychron_k2.jpg', SYSUTCDATETIME()),
    (N'Logitech G502 HERO', N'Chuột gaming có dây cao cấp', (SELECT CategoryId FROM dbo.Categories WHERE Name='Chuột'), 'G502',1490000, NULL, 25, '/images/products/g502.jpg', SYSUTCDATETIME());
END
GO

-- Create sample cart for guest + for customer1
DECLARE @guestCart UNIQUEIDENTIFIER;
SET @guestCart = NEWID();
IF NOT EXISTS (SELECT 1 FROM dbo.Carts WHERE CartId = @guestCart)
BEGIN
    INSERT INTO dbo.Carts(CartId, UserId) VALUES(@guestCart, NULL);
END

IF NOT EXISTS (SELECT 1 FROM dbo.CartItems WHERE CartId = @guestCart)
BEGIN
    INSERT INTO dbo.CartItems (CartId, ProductId, Quantity, PriceAtAdded)
    SELECT @guestCart, p.ProductId, 1, ISNULL(p.DiscountPrice, p.Price)
    FROM dbo.Products p WHERE p.Name IN (N'Laptop Dell XPS 13', N'Keychron K2');
END
GO

-- Sample orders
IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE UserId = (SELECT UserId FROM dbo.Users WHERE Username='customer1'))
BEGIN
    INSERT INTO dbo.Orders(UserId, RecipientName, RecipientPhone, RecipientAddress, TotalAmount, StatusId)
    VALUES ((SELECT UserId FROM dbo.Users WHERE Username='customer1'), N'Khách A', '0909000001', N'Quận 1, HCM', 25000000, (SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Pending'));

    DECLARE @o1 INT;
    SET @o1 = SCOPE_IDENTITY();
    INSERT INTO dbo.OrderItems(OrderId, ProductId, ProductName, UnitPrice, Quantity)
    SELECT @o1, p.ProductId, p.Name, ISNULL(p.DiscountPrice, p.Price), 1 FROM dbo.Products p WHERE p.Name = N'Laptop Dell XPS 13';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE UserId = (SELECT UserId FROM dbo.Users WHERE Username='customer2'))
BEGIN
    INSERT INTO dbo.Orders(UserId, RecipientName, RecipientPhone, RecipientAddress, TotalAmount, StatusId)
    VALUES ((SELECT UserId FROM dbo.Users WHERE Username='customer2'), N'Khách B', '0909000002', N'Quận 7, HCM', 55000000, (SELECT StatusId FROM dbo.OrderStatus WHERE StatusName=N'Completed'));

    DECLARE @o2 INT = SCOPE_IDENTITY();
    INSERT INTO dbo.OrderItems(OrderId, ProductId, ProductName, UnitPrice, Quantity)
    SELECT @o2, p.ProductId, p.Name, ISNULL(p.DiscountPrice, p.Price), 1 FROM dbo.Products p WHERE p.Name IN (N'PC Gaming ASUS ROG');
    INSERT INTO dbo.OrderItems(OrderId, ProductId, ProductName, UnitPrice, Quantity)
    SELECT @o2, p.ProductId, p.Name, ISNULL(p.DiscountPrice, p.Price), 1 FROM dbo.Products p WHERE p.Name IN (N'PC Lenovo Workstation');
END
GO

-- Quick helper view
CREATE OR ALTER VIEW dbo.v_ProductSummary AS
SELECT p.ProductId, p.Name, p.CategoryId, c.Name AS CategoryName, p.Price, p.DiscountPrice, p.Stock, p.ImageUrl
FROM dbo.Products p LEFT JOIN dbo.Categories c ON p.CategoryId = c.CategoryId;
GO

-- Suggested indexes (if not exists)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Products_CategoryId' AND object_id = OBJECT_ID('dbo.Products'))
BEGIN
    CREATE INDEX IX_Products_CategoryId ON dbo.Products(CategoryId);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Orders_UserId' AND object_id = OBJECT_ID('dbo.Orders'))
BEGIN
    CREATE INDEX IX_Orders_UserId ON dbo.Orders(UserId);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LoginHistory_IP' AND object_id = OBJECT_ID('dbo.LoginHistory'))
BEGIN
    CREATE INDEX IX_LoginHistory_IP ON dbo.LoginHistory(IPAddress);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Users_Phone' AND object_id = OBJECT_ID('dbo.Users'))
BEGIN
    CREATE INDEX IX_Users_Phone ON dbo.Users(Phone);
END

GO

