import { gql } from "@apollo/client";

export const GET_ALL_REVIEWS = gql`
  query GetReviewWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getReviewWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      id
      name
      rating
      comment
      product {
        id
        productName
        category
        imageUrl
        desc
        price
      }
      createdAt
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


export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;

export const GET_REVIEW_BY_PRODUCT = gql`
  query GetReviewsByProduct($productId: ID!) {
    getReviewsByProduct(productId: $productId) {
      id
      name
      rating
      comment
      product {
        id
        productName
        category
        imageUrl
        desc
        price
      }
      createdAt
    }
  }
`;