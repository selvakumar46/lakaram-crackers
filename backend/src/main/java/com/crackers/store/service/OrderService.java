package com.crackers.store.service;

import com.crackers.store.model.OrderItem;
import com.crackers.store.model.OrderRequest;
import com.crackers.store.model.OrderResponse;
import com.crackers.store.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderService {

    private final ProductService productService;
    private final OrderRepository orderRepository;
    private static final String STORE_WHATSAPP_NUMBER = "918973015070"; // Standard Sivakasi shop direct line format

    public OrderService(ProductService productService, OrderRepository orderRepository) {
        this.productService = productService;
        this.orderRepository = orderRepository;
    }

    public OrderResponse createOrder(OrderRequest request) {
        String orderId = "CRK-" + (System.currentTimeMillis() % 1000000);
        
        double actualValue = 0.0;
        double subtotal = 0.0;
        int totalQuantity = 0;

        List<OrderItem> items = request.getItems() != null ? request.getItems() : new ArrayList<>();
        for (OrderItem item : items) {
            double lineTotal = item.getPrice() * item.getQuantity();
            item.setSubtotal(lineTotal);
            subtotal += lineTotal;
            totalQuantity += item.getQuantity();

            // Find product for actual original price estimate
            var prodOpt = productService.getProductById(item.getProductId());
            if (prodOpt.isPresent()) {
                actualValue += prodOpt.get().getOriginalPrice() * item.getQuantity();
            } else {
                actualValue += (item.getPrice() * 5) * item.getQuantity(); // approx 80% off
            }
        }

        double festiveDiscount = Math.max(0, actualValue - subtotal);
        double packingAndForwarding = subtotal > 3000 ? 0.0 : 150.0; // Free packing above ₹3000
        double grandTotal = subtotal + packingAndForwarding;

        OrderResponse response = new OrderResponse();
        response.setOrderId(orderId);
        response.setStatus("PENDING");
        response.setOrderDate(LocalDateTime.now());
        response.setCustomerName(request.getCustomerName());
        response.setPhone(request.getPhone());
        response.setDeliveryAddress(request.getAddress() + ", " + request.getCity() + ", " + request.getState());
        response.setPincode(request.getPincode());
        response.setPaymentMethod(request.getPaymentMethod());
        response.setItems(items);
        response.setTotalItemCount(totalQuantity);
        response.setActualValue(actualValue);
        response.setFestiveDiscount(festiveDiscount);
        response.setSubtotal(subtotal);
        response.setPackingAndForwarding(packingAndForwarding);
        response.setGrandTotal(grandTotal);
        response.setEstimatedDelivery("3 to 5 business days via Sivakasi Heavy Transport");

        // Generate WhatsApp formatted message
        String whatsappMsg = formatWhatsAppMessage(response);
        String encodedMsg = URLEncoder.encode(whatsappMsg, StandardCharsets.UTF_8);
        response.setWhatsappShareUrl("https://wa.me/" + STORE_WHATSAPP_NUMBER + "?text=" + encodedMsg);

        // Save to H2 persistent database
        return orderRepository.save(response);
    }

    public Optional<OrderResponse> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Optional<OrderResponse> updateOrderStatus(String orderId, String newStatus) {
        Optional<OrderResponse> opt = orderRepository.findById(orderId);
        if (opt.isPresent()) {
            OrderResponse order = opt.get();
            order.setStatus(newStatus.toUpperCase().trim());
            return Optional.of(orderRepository.save(order));
        }
        return Optional.empty();
    }

    private String formatWhatsAppMessage(OrderResponse order) {
        StringBuilder sb = new StringBuilder();
        sb.append("🎇 *LAKARAM CRACKERS - NEW ORDER* 🎇\n");
        sb.append("🌐 lakaram-crackers.onrender.com\n");
        sb.append("--------------------------------------\n");
        sb.append("🆔 *Order ID:* ").append(order.getOrderId()).append("\n");
        sb.append("📅 *Date:* ").append(order.getOrderDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))).append("\n");
        sb.append("👤 *Customer:* ").append(order.getCustomerName()).append("\n");
        sb.append("📞 *Phone:* ").append(order.getPhone()).append("\n");
        sb.append("📍 *Address:* ").append(order.getDeliveryAddress()).append(" - ").append(order.getPincode()).append("\n");
        sb.append("💳 *Payment:* ").append(order.getPaymentMethod()).append("\n");
        sb.append("--------------------------------------\n");
        sb.append("📦 *ITEMS ORDERED:*\n");

        for (OrderItem item : order.getItems()) {
            sb.append("• ").append(item.getProductName())
              .append(" (").append(item.getPackSize()).append(") x ")
              .append(item.getQuantity())
              .append(" = ₹").append(String.format("%.2f", item.getSubtotal()))
              .append("\n");
        }

        sb.append("--------------------------------------\n");
        sb.append("💰 *Subtotal:* ₹").append(String.format("%.2f", order.getSubtotal())).append("\n");
        sb.append("🎉 *You Saved:* ₹").append(String.format("%.2f", order.getFestiveDiscount())).append(" (80% Off)\n");
        sb.append("🚚 *Packing & Transport:* ₹").append(String.format("%.2f", order.getPackingAndForwarding())).append("\n");
        sb.append("⭐️ *TOTAL PAYABLE:* ₹").append(String.format("%.2f", order.getGrandTotal())).append("\n");
        sb.append("--------------------------------------\n");
        sb.append("Please confirm my order and share the bank/UPI payment details! 🙏");

        return sb.toString();
    }
}
