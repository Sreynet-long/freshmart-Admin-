import { gql } from "@apollo/client";

export const GET_PRODUCT_WITH_PAGINATION = gql`
  query GetProductWithPagination(
    $page: Int
    $limit: Int
    $pagination: Boolean
    $keyword: String
    $category: Category 
  ) {
    getProductWithPagination(
      page: $page
      limit: $limit
      pagination: $pagination
      keyword: $keyword
      category: $category
    ) {
      data {
        id
        productName
        category
        imageUrl
        desc
        price
      }
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;
export const GET_PRODUCT_BY_CATEGORY = gql`
query GetProductsByCategory($category: Category!) {
  getProductsByCategory(category: $category) {
    id
    productName
    category
    imageUrl
    desc
    price
    qty
    instock
  }
}

`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
  getProductById(_id: $id) {
    id
    productName
    category
    imageUrl
    desc
    price
    averageRating
    reviewsCount
  }
}
`;
export const GET_ALL_PRODUCT = gql`
  query GetAllproducts {
    getAllproducts {
      id
      productName
      category
      imageUrl
      desc
      price
    }
  }
`;

export const GET_PRODUCT = gql`
query GetProducts($category: String, $page: Int, $limit: Int) {
  getProducts(category: $category, page: $page, limit: $limit) {
    id
    productName
    category
    imageUrl
    desc
    price
    averageRating
    reviewsCount
  }
}
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput) {
    createProduct(input: $input) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput) {
    updateProduct(_id: $id, input: $input) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(_id: $id) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
