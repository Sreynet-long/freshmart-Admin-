import { gql } from "@apollo/client";
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(_id: $id, status: $status) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;


export const DELETE_ORDER = gql`
mutation DeleteOrder($id: ID!) {
  deleteOrder(_id: $id) {
    isSuccess
    messageKh
    messageEn
  }
}
`;
export const PROCEED_TO_CHECKOUT = gql`
  mutation ProceedToCheckout(
    $userId: ID!
    $shippingInfo: ShippingInfoInput
    $items: [OrderItemInput]
    $paymentMethod: String
    $paymentProof: String
  ) {
    proceedToCheckout(
      userId: $userId
      shippingInfo: $shippingInfo
      items: $items
      paymentMethod: $paymentMethod
      paymentProof: $paymentProof
    ) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const GET_ORDER_WITH_PAGINATION = gql`
query GetOrdersWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $status: String) {
  getOrdersWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, status: $status) {
    data {
      id
      userId
      shippingInfo {
        name
        phone
        email
        address
        country
      }
      items {
        product {
          id
          productName
          category
          imageUrl
          desc
          price
          averageRating
          reviewsCount
        }
        quantity
        price
      }
      totalPrice
      status
      paymentMethod
      paymentProof
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
export const GET_ORDER_BY_USER = gql`
  query GetOrders($userId: ID!) {
  getOrders(userId: $userId) {
    id
    userId
    shippingInfo {
      name
      phone
      email
      address
      country
    }
    items {
      product {
        id
        productName
        category
        imageUrl
        desc
        price
      }
      quantity
      price
    }
    totalPrice
    status
    paymentMethod
    paymentProof
    createdAt
  }
}
`;
export const CANCEL_ORDER = gql `
  mutation CancelOrder($orderId: ID!) {
  cancelOrder(orderId: $orderId) {
    id
    userId
    shippingInfo {
      name
      phone
      email
      address
      country
    }
    items {
      product {
        id
        productName
        category
        imageUrl
        desc
        price
      }
      quantity
      price
    }
    totalPrice
    status
    paymentMethod
    paymentProof
    createdAt
  }
}
`;
export const NEW_NOTIFICATION = gql`
subscription NewNotification($userId: ID!) {
  newNotification(userId: $userId) {
    id
    userId
    message
    orderId
    type
    createdAt
  }
}
`;