import { defineStore } from "pinia";

export const useParamStore = defineStore('param', {
    state() {
        return { period: null };
    }
});