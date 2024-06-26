const mongoose = require("mongoose");

/*********************productSchema**************************/
let productSchemaObject = {
    title: {
        type: String,
        required: [true, "name is required"],
        minlength: [4, "product name should atleast have four characters"],
    },
    price: {
        type: Number,
        required: [true, "price is required"],
        min: [0, "price can't be negative"]
    },
    discount: {
        type: Number,
        default: 0,
        validate: [function () {
            return this.price >= this.discount;
        }, "discount can't be more then the price"]
    },
    description: String,
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://picsum.photos/200/300"
    },
    reviews: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "MarchreviewModel"
    },
    // will be given to you by razorpay 
    averageRating: {
        type: Number,
        max: [5, "avg rating can not be more than 5"],
        min: [1, "rating can not be less than 1"],

    },
}
const productSchema = new mongoose.Schema(productSchemaObject);
/**********************pre-hooks*****************/
const catgories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing"
];

productSchema.pre("save", function (next) {
    let isPresent = catgories.find((cCategory) => { return cCategory == this.category })
    if (isPresent == undefined) {
        const error = new Error("category is invalid");
        return next(error);
    }
    return next();
})
productSchema.pre("findOne", function (next) {
    this.select("-__v")
    next();
})
// productSchema.post("find", function (err, docs, next) {
//     if (err) {
//         next(err);
//     } else {
//         docs.forEach((doc) => {
//             doc.id = doc["_id"];
//             delete doc["_id"];
//         })
//         console.log(docs)
//         next();
//     }
// })
// productMODEL 
const ProductModel = mongoose.model("MarchproductModel", productSchema);

module.exports = ProductModel;

