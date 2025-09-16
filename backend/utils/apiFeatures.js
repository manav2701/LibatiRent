class ApiFeatures {
  // query ==> await Product.find();
  // queryString  ==> req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // specific product search() =>
  search() {
    //queryString.keyword => https://example.com/path/to/page?name=ferret&color=purple [here => name and color are keyword]
    const keyword = this.queryString.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this.queryString.keyword,
                $options: "i", // for case insenstiveness
              },
            },
            {
              description: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              sportsCategory: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              "tennisSpecs.brand": {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              "padelSpecs.brand": {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword }); // here query ==> await Product.find(); we know that

    return this;
  }

  // filter() the product ==> filetr work base on category
  filter() {
    const queryCopy = { ...this.queryString }; // making the new object of queryString
    //  Removing some fields for category

    const removeFields = [
      "keyword",
      "page",
      "limit",
      "pickupDate",
      "pickupTime",
      "returnDate",
      "returnTime",
    ]; // here we are filtering data based on other query like category , price so we are removing other query => "keyword", "page", "limit"

    removeFields.forEach((key) => delete queryCopy[key]); // remove unwanted query

    // Handle sports category filtering
    if (queryCopy.sportsCategory) {
      this.query = this.query.find({ sportsCategory: queryCopy.sportsCategory });
      delete queryCopy.sportsCategory;
    }

    // Handle tennis-specific filters
    if (queryCopy.tennisBrand) {
      this.query = this.query.find({ "tennisSpecs.brand": queryCopy.tennisBrand });
      delete queryCopy.tennisBrand;
    }

    if (queryCopy.headSize) {
      this.query = this.query.find({ "tennisSpecs.headSize": queryCopy.headSize });
      delete queryCopy.headSize;
    }

    if (queryCopy.gripSize) {
      this.query = this.query.find({ "tennisSpecs.gripSize": queryCopy.gripSize });
      delete queryCopy.gripSize;
    }

    // Handle padel-specific filters
    if (queryCopy.padelBrand) {
      this.query = this.query.find({ "padelSpecs.brand": queryCopy.padelBrand });
      delete queryCopy.padelBrand;
    }

    if (queryCopy.padelShape) {
      this.query = this.query.find({ "padelSpecs.shape": queryCopy.padelShape });
      delete queryCopy.padelShape;
    }

    // Handle rental pricing filters
    if (queryCopy.minPrice || queryCopy.maxPrice) {
      const priceFilter = {};
      if (queryCopy.minPrice) {
        priceFilter.$gte = Number(queryCopy.minPrice);
      }
      if (queryCopy.maxPrice) {
        priceFilter.$lte = Number(queryCopy.maxPrice);
      }
      // Update to use oneHour pricing instead of twoHours
      this.query = this.query.find({ "rentalPricing.oneHour.current": priceFilter });
      delete queryCopy.minPrice;
      delete queryCopy.maxPrice;
    }

    // Handle availability date filtering (Dubai time, then UTC for Mongo)
    if (
      this.queryString.pickupDate &&
      this.queryString.pickupTime &&
      this.queryString.returnDate &&
      this.queryString.returnTime
    ) {
      // Convert to Dubai time, then to UTC for MongoDB
      const pickupDateTime = new Date(
        `${this.queryString.pickupDate}T${this.queryString.pickupTime}:00+04:00`
      );
      const returnDateTime = new Date(
        `${this.queryString.returnDate}T${this.queryString.returnTime}:00+04:00`
      );
      const pickupUTC = new Date(pickupDateTime.toISOString());
      const returnUTC = new Date(returnDateTime.toISOString());

      this.query = this.query.find({
        $and: [
          { Stock: { $gt: 0 } },
          {
            $or: [
              {
                $and: [
                  { "availability.availableFrom.date": { $lte: returnUTC } },
                  { "availability.availableTo.date": { $gte: pickupUTC } },
                ],
              },
              { "availability.availableFrom.date": { $exists: false } },
            ],
          },
        ],
      });
    }

    // Handle legacy price and rating filters
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Renamed to use consistent casing
  pagination(resultPerPage) {
    // we are showing products resultPerPage{eg :5 item} in every page
    const currentPage = Number(this.queryString.page) || 1; // if there is no page value in query then show first page
    const skip = resultPerPage * (currentPage - 1); // here lets say we have 50 total product and we are showing 10 product  in one page so if page value is 2 then => 10 * (2-1) =  10, we will skip first 10 product for showing second page
    this.query = this.query.limit(resultPerPage).skip(skip); // limit is query of mongoose set limit to return product and skip is how many starting product we want to skip for next page number
    return this;
  }

  // Keep the old method for backward compatibility
  Pagination(resultPerPage) {
    return this.pagination(resultPerPage);
  }
}

module.exports = ApiFeatures;