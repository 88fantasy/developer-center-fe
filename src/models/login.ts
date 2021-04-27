import { stringify } from 'querystring';
import type { Reducer, Effect } from 'umi';
import { history } from 'umi';

import type { LoginResponse } from '@/services/login';
import { accountLogin } from '@/services/login';
import { setAuthority, setToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import type { ApiResponseData } from 'ant-design-exframework';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  token?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response: ApiResponseData<LoginResponse> = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response.data,
      });
      // Login successfully
      if (response.data.status === 'ok') {
        setToken(response.data.token || '');
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/dashboard';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      setToken('');
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        token: payload.token,
        type: payload.type,
      };
    },
  },
};

export default Model;
