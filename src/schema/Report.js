import { gql } from "@apollo/client";

export const GET_REPORT_STATS = gql`
query GetReportStats($startDate: String!, $endDate: String!) {
  getReportStats(startDate: $startDate, endDate: $endDate) {
    totalRevenue
    totalOrders
    totalUsers
    pendingOrders
    dailyRevenue {
      day
      revenue
    }
    topCategories {
      name
      value
    }
  }
}
`;