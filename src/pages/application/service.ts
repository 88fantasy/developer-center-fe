import request from 'umi-request';

export async function queryAppList(params: { count: number }) {
  return request('/api/getAppList', {
    params,
  });
}
