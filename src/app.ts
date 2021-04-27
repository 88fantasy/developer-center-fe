import { setToken } from '@/utils/authority';

export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    if(props && props.tokenState) {
      setToken(props.tokenState);
    }
    // console.log('app1 bootstrap', props);
  },
  // 应用 render 之前触发
  // async mount(props) {
  //   console.log('app1 mount', props);
  // },
  // 应用卸载之后触发
  // async unmount(props) {
  //   console.log('app1 unmount', props);
  // },

  // 状态更新之后触发
  async update(props: any) {
    if(props && props.tokenState) {
      setToken(props.tokenState);
    }
    // console.log('app1 update', props);
  },
};
