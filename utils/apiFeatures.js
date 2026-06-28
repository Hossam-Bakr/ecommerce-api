class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    // filteration
    const queryStringObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryStringObj[field]);

    // filter with (gte|lte|gt|lt)
    let newquery = JSON.stringify(queryStringObj);
    newquery = JSON.parse(
      newquery.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`),
    );
    return this;
  }

  sort() {
    if (req.query.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.queryString = this.queryString.sort(sortBy);
    } else {
      this.queryString = this.queryString.sort("-createdAt");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const query = {};

      if (modelName === "products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  select() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate(countOfDocuments) {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const pagination = {};
    pagination.numberOfPages = Math.ceil(countOfDocuments / limit);
    pagination.currentPage = page;
    pagination.limit = limit;

    // next
    if (page * limit < countOfDocuments) {
      pagination.next = page + 1;
    }
    //  prev
    if (skip > 1) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeature;
