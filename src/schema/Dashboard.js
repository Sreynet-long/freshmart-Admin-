import {gql} from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
query GetDashboardStats($startDate: String!, $endDate: String!) {
  getDashboardStats(startDate: $startDate, endDate: $endDate) {
    totalSales
    totalOrders
    totalUsers
    allTimePendingOrders
    currentPendingOrders
    dailyRevenue {
      day
      revenue
    }
    newUsers {
      day
      count
    }
    topCategories {
      name
      value
    }
  }
}
`;
