import { gql, request } from 'graphql-request';

export interface HistoricalPrice {
  pool: {
    assetAId: number;
    assetBId: number;
  };
  assetABalance: string;
  assetBBalance: string;
  paraChainBlockHeight: number;
  relayChainBlockHeight: number;
}

export interface HistoricalPrices {
  historicalPoolPriceData: Array<HistoricalPrice>;
}

const QUERY_POOL_FIRST_BLOCK = gql`
  query ($id: String!, $blockHeight: Int!) {
    historicalPoolPriceData(
      where: { relayChainBlockHeight_gte: $blockHeight, pool: { id_eq: $id } }
      orderBy: relayChainBlockHeight_ASC
      limit: 1
    ) {
      relayChainBlockHeight
      paraChainBlockHeight
    }
  }
`;

export async function queryPoolFirstBlock(
  squidUrl: string,
  poolId: string,
  blockHeight: number,
) {
  return await request<HistoricalPrices>(squidUrl, QUERY_POOL_FIRST_BLOCK, {
    id: poolId,
    blockHeight: blockHeight,
  });
}

const QUERY_POOL_LAST_BLOCK = gql`
  query ($id: String!, $blockHeight: Int!) {
    historicalPoolPriceData(
      where: { relayChainBlockHeight_lte: $blockHeight, pool: { id_eq: $id } }
      orderBy: relayChainBlockHeight_DESC
      limit: 1
    ) {
      relayChainBlockHeight
      paraChainBlockHeight
    }
  }
`;

export async function queryPoolLastBlock(
  squidUrl: string,
  poolId: string,
  blockHeight: number,
) {
  return await request<HistoricalPrices>(squidUrl, QUERY_POOL_LAST_BLOCK, {
    id: poolId,
    blockHeight: blockHeight,
  });
}

const QUERY_POOL_DATA = gql`
  query ($recordIds: [String!]!) {
    historicalPoolPriceData(
      where: { id_in: $recordIds }
      orderBy: relayChainBlockHeight_DESC
    ) {
      pool {
        assetAId
        assetBId
      }
      assetABalance
      assetBBalance
      relayChainBlockHeight
      paraChainBlockHeight
    }
  }
`;

export async function queryPoolPrice(squidUrl: string, ids: string[]) {
  return await request<HistoricalPrices>(squidUrl, QUERY_POOL_DATA, {
    recordIds: ids,
  });
}

const QUERY_POOL = gql`
  query ($id: String!) {
    lbpPoolData(where: { id_eq: $id }) {
      id
      startBlockNumber
      endBlockNumber
      initialWeight
      finalWeight
    }
  }
`;

export interface LbpPoolData {
  id: string;
  startBlockNumber: number;
  endBlockNumber: number;
  initialWeight: number;
  finalWeight: number;
}

export interface LbpPools {
  lbpPoolData: Array<LbpPoolData>;
}

export async function queryPool(squidUrl: string, poolId: string) {
  return await request<LbpPools>(squidUrl, QUERY_POOL, {
    id: poolId,
  });
}

const QUERY_POOLS = gql`
  query ($assetIn: Int!, $assetOut: Int!) {
    pools(
      where: { assetAId_eq: $assetIn, assetBId_eq: $assetOut, poolType_eq: LBP }
    ) {
      id
      assetAId
      assetBId
    }
  }
`;

export interface LbpPool {
  id: string;
  assetAId: number;
  assetBId: number;
}

export async function queryPools(
  squidUrl: string,
  assetIn: string,
  assetOut: string,
) {
  return await request<{ pools: Array<LbpPool> }>(squidUrl, QUERY_POOLS, {
    assetIn: Number(assetIn),
    assetOut: Number(assetOut),
  });
}
