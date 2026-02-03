import { db } from './index'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await db.users.create({
    email: 'admin@safarovshop.com',
    name: 'Admin User',
    password: hashedPassword,
    role: 'ADMIN',
  })

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await db.users.create({
    email: 'user@safarovshop.com',
    name: 'Test User',
    password: userPassword,
    role: 'USER',
  })

  console.log('✅ Created users')

  // Create categories
  const womenCategory = await db.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: {
      name: 'Women',
      slug: 'women',
      description: "Luxury women's collection",
    },
  })

  const menCategory = await db.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: {
      name: 'Men',
      slug: 'men',
      description: "Luxury men's collection",
    },
  })

  const kidsCategory = await db.category.upsert({
    where: { slug: 'kids' },
    update: {},
    create: {
      name: 'Kids',
      slug: 'kids',
      description: "Luxury kids' collection",
    },
  })

  // Subcategories - Women
  const womenOuterwear = await db.category.upsert({
    where: { slug: 'women-outerwear' },
    update: {},
    create: {
      name: 'Outerwear',
      slug: 'women-outerwear',
      description: "Women's outerwear",
      parentId: womenCategory.id,
    },
  })

  const womenCoats = await db.category.upsert({
    where: { slug: 'women-coats-jackets' },
    update: {},
    create: {
      name: 'Coats & Jackets',
      slug: 'women-coats-jackets',
      description: "Women's coats and jackets",
      parentId: womenCategory.id,
    },
  })

  const womenBlazers = await db.category.upsert({
    where: { slug: 'women-blazers' },
    update: {},
    create: {
      name: 'Blazers',
      slug: 'women-blazers',
      description: "Women's blazers",
      parentId: womenCategory.id,
    },
  })

  const womenBags = await db.category.upsert({
    where: { slug: 'women-bags' },
    update: {},
    create: {
      name: 'Bags',
      slug: 'women-bags',
      description: "Women's bags",
      parentId: womenCategory.id,
    },
  })

  const womenHandbags = await db.category.upsert({
    where: { slug: 'women-handbags' },
    update: {},
    create: {
      name: 'Handbags',
      slug: 'women-handbags',
      description: "Women's handbags",
      parentId: womenCategory.id,
    },
  })

  const womenAccessories = await db.category.upsert({
    where: { slug: 'women-accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'women-accessories',
      description: "Women's accessories",
      parentId: womenCategory.id,
    },
  })

  const womenScarves = await db.category.upsert({
    where: { slug: 'women-scarves' },
    update: {},
    create: {
      name: 'Scarves',
      slug: 'women-scarves',
      description: "Women's scarves",
      parentId: womenCategory.id,
    },
  })

  const womenGloves = await db.category.upsert({
    where: { slug: 'women-gloves' },
    update: {},
    create: {
      name: 'Gloves',
      slug: 'women-gloves',
      description: "Women's gloves",
      parentId: womenCategory.id,
    },
  })

  const womenShoes = await db.category.upsert({
    where: { slug: 'women-shoes' },
    update: {},
    create: {
      name: 'Shoes',
      slug: 'women-shoes',
      description: "Women's shoes",
      parentId: womenCategory.id,
    },
  })

  // Subcategories - Men
  const menOuterwear = await db.category.upsert({
    where: { slug: 'men-outerwear' },
    update: {},
    create: {
      name: 'Outerwear',
      slug: 'men-outerwear',
      description: "Men's outerwear",
      parentId: menCategory.id,
    },
  })

  const menCoats = await db.category.upsert({
    where: { slug: 'men-coats-jackets' },
    update: {},
    create: {
      name: 'Coats & Jackets',
      slug: 'men-coats-jackets',
      description: "Men's coats and jackets",
      parentId: menCategory.id,
    },
  })

  const menBlazers = await db.category.upsert({
    where: { slug: 'men-blazers' },
    update: {},
    create: {
      name: 'Blazers',
      slug: 'men-blazers',
      description: "Men's blazers",
      parentId: menCategory.id,
    },
  })

  const menSuits = await db.category.upsert({
    where: { slug: 'men-suits' },
    update: {},
    create: {
      name: 'Suits',
      slug: 'men-suits',
      description: "Men's suits",
      parentId: menCategory.id,
    },
  })

  const menAccessories = await db.category.upsert({
    where: { slug: 'men-accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'men-accessories',
      description: "Men's accessories",
      parentId: menCategory.id,
    },
  })

  const menScarves = await db.category.upsert({
    where: { slug: 'men-scarves' },
    update: {},
    create: {
      name: 'Scarves',
      slug: 'men-scarves',
      description: "Men's scarves",
      parentId: menCategory.id,
    },
  })

  const menGloves = await db.category.upsert({
    where: { slug: 'men-gloves' },
    update: {},
    create: {
      name: 'Gloves',
      slug: 'men-gloves',
      description: "Men's gloves",
      parentId: menCategory.id,
    },
  })

  const menShoes = await db.category.upsert({
    where: { slug: 'men-shoes' },
    update: {},
    create: {
      name: 'Shoes',
      slug: 'men-shoes',
      description: "Men's shoes",
      parentId: menCategory.id,
    },
  })

  // Subcategories - Kids
  const kidsOuterwear = await db.category.upsert({
    where: { slug: 'kids-outerwear' },
    update: {},
    create: {
      name: 'Outerwear',
      slug: 'kids-outerwear',
      description: "Kids' outerwear",
      parentId: kidsCategory.id,
    },
  })

  const kidsCoats = await db.category.upsert({
    where: { slug: 'kids-coats' },
    update: {},
    create: {
      name: 'Coats',
      slug: 'kids-coats',
      description: "Kids' coats",
      parentId: kidsCategory.id,
    },
  })

  const kidsAccessories = await db.category.upsert({
    where: { slug: 'kids-accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'kids-accessories',
      description: "Kids' accessories",
      parentId: kidsCategory.id,
    },
  })

  const kidsScarves = await db.category.upsert({
    where: { slug: 'kids-scarves' },
    update: {},
    create: {
      name: 'Scarves',
      slug: 'kids-scarves',
      description: "Kids' scarves",
      parentId: kidsCategory.id,
    },
  })

  const kidsGloves = await db.category.upsert({
    where: { slug: 'kids-gloves' },
    update: {},
    create: {
      name: 'Gloves',
      slug: 'kids-gloves',
      description: "Kids' gloves",
      parentId: kidsCategory.id,
    },
  })

  console.log('✅ Created categories')

  // Create products
  const products = [
    // Women's Products
    {
      name: 'Elegant White Coat',
      slug: 'elegant-white-coat-women',
      description:
        'A timeless white coat crafted from premium materials, featuring a sophisticated silhouette that exudes elegance and refinement. Perfect for the modern woman who appreciates classic luxury with contemporary flair. The impeccable tailoring ensures a flattering fit while maintaining exceptional comfort throughout the day.',
      price: 2899.99,
      currency: 'USD',
      categoryId: womenCoats.id,
      material: 'Premium Wool Blend',
      featured: true,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'White' },
        { name: 'Color', value: 'Ivory' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Classic Trench Coat',
      slug: 'classic-trench-coat-women',
      description:
        'An iconic trench coat that embodies timeless sophistication. Meticulously designed with attention to every detail, this piece combines functionality with unparalleled style. The refined cut and premium fabric create a garment that transitions seamlessly from day to evening, making it an essential addition to any luxury wardrobe.',
      price: 2499.99,
      currency: 'USD',
      categoryId: womenCoats.id,
      material: 'Waterproof Cotton Gabardine',
      featured: true,
      images: ['/images/woman_palto_tal1.png'],
      variants: [
        { name: 'Color', value: 'Camel' },
        { name: 'Color', value: 'Black' },
        { name: 'Color', value: 'Navy' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Luxury Cashmere Scarf',
      slug: 'luxury-cashmere-scarf-women',
      description:
        'An exquisite cashmere scarf that combines warmth with elegance. Made from the finest cashmere fibers, this accessory adds a touch of luxury to any ensemble. The soft texture and timeless design make it a perfect companion for all seasons.',
      price: 599.99,
      currency: 'USD',
      categoryId: womenScarves.id,
      material: '100% Cashmere',
      featured: false,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Ivory' },
        { name: 'Color', value: 'Gray' },
        { name: 'Color', value: 'Navy' },
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Premium Leather Gloves',
      slug: 'premium-leather-gloves-women',
      description:
        'Handcrafted leather gloves with cashmere lining for ultimate comfort and warmth. The premium Italian leather exterior provides durability while the soft cashmere interior ensures your hands stay cozy. A perfect blend of style and functionality.',
      price: 399.99,
      currency: 'USD',
      categoryId: womenGloves.id,
      material: 'Italian Leather, Cashmere Lining',
      featured: false,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Brown' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['S', 'M', 'L'],
    },
    {
      name: 'Elegant Blazer',
      slug: 'elegant-blazer-women',
      description:
        'A sophisticated blazer that defines modern elegance. Crafted with precision and attention to detail, this piece offers a perfect balance of professional sophistication and contemporary style.',
      price: 1899.99,
      currency: 'USD',
      categoryId: womenBlazers.id,
      material: 'Premium Wool',
      featured: false,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Luxury Handbag',
      slug: 'luxury-handbag-women',
      description:
        'An exquisite handbag that combines functionality with timeless elegance. Made from premium leather with meticulous craftsmanship, this accessory is a perfect companion for any occasion.',
      price: 2499.99,
      currency: 'USD',
      categoryId: womenHandbags.id,
      material: 'Premium Italian Leather',
      featured: true,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Black' },
        { name: 'Color', value: 'Brown' },
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Classic Tote Bag',
      slug: 'classic-tote-bag-women',
      description:
        'A versatile tote bag that seamlessly blends style with practicality. Spacious and elegantly designed, this bag is perfect for everyday use while maintaining a sophisticated appearance.',
      price: 1299.99,
      currency: 'USD',
      categoryId: womenBags.id,
      material: 'Premium Leather',
      featured: false,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Beige' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Elegant Outerwear',
      slug: 'elegant-outerwear-women',
      description:
        'A refined outerwear piece that offers both warmth and style. Designed with premium materials and impeccable tailoring, this garment is perfect for transitional seasons.',
      price: 2199.99,
      currency: 'USD',
      categoryId: womenOuterwear.id,
      material: 'Wool Blend',
      featured: false,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Camel' },
        { name: 'Color', value: 'Navy' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Luxury Accessories Set',
      slug: 'luxury-accessories-set-women',
      description:
        'A curated collection of luxury accessories designed to complement any ensemble. Each piece is crafted with attention to detail and premium materials.',
      price: 899.99,
      currency: 'USD',
      categoryId: womenAccessories.id,
      material: 'Mixed Premium Materials',
      featured: false,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Ivory' },
        { name: 'Color', value: 'Navy' },
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Classic Women Shoes',
      slug: 'classic-women-shoes',
      description:
        'Timeless elegance meets modern comfort in these beautifully crafted shoes. Made from premium materials with exceptional attention to detail.',
      price: 799.99,
      currency: 'USD',
      categoryId: womenShoes.id,
      material: 'Premium Leather',
      featured: false,
      images: ['/images/woman_coat_white1.png'],
      variants: [
        { name: 'Color', value: 'Black' },
        { name: 'Color', value: 'Navy' },
      ],
      sizes: ['6', '7', '8', '9', '10'],
    },
    // Men's Products
    {
      name: 'Classic Suit',
      slug: 'classic-suit-men',
      description:
        'A masterfully tailored suit that defines sartorial excellence. Crafted from the finest fabrics with precision and care, this suit offers a perfect balance of traditional elegance and modern sophistication. The impeccable fit and attention to detail make it an essential piece for the discerning gentleman.',
      price: 3299.99,
      currency: 'USD',
      categoryId: menSuits.id,
      material: 'Super 120s Wool',
      featured: true,
      images: ['/images/suit1.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Charcoal' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Premium Cashmere Sweater',
      slug: 'premium-cashmere-sweater-men',
      description:
        'Experience the ultimate in luxury with this exquisite cashmere sweater. Made from the finest cashmere fibers, it offers exceptional softness and warmth. The classic design ensures versatility, making it perfect for both casual and refined occasions. A true testament to timeless elegance.',
      price: 1299.99,
      currency: 'USD',
      categoryId: menOuterwear.id,
      material: '100% Cashmere',
      featured: true,
      images: ['/images/sweater1.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Gray' },
        { name: 'Color', value: 'Charcoal' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Navy Blue Cashmere Sweater',
      slug: 'navy-blue-cashmere-sweater-men',
      description:
        'A sophisticated navy blue cashmere sweater that combines luxury with practicality. The rich color and premium texture create a garment that elevates any ensemble. Perfect for layering or wearing on its own, this piece embodies refined casual elegance.',
      price: 1199.99,
      currency: 'USD',
      categoryId: menOuterwear.id,
      material: '100% Cashmere',
      featured: false,
      images: ['/images/sweater_blue.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Royal Blue' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Elegant Cardigan',
      slug: 'elegant-cardigan-men',
      description:
        'A refined cardigan that seamlessly blends comfort with sophistication. The classic design and premium materials make it a versatile addition to any wardrobe. Whether worn casually or for more formal occasions, this cardigan offers timeless style and exceptional quality.',
      price: 899.99,
      currency: 'USD',
      categoryId: menOuterwear.id,
      material: 'Merino Wool Blend',
      featured: false,
      images: ['/images/cardigan1.png'],
      variants: [
        { name: 'Color', value: 'Gray' },
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Charcoal' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Dark Green Loafers',
      slug: 'dark-green-loafers-men',
      description:
        'Handcrafted loafers in a distinctive dark green hue that exudes sophistication and style. Made from premium leather with meticulous attention to detail, these loafers offer both comfort and elegance. The timeless design ensures they remain a cherished part of your collection for years to come.',
      price: 799.99,
      currency: 'USD',
      categoryId: menShoes.id,
      material: 'Premium Italian Leather',
      featured: false,
      images: ['/images/lofer_darkgreen1.png'],
      variants: [
        { name: 'Color', value: 'Dark Green' },
        { name: 'Color', value: 'Brown' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['7', '8', '9', '10', '11', '12'],
    },
    {
      name: 'Classic Dark Blue Cap',
      slug: 'classic-dark-blue-cap-men',
      description:
        'A sophisticated dark blue cap that combines classic style with modern comfort. Crafted from premium materials, this cap offers protection from the elements while maintaining an elegant appearance. The refined design makes it a perfect accessory for the discerning gentleman.',
      price: 299.99,
      currency: 'USD',
      categoryId: menAccessories.id,
      material: 'Premium Cotton Blend',
      featured: false,
      images: ['/images/cap_darkblue.png'],
      variants: [
        { name: 'Color', value: 'Dark Blue' },
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Elegant Silk Scarf',
      slug: 'elegant-silk-scarf-men',
      description:
        'A refined silk scarf that adds sophistication to any outfit. Made from premium silk, this accessory features a classic pattern that never goes out of style. Perfect for both formal and casual occasions.',
      price: 449.99,
      currency: 'USD',
      categoryId: menScarves.id,
      material: '100% Silk',
      featured: false,
      images: ['/images/suit1.png'],
      variants: [
        { name: 'Color', value: 'Navy & White' },
        { name: 'Color', value: 'Charcoal' },
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Premium Leather Gloves',
      slug: 'premium-leather-gloves-men',
      description:
        'Handcrafted leather gloves designed for the modern gentleman. Made from supple Italian leather with a warm cashmere lining, these gloves offer both style and comfort during colder months.',
      price: 349.99,
      currency: 'USD',
      categoryId: menGloves.id,
      material: 'Italian Leather, Cashmere Lining',
      featured: false,
      images: ['/images/suit1.png'],
      variants: [
        { name: 'Color', value: 'Brown' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['M', 'L', 'XL'],
    },
    {
      name: 'Classic Men Blazer',
      slug: 'classic-men-blazer',
      description:
        'A timeless blazer that embodies sartorial excellence. Crafted with precision and attention to detail, this piece offers versatility and sophistication for any occasion.',
      price: 1899.99,
      currency: 'USD',
      categoryId: menBlazers.id,
      material: 'Super 120s Wool',
      featured: false,
      images: ['/images/suit1.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Charcoal' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Premium Men Coat',
      slug: 'premium-men-coat',
      description:
        'A sophisticated coat designed for the modern gentleman. Made from premium materials with exceptional craftsmanship, this piece offers both style and functionality.',
      price: 2499.99,
      currency: 'USD',
      categoryId: menCoats.id,
      material: 'Premium Wool Blend',
      featured: true,
      images: ['/images/suit1.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Charcoal' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    // Kids' Products
    {
      name: 'Brown Kids Coat',
      slug: 'brown-kids-coat',
      description:
        'A charming brown coat designed specifically for children, combining style with practicality. Made from durable, high-quality materials that ensure warmth and comfort. The thoughtful design allows for ease of movement while maintaining an elegant appearance that children will love.',
      price: 599.99,
      currency: 'USD',
      categoryId: kidsCoats.id,
      material: 'Premium Wool Blend',
      featured: true,
      images: ['/images/kids_coat_brown.png'],
      variants: [
        { name: 'Color', value: 'Brown' },
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Black' },
      ],
      sizes: ['4', '6', '8', '10', '12'],
    },
    {
      name: 'Brown Kids Uniform',
      slug: 'brown-kids-uniform',
      description:
        'A distinguished brown uniform for children that embodies elegance and tradition. Crafted with attention to detail and made from premium materials, this uniform offers both comfort and sophistication. Perfect for special occasions or formal events, ensuring your child looks their absolute best.',
      price: 449.99,
      currency: 'USD',
      categoryId: kidsOuterwear.id,
      material: 'Premium Wool Blend',
      featured: false,
      images: ['/images/kids_uniform_brown.png'],
      variants: [
        { name: 'Color', value: 'Brown' },
        { name: 'Color', value: 'Navy' },
      ],
      sizes: ['4', '6', '8', '10', '12'],
    },
    {
      name: 'Kids Cashmere Scarf',
      slug: 'kids-cashmere-scarf',
      description:
        'A soft and warm cashmere scarf designed specifically for children. Made from premium cashmere, this scarf provides warmth while being gentle on sensitive skin. The classic design ensures it pairs beautifully with any outfit.',
      price: 199.99,
      currency: 'USD',
      categoryId: kidsScarves.id,
      material: '100% Cashmere',
      featured: false,
      images: ['/images/kids_coat_brown.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Gray' },
        { name: 'Color', value: 'Red' },
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Kids Warm Gloves',
      slug: 'kids-warm-gloves',
      description:
        'Comfortable and warm gloves designed for children. Made from soft materials with a cozy lining, these gloves keep little hands warm while allowing for easy movement. Perfect for winter activities and outdoor play.',
      price: 149.99,
      currency: 'USD',
      categoryId: kidsGloves.id,
      material: 'Wool Blend',
      featured: false,
      images: ['/images/kids_coat_brown.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Red' },
        { name: 'Color', value: 'Gray' },
      ],
      sizes: ['XS', 'S', 'M'],
    },
    {
      name: 'Kids Accessories Set',
      slug: 'kids-accessories-set',
      description:
        'A delightful collection of accessories designed specifically for children. Each piece is crafted with care and made from premium materials that are gentle on sensitive skin.',
      price: 299.99,
      currency: 'USD',
      categoryId: kidsAccessories.id,
      material: 'Premium Materials',
      featured: false,
      images: ['/images/kids_coat_brown.png'],
      variants: [
        { name: 'Color', value: 'Navy' },
        { name: 'Color', value: 'Red' },
      ],
      sizes: ['One Size'],
    },
  ]

  for (const productData of products) {
    const { images, variants, sizes, ...productInfo } = productData

    const product = await db.product.create(productInfo)

    // Create images
    await db.productImage.createMany(
      images.map((url, index) => ({
        productId: product.id,
        url,
        alt: `${productInfo.name} - Image ${index + 1}`,
        position: index,
      }))
    )

    // Create color variants
    for (const variant of variants) {
      await db.variant.create({
        productId: product.id,
        name: variant.name,
        value: variant.value,
      })
    }

    // Create size variants and inventory
    for (const size of sizes) {
      const sizeVariant = await db.variant.create({
        productId: product.id,
        name: 'Size',
        value: size,
      })

      await db.inventory.create({
        productId: product.id,
        variantId: sizeVariant.id,
        quantity: Math.floor(Math.random() * 20) + 5,
      })
    }

    console.log(`✅ Created product: ${product.name}`)
  }

  // Create sample address
  const address = await db.address.create({
    userId: user.id,
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 234 567 8900',
    isDefault: true,
  })

  console.log('✅ Created address')

  // Create sample order
  const elegantWhiteCoat = await db.product.findUnique({ where: { slug: 'elegant-white-coat-women' } })

  if (elegantWhiteCoat) {
    const order = await db.order.create({
      userId: user.id,
      status: 'DELIVERED',
      total: 2899.99,
      shippingAddressId: address.id,
    })

    await db.orderItem.create({
      orderId: order.id,
      productId: elegantWhiteCoat.id,
      quantity: 1,
      price: 2899.99,
    })

    console.log('✅ Created sample order')
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
