package com.crackers.store.model;

public class Product {
    private String id;
    private String name;
    private String category;
    private String description;
    private String packSize;
    private double originalPrice;
    private double discountedPrice;
    private int discountPercent;
    private String soundLevel; // Low, Medium, High, Zero Sound
    private boolean kidSafe;
    private boolean greenCrackerCertified;
    private String image;
    private int stock;
    private int rating;
    private String videoDemo;

    public Product() {}

    public Product(String id, String name, String category, String description, String packSize,
                   double originalPrice, double discountedPrice, int discountPercent,
                   String soundLevel, boolean kidSafe, boolean greenCrackerCertified,
                   String image, int stock, int rating, String videoDemo) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.packSize = packSize;
        this.originalPrice = originalPrice;
        this.discountedPrice = discountedPrice;
        this.discountPercent = discountPercent;
        this.soundLevel = soundLevel;
        this.kidSafe = kidSafe;
        this.greenCrackerCertified = greenCrackerCertified;
        this.image = image;
        this.stock = stock;
        this.rating = rating;
        this.videoDemo = videoDemo;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPackSize() { return packSize; }
    public void setPackSize(String packSize) { this.packSize = packSize; }

    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }

    public double getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(double discountedPrice) { this.discountedPrice = discountedPrice; }

    public int getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(int discountPercent) { this.discountPercent = discountPercent; }

    public String getSoundLevel() { return soundLevel; }
    public void setSoundLevel(String soundLevel) { this.soundLevel = soundLevel; }

    public boolean isKidSafe() { return kidSafe; }
    public void setKidSafe(boolean kidSafe) { this.kidSafe = kidSafe; }

    public boolean isGreenCrackerCertified() { return greenCrackerCertified; }
    public void setGreenCrackerCertified(boolean greenCrackerCertified) { this.greenCrackerCertified = greenCrackerCertified; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getVideoDemo() { return videoDemo; }
    public void setVideoDemo(String videoDemo) { this.videoDemo = videoDemo; }
}
