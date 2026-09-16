package com.crackers.store.model;

public class Category {
    private String id;
    private String name;
    private String icon;
    private String description;
    private int itemCount;

    public Category() {}

    public Category(String id, String name, String icon, String description, int itemCount) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.itemCount = itemCount;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getItemCount() { return itemCount; }
    public void setItemCount(int itemCount) { this.itemCount = itemCount; }
}
