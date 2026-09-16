package com.crackers.store.model;

public class OrderItem {
    private String productId;
    private String productName;
    private String category;
    private String packSize;
    private double price;
    private int quantity;
    private double subtotal;

    public OrderItem() {}

    public OrderItem(String productId, String productName, String category, String packSize, double price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.packSize = packSize;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = price * quantity;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPackSize() { return packSize; }
    public void setPackSize(String packSize) { this.packSize = packSize; }

    public double getPrice() { return price; }
    public void setPrice(double price) { 
        this.price = price; 
        this.subtotal = this.price * this.quantity;
    }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { 
        this.quantity = quantity; 
        this.subtotal = this.price * this.quantity;
    }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}
