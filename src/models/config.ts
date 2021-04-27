import type { Reducer, Effect } from 'umi';

import { manyDictionary, } from '@/services/config';
import type { RequestOptionsType, } from '@ant-design/pro-utils/lib/typing';
import type { ApiResponseData } from 'ant-design-exframework';

export interface ConfigStateType {
  dictionary: Record<string, RequestOptionsType>;
}

export interface ConfigModelType {
  namespace: string;
  state: ConfigStateType;
  effects: {
    getDictionary: Effect;
  };
  reducers: {
    setDictionary: Reducer<ConfigStateType>;
  };
}

const Model: ConfigModelType = {
  namespace: 'config',

  state: {
    dictionary: {},
  },

  effects: {
    *getDictionary({ payload }, { call, put, select }) {
      const keys = payload as string[];
      const dictionary: Record<string, RequestOptionsType[]>  = yield select((state: { config: { dictionary: any; }; }) => state.config.dictionary) ;
      const requestKeys: string[] = keys.filter(key => !dictionary[key]);
      if(requestKeys.length > 0) {
        const response: ApiResponseData<Record<string, RequestOptionsType>> = yield call(manyDictionary, requestKeys);
        if(response.status) {
          yield put({
            type: 'setDictionary',
            payload: response.data,
          });
        }
      }
      else {
        yield put({
          type: 'setDictionary',
          payload: {},
        });
      }
      // Login successfully
      // if (response.status === 'ok') {
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params as { redirect: string };
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //       if (redirect.match(/^\/.*#/)) {
      //         redirect = redirect.substr(redirect.indexOf('#') + 1);
      //       }
      //     } else {
      //       window.location.href = '/';
      //       return;
      //     }
      //   }
      //   history.replace(redirect || '/');
      // }
    },
  },

  reducers: {
    setDictionary(state, { payload }) {
      const newDict = state?.dictionary;
      return {
        ...state,
        dictionary: { ...newDict, ...payload} || {},
      };
    },
  },
};

export default Model;
