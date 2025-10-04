import Product from "../models/productModel.js";

// ✅ GET all products with filtering, search, sorting, and pagination
export const getProducts = async (req, res, next) => {
  try {
    // 🔍 Extract query parameters
    const { name, category, minPrice, maxPrice, sort, page = 1, limit = 5 } = req.query;

    // 🧩 Build filter object
    let query = {};

    // Search by name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ⚙️ Pagination setup
    const skip = (Number(page) - 1) * Number(limit);

    // 🧭 Sorting setup
    const sortOption = sort ? { [sort]: 1 } : { createdAt: -1 }; // default newest first

    // 🧮 Fetch filtered + sorted + paginated products
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // 🧾 Count total for pagination info
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ CREATE a product
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE a product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ✅ DELETE a product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
