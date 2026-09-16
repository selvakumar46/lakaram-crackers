package com.crackers.store.service;

import com.crackers.store.model.Category;
import com.crackers.store.model.Product;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final Map<String, Product> productMap = new ConcurrentHashMap<>();
    private final List<Category> categoryList = new ArrayList<>();

    @PostConstruct
    public void init() {
        initCategories();
        initProducts();
    }

    private void initCategories() {
        categoryList.clear();
        categoryList.add(new Category("sparklers", "Sparklers", "Sparkles", "Classic festive hand sparklers with vivid colors & long burning duration", 6));
        categoryList.add(new Category("chakkars", "Ground Chakkars", "RotateCw", "High-speed spinning ground wheels with brilliant gold & silver showers", 4));
        categoryList.add(new Category("flower-pots", "Flower Pots", "Flame", "Vibrant conical fountains throwing glittering sprays up to 20 feet", 5));
        categoryList.add(new Category("rockets", "Rockets & Missiles", "Rocket", "Sky-bound whistle rockets with stunning colorful burst effects", 4));
        categoryList.add(new Category("aerial-shots", "Multi Sky Shots", "Sun", "Spectacular multi-burst night sky repeaters with palm & strobe breaks", 6));
        categoryList.add(new Category("sound-crackers", "Sound Crackers & Bijili", "Zap", "Traditional rhythmic sound strips, garland rolls & crisp red bijili", 5));
        categoryList.add(new Category("atom-bombs", "Atom Bombs & Hydro", "Bomb", "Heavy concussion bass crackers with triple-wrapped safety casing", 4));
        categoryList.add(new Category("gift-boxes", "Family Gift Boxes", "Package", "Curated festive family hampers with complete cracker assortments", 4));
        categoryList.add(new Category("kids-special", "Kids Safe Crackers", "Smile", "Safe, low-smoke, non-explosive fun crackers including pop-pops and magic snakes", 4));
    }

    private void initProducts() {
        productMap.clear();

        // 1. Sparklers
        addProduct(new Product("SPK-01", "10cm Electric Sparklers", "sparklers", 
            "Bright silver metallic sparkles with low smoke emission.", "1 Box (10 Pcs)", 
            160.0, 40.0, 75, "Zero Sound", true, true, 
            "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60", 
            120, 5, ""));

        addProduct(new Product("SPK-02", "12cm Colour Sparklers", "sparklers", 
            "Vibrant multi-color sparks (Red, Green, Gold) for festive joy.", "1 Box (10 Pcs)", 
            220.0, 55.0, 75, "Zero Sound", true, true, 
            "https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=500&auto=format&fit=crop&q=60", 
            95, 5, ""));

        addProduct(new Product("SPK-03", "15cm Green Sparklers", "sparklers", 
            "Long burning emerald green sparkling display.", "1 Box (10 Pcs)", 
            260.0, 65.0, 75, "Zero Sound", true, true, 
            "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=500&auto=format&fit=crop&q=60", 
            80, 4, ""));

        addProduct(new Product("SPK-04", "30cm Mega Gold Sparklers", "sparklers", 
            "Extra-long burning giant golden sparklers lasting over 90 seconds.", "1 Box (5 Pcs)", 
            360.0, 90.0, 75, "Zero Sound", true, true, 
            "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500&auto=format&fit=crop&q=60", 
            60, 5, ""));

        addProduct(new Product("SPK-05", "50cm Giant Night Sparklers", "sparklers", 
            "Premium wedding and grand Diwali night mega sparkler wand.", "1 Box (5 Pcs)", 
            500.0, 125.0, 75, "Zero Sound", true, true, 
            "https://images.unsplash.com/photo-1543257580-7269da773bf5?w=500&auto=format&fit=crop&q=60", 
            40, 5, ""));

        // 2. Ground Chakkars
        addProduct(new Product("CHK-01", "Ground Chakkar Special", "chakkars", 
            "Smooth fast spinning ground spinner with golden rings.", "1 Box (10 Pcs)", 
            240.0, 60.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60", 
            150, 4, ""));

        addProduct(new Product("CHK-02", "Ground Chakkar Deluxe", "chakkars", 
            "High RPM rotating spinner with dual colored silver fire ring.", "1 Box (10 Pcs)", 
            360.0, 90.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1533230807127-716665511457?w=500&auto=format&fit=crop&q=60", 
            110, 5, ""));

        addProduct(new Product("CHK-03", "Chakkar Plastic Big (Whistling)", "chakkars", 
            "Plastic wheel spinner with high pitch musical whistle and shower.", "1 Box (10 Pcs)", 
            560.0, 140.0, 75, "Medium", false, true, 
            "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60", 
            75, 5, ""));

        addProduct(new Product("CHK-04", "Ashoka Wheel Supreme", "chakkars", 
            "Large diameter prolonged ground swirl with multi-stage color transition.", "1 Box (5 Pcs)", 
            680.0, 170.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60", 
            50, 5, ""));

        // 3. Flower Pots
        addProduct(new Product("FLP-01", "Flower Pots Big", "flower-pots", 
            "Rich golden shower fountain erupting 10-12 feet high.", "1 Box (10 Pcs)", 
            320.0, 80.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60", 
            140, 4, ""));

        addProduct(new Product("FLP-02", "Flower Pots Special", "flower-pots", 
            "Denser fountain with silver glitter and amber fireflies.", "1 Box (10 Pcs)", 
            440.0, 110.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=500&auto=format&fit=crop&q=60", 
            90, 5, ""));

        addProduct(new Product("FLP-03", "Flower Pots Ashoka Deluxe", "flower-pots", 
            "Massive high-volume fountain reaching 18 feet with dual flame core.", "1 Box (10 Pcs)", 
            600.0, 150.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&auto=format&fit=crop&q=60", 
            70, 5, ""));

        addProduct(new Product("FLP-04", "Colour Koti (Multi-Colour Fountain)", "flower-pots", 
            "3-in-1 cascading color transformation: Red to Emerald to Sparkling Gold.", "1 Box (5 Pcs)", 
            720.0, 180.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1533230807127-716665511457?w=500&auto=format&fit=crop&q=60", 
            60, 5, ""));

        // 4. Rockets & Missiles
        addProduct(new Product("RCK-01", "Baby Rocket", "rockets", 
            "Classic single burst high altitude whistling rocket.", "1 Box (10 Pcs)", 
            280.0, 70.0, 75, "Medium", false, true, 
            "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500&auto=format&fit=crop&q=60", 
            85, 4, ""));

        addProduct(new Product("RCK-02", "Whistling Bomb Rocket", "rockets", 
            "Ascending screamer with loud concussion burst at apex.", "1 Box (10 Pcs)", 
            480.0, 120.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60", 
            70, 5, ""));

        addProduct(new Product("RCK-03", "Lunik Sky Rocket Deluxe", "rockets", 
            "High flight missile with parachute release and glitter trail.", "1 Box (5 Pcs)", 
            640.0, 160.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60", 
            50, 5, ""));

        // 5. Multi Sky Shots (Aerial Repeaters)
        addProduct(new Product("SHT-01", "12 Shots Sky Rider", "aerial-shots", 
            "12 consecutive aerial bursts with red pearls and golden brocade.", "1 Box (1 Pc)", 
            760.0, 190.0, 75, "Medium", false, true, 
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60", 
            80, 5, ""));

        addProduct(new Product("SHT-02", "30 Shots Symphony", "aerial-shots", 
            "Continuous 30 sky explosions filling the night sky with multicolored stars.", "1 Box (1 Pc)", 
            1600.0, 400.0, 75, "Medium", false, true, 
            "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=500&auto=format&fit=crop&q=60", 
            45, 5, ""));

        addProduct(new Product("SHT-03", "60 Shots Grand Celebration", "aerial-shots", 
            "Massive party repeater with crackling willow and strobe bouquet.", "1 Box (1 Pc)", 
            3200.0, 800.0, 75, "Medium", false, true, 
            "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&auto=format&fit=crop&q=60", 
            25, 5, ""));

        addProduct(new Product("SHT-04", "120 Shots Bollywood Night", "aerial-shots", 
            "The ultimate fireworks showstopper. 2-minute non-stop aerial fireworks display.", "1 Box (1 Pc)", 
            6000.0, 1500.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1533230807127-716665511457?w=500&auto=format&fit=crop&q=60", 
            15, 5, ""));

        // 6. Sound Crackers & Bijili
        addProduct(new Product("SND-01", "28 Chorsa Classic Sound Strip", "sound-crackers", 
            "Traditional crisp continuous crackers for auspicious beginnings.", "1 Pack (10 Pcs)", 
            200.0, 50.0, 75, "Medium", false, true, 
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60", 
            100, 4, ""));

        addProduct(new Product("SND-02", "Red Bijili Crackers (Stripped)", "sound-crackers", 
            "High quality fast firing red bijili packet.", "1 Bag (100 Pcs)", 
            240.0, 60.0, 75, "Medium", false, true, 
            "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60", 
            150, 4, ""));

        addProduct(new Product("SND-03", "1000 Wala Festive Garland", "sound-crackers", 
            "Grand continuous celebration roll firing for 90 seconds.", "1 Box (1 Pc)", 
            1200.0, 300.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60", 
            40, 5, ""));

        addProduct(new Product("SND-04", "5000 Wala Royal Maharaja Garland", "sound-crackers", 
            "Extra-long 5000 cracker garland for grand community celebrations.", "1 Box (1 Pc)", 
            5200.0, 1300.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60", 
            15, 5, ""));

        // 7. Atom Bombs
        addProduct(new Product("BMB-01", "Hydro Bomb Green", "atom-bombs", 
            "Classic green wrapped medium concussion explosive sound.", "1 Box (10 Pcs)", 
            240.0, 60.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500&auto=format&fit=crop&q=60", 
            80, 4, ""));

        addProduct(new Product("BMB-02", "Classic Bullet Bomb", "atom-bombs", 
            "Jute wrapped heavy blast cracker with prolonged safety fuse.", "1 Box (10 Pcs)", 
            360.0, 90.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60", 
            65, 5, ""));

        addProduct(new Product("BMB-03", "King of Kings Digital Bomb", "atom-bombs", 
            "Deep bass resonant echo sound cracker with reinforced paper casing.", "1 Box (10 Pcs)", 
            480.0, 120.0, 75, "High", false, true, 
            "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=500&auto=format&fit=crop&q=60", 
            50, 5, ""));

        // 8. Gift Boxes
        addProduct(new Product("GFT-01", "Mini Joy Box (22 Items Assortment)", "gift-boxes", 
            "Ideal for small families and beginners. Contains sparklers, pots, chakkars, and sound crackers.", "1 Hamper Box", 
            2800.0, 699.0, 75, "Mixed", true, true, 
            "https://images.unsplash.com/photo-1543257580-7269da773bf5?w=500&auto=format&fit=crop&q=60", 
            40, 5, ""));

        addProduct(new Product("GFT-02", "Family Super Delight (36 Items)", "gift-boxes", 
            "Popular family pack including aerial shots, fountains, giant sparklers and fancy novelties.", "1 Hamper Box", 
            4800.0, 1199.0, 75, "Mixed", true, true, 
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60", 
            30, 5, ""));

        addProduct(new Product("GFT-03", "VIP Grand Celebration Box (55 Items)", "gift-boxes", 
            "Luxury hamper with 30-shot repeater, Ashoka pots, whistle rockets, and mega sparklers.", "1 Luxury Box", 
            8000.0, 1999.0, 75, "Mixed", true, true, 
            "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&auto=format&fit=crop&q=60", 
            20, 5, ""));

        // 9. Kids Special
        addProduct(new Product("KID-01", "Magic Pop Pop Crackers", "kids-special", 
            "Snap drops that burst on throwing. No matchstick or fire required. Completely kid-safe.", "1 Box (50 Pcs)", 
            160.0, 40.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=500&auto=format&fit=crop&q=60", 
            200, 5, ""));

        addProduct(new Product("KID-02", "Black Magic Snake Eggs", "kids-special", 
            "Classic black tablets that grow into long mystical snakes when lit.", "1 Box (10 Pcs)", 
            120.0, 30.0, 75, "Zero Sound", true, true, 
            "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60", 
            180, 5, ""));

        addProduct(new Product("KID-03", "Colour Matches / Rainbow Sticks", "kids-special", 
            "Matchsticks that burn with glowing blue, green, and pink flames.", "1 Box (10 Matchboxes)", 
            160.0, 40.0, 75, "Zero Sound", true, true, 
            "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60", 
            130, 4, ""));

        addProduct(new Product("KID-04", "Peacock Feathers Fountain", "kids-special", 
            "Gentle, colorful table fountain shaped like a peacock spreading wings.", "1 Box (5 Pcs)", 
            360.0, 90.0, 75, "Low", true, true, 
            "https://images.unsplash.com/photo-1533230807127-716665511457?w=500&auto=format&fit=crop&q=60", 
            70, 5, ""));
    }

    private void addProduct(Product product) {
        productMap.put(product.getId(), product);
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(productMap.values());
    }

    public List<Product> getProductsByCategory(String categoryId) {
        return productMap.values().stream()
                .filter(p -> p.getCategory().equalsIgnoreCase(categoryId))
                .collect(Collectors.toList());
    }

    public Optional<Product> getProductById(String id) {
        return Optional.ofNullable(productMap.get(id));
    }

    public List<Category> getAllCategories() {
        return categoryList;
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        String q = query.toLowerCase().trim();
        return productMap.values().stream()
                .filter(p -> p.getName().toLowerCase().contains(q) || 
                             p.getCategory().toLowerCase().contains(q) ||
                             p.getDescription().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public Product updateStock(String id, int stock) {
        Product p = productMap.get(id);
        if (p != null) {
            p.setStock(stock);
        }
        return p;
    }

    public Product createProduct(Product product) {
        if (product.getId() == null || product.getId().trim().isEmpty()) {
            product.setId("PRD-" + (System.currentTimeMillis() % 100000));
        }
        if (product.getDiscountedPrice() <= 0 && product.getOriginalPrice() > 0) {
            int disc = product.getDiscountPercent() > 0 ? product.getDiscountPercent() : 75;
            product.setDiscountedPrice(product.getOriginalPrice() * (100 - disc) / 100.0);
        }
        productMap.put(product.getId(), product);
        return product;
    }

    public Optional<Product> updateProduct(String id, Product updated) {
        if (!productMap.containsKey(id)) {
            return Optional.empty();
        }
        updated.setId(id);
        productMap.put(id, updated);
        return Optional.of(updated);
    }

    public boolean deleteProduct(String id) {
        return productMap.remove(id) != null;
    }
}
