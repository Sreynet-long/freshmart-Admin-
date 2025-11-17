import { gql } from "@apollo/client";

export const CREATE_CONTACT = gql`
  mutation SubmitContactForm($input: ContactFormInput) {
    submitContactForm(input: $input) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const GET_CONTACT_WITH_PAGINATION = gql`
  query GetContactWithPagination(
    $page: Int
    $limit: Int
    $pagination: Boolean
    $keyword: String
    $subject: String
  ) {
    getContactWithPagination(
      page: $page
      limit: $limit
      pagination: $pagination
      keyword: $keyword
      subject: $subject
    ) {
      data {
        id
        contactName
        email
        subject
        message
        reply
        status
        receivedAt
        updatedAt
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

export const REPLY_CONTACT = gql`
  mutation ReplyContact($contactId: ID!, $message: String!) {
    replyContact(contactId: $contactId, message: $message) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(_id: $id) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
