import type { AnyAction, Reducer } from 'redux';
import type { EffectsCommandMap } from 'dva';
import type { ActivitiesType, NoticeType,  } from './data.d';
import { queryActivities, queryProjectNotice } from './service';
import type { ApiResponseData } from 'ant-design-exframework';

export interface ModalState {
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
    clear: Reducer<ModalState>;
  };
  effects: {
    init: Effect;
    fetchProjectNotice: Effect;
    fetchActivitiesList: Effect;
  };
}

const Model: ModelType = {
  namespace: 'dashboardAndworkplace',
  state: {
    projectNotice: [],
    activities: [],
  },
  effects: {
    *init(_, { put }) {
      yield put({ type: 'fetchProjectNotice' });
      yield put({ type: 'fetchActivitiesList' });
    },
    *fetchProjectNotice(_, { call, put }) {
      const response: ApiResponseData<NoticeType[]> = yield call(queryProjectNotice);
      yield put({
        type: 'save',
        payload: {
          projectNotice: Array.isArray(response.data) ? response.data : [],
        },
      });
    },
    *fetchActivitiesList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'save',
        payload: {
          activities: Array.isArray(response) ? response : [],
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        projectNotice: [],
        activities: [],
      };
    },
  },
};

export default Model;
