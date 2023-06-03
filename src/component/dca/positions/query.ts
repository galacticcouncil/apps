import { gql, request } from 'graphql-request';

const QUERY_SCHEDULED = gql`
  query ($who: String!) {
    events(where: { args_jsonContains: { who: $who }, AND: { name_eq: "DCA.Scheduled" } }) {
      name
      args
      call {
        args
      }
    }
  }
`;

export async function queryScheduled(indexerUrl: string, who: string) {
  return await request<{
    events: Array<{
      name: 'DCA.Scheduled';
      args: {
        id: number;
        who: string;
      };
      call: {
        args: {
          schedule: {
            order: {
              assetIn: string;
              amountIn: string;
              assetOut: string;
              minLimit: string;
              slippage: number;
            };
            owner: string;
            period: number;
            totalAmount: string;
          };
          startExecutionBlock: number;
        };
      };
    }>;
  }>(indexerUrl, QUERY_SCHEDULED, {
    who: who,
  });
}

const QUERY_STATUS = gql`
  query ($who: String!) {
    events(where: { args_jsonContains: { who: $who }, AND: { name_in: ["DCA.Terminated", "DCA.Completed"] } }) {
      name
      args
    }
  }
`;

export async function queryStatus(indexerUrl: string, who: string) {
  return await request<{
    events: Array<{
      name: string;
      args: {
        id: number;
        who: string;
        error: any;
      };
    }>;
  }>(indexerUrl, QUERY_STATUS, {
    who: who,
  });
}
