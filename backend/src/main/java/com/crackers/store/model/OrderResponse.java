package com.crackers.store.model;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private String orderId;
    private String status; // CONFIRMED, PENDING, DISPATCHED
    private LocalDateTime orderDate;
    private String customerName;
    private String phone;
    private String deliveryAddress;
    private String pincode;
    private String paymentMethod;
    private List<OrderItem> items;
    private int totalItemCount;
    private double actualValue;
    private double festiveDiscount;
    private double subtotal;
    private double packingAndForwarding;
    private double grandTotal;
    private String estimatedDelivery;
    private String whatsappShareUrl;

    public OrderResponse() {}

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public int getTotalItemCount() { return totalItemCount; }
    public void setTotalItemCount(int totalItemCount) { this.totalItemCount = totalItemCount; }

    public double getActualValue() { return actualValue; }
    public void setActualValue(double actualValue) { this.actualValue = actualValue; }

    public double getFestiveDiscount() { return festiveDiscount; }
    public void setFestiveDiscount(double festiveDiscount) { this.festiveDiscount = festiveDiscount; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getPackingAndForwarding() { return packingAndForwarding; }
    public void setPackingAndForwarding(double packingAndForwarding) { this.packingAndForwarding = packingAndForwarding; }

    public double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(double grandTotal) { this.grandTotal = grandTotal; }

    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

    public String getWhatsappShareUrl() { return whatsappShareUrl; }
    public void setWhatsappShareUrl(String whatsappShareUrl) { this.whatsappShareUrl = whatsappShareUrl; }
}
