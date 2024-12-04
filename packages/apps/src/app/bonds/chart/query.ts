import { gql, request } from 'graphql-request';

const allBlocksSquidUrl =
  'https://galacticcouncil.squids.live/hydration-storage-dictionary:lbppool/api/graphql';

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

export interface HistoricalBalance {
  balances: {
    free: string;
    frozen: string;
    rezerved: string;
  };
  assetId: string;
}

export interface HistoricalPrices {
  lbpPoolHistoricalData: { nodes: Array<HistoricalPrice> };
}

const QUERY_POOL_FIRST_BLOCK = gql`
  query FirstBlock($id: String!, $blockHeight: Int!) {
    lbpPoolHistoricalData(
      filter: {
        poolId: { equalTo: $id }
        relayChainBlockHeight: { greaterThanOrEqualTo: $blockHeight }
      }
      first: 1
      orderBy: RELAY_CHAIN_BLOCK_HEIGHT_ASC
    ) {
      nodes {
        paraChainBlockHeight
        relayChainBlockHeight
      }
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
  query LastBlock($id: String!, $blockHeight: Int!) {
    lbpPoolHistoricalData(
      filter: {
        poolId: { equalTo: $id }
        relayChainBlockHeight: { lessThanOrEqualTo: $blockHeight }
      }
      first: 1
      orderBy: RELAY_CHAIN_BLOCK_HEIGHT_DESC
    ) {
      nodes {
        paraChainBlockHeight
        relayChainBlockHeight
      }
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
    lbpPools(
      filter: { id: { in: $recordIds } }
      orderBy: RELAY_CHAIN_BLOCK_HEIGHT_DESC
    ) {
      nodes {
        relayChainBlockHeight
        lbpPoolAssetsDataByPoolId {
          nodes {
            balances
            assetId
          }
        }
      }
    }
  }
`;

export async function queryPoolPrice(recordIds: string[]) {
  return await request<{
    lbpPools: {
      nodes: Array<{
        relayChainBlockHeight: number;
        lbpPoolAssetsDataByPoolId: {
          nodes: Array<HistoricalBalance>;
        };
      }>;
    };
  }>(allBlocksSquidUrl, QUERY_POOL_DATA, {
    recordIds,
  });
}

const QUERY_POOL = gql`
  query ($id: String!) {
    lbpPool(id: $id) {
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
  lbpPool: LbpPoolData;
}

export async function queryPool(squidUrl: string, poolId: string) {
  return await request<LbpPools>(squidUrl, QUERY_POOL, {
    id: poolId,
  });
}

const QUERY_POOLS = gql`
  query ($assetIn: String!, $assetOut: String!) {
    lbpPools(
      filter: {
        assetAId: { equalTo: $assetIn }
        assetBId: { equalTo: $assetOut }
      }
    ) {
      nodes {
        id
        assetAId
        assetBId
      }
    }
  }
`;

export interface LbpPool {
  id: string;
  assetAId: string;
  assetBId: string;
}

export async function queryPools(
  squidUrl: string,
  assetIn: string,
  assetOut: string,
) {
  const data = await request<{ lbpPools: { nodes: Array<LbpPool> } }>(
    squidUrl,
    QUERY_POOLS,
    {
      assetIn: assetIn,
      assetOut: assetOut,
    },
  );

  return data.lbpPools.nodes;
}
