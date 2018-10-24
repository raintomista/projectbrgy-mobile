import {
    action,
    configure,
    observable,
    runInAction
} from 'mobx';
import {
    ToastAndroid
} from 'react-native';
import { getMyReports as _getMyReports } from 'services/ReportService';
import * as localized from 'localization/en';

configure({
    enforceActions: 'always'
});

export default class ReportStore {
    @observable page = 0;
    @observable limit = 20;
    @observable order = 'desc';
    @observable hasMore = true;
    @observable error = false;
    @observable refreshing = false;

    @observable myReports = [];

    @action 
    resetStore() {
        this.page = 0;
        this.hasMore = true;
        this.error = false;
        this.refreshing = false;
        this.myReports = [];
    }

    @action
    async getMyReports() {     
      this.page += 1;
      try {
        const response = await _getMyReports(this.page, this.limit, this.order);
        runInAction(() => {
          this.myReports.push(...response.data.data.reports);
        });
      } catch (e) {
        ToastAndroid.show(localized.NETWORK_ERROR, ToastAndroid.SHORT);
      }
    }   

    @action
    async refreshMyReports() {
        this.page = 1;

        try {
            const response = await _getMyReports(this.page, this.limit, this.order);;
            runInAction(() => {
                this.myReports = response.data.data.reports
            });
        } catch(e) {
            ToastAndroid.show(localized.NETWORK_ERROR, ToastAndroid.SHORT);
        }
    }

}