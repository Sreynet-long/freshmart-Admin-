import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query GetUserbyId($id: ID!) {
    getUserbyId(_id: $id) {
      id
      username
      email
    }
  }
`;
export const GET_ADMINS = gql`
  query GetAdmins {
    getAdmins {
      id
      username
      phoneNumber
      email
      password
      checked
      token
      role
      createdAt
      updatedAt
    }
  }
`;
export const GET_USER_WITH_PAGINATION = gql`
  query GetUserWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getUserWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      id
      username
      phoneNumber
      email
      password
      checked
      token
      role
      createdAt
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

export const SIGN_UP_USER_FORM = gql`
  mutation SignupUserForm($input: UserSignUpInput) {
    signupUserForm(input: $input) {
      isSuccess
      messageKh
      messageEn
      data {
        id
        username
        phoneNumber
        email
        password
        checked
        token
      }
    }
  }
`;

export const LOGIN_USER_FORM = gql`
  mutation LoginUserForm($input: UserLoginInput) {
    loginUserForm(input: $input) {
      data {
        id
        username
        phoneNumber
        email
        password
        checked
        token
      }
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      isSuccess
      messageEn
      messageKh
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      isSuccess
      messageEn
      messageKh
    }
  }
`;


export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput) {
    updateUser(_id: $id, input: $input) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($_id: ID!, $checked: Boolean!) {
    updateUserStatus(_id: $_id, checked: $checked) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(_id: $id) {
      isSuccess
      messageKh
      messageEn
    }
  }
`;
