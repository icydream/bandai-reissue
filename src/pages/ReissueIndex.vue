<script setup>
import category from '@/assets/data/category.json';
import { NSpace } from 'naive-ui';
import { useParamStore } from '@/stores/param';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const paramStroe = useParamStore();
const { period } = storeToRefs(paramStroe);
const cloneCagegory = [...category];

watch(
    () => period.value,
    newValue => {
        const year = newValue.substring(0, 4);
        const sm = newValue.substring(4, 6);
        const em = newValue.substring(6, 8);

        document.title = `${year}年${sm}-${em}月再販發售表`;
    }
);

cloneCagegory.sort((a, b) => a.display - b.display);
</script>
<template>
    <n-space>
        |<router-link :to="{ name: 'schedule', params: { period } }">All</router-link>|
        <template
            v-for="c in cloneCagegory"
            :key="c.category"
        >
            <router-link :to="{ name: 'schedule', params: { period }, query: { category: c.category } }">{{ c.label || c.category }}</router-link>|
        </template>
        <router-link :to="{ name: 'schedule', params: { period }, query: { category: '-' } }">Other</router-link>|
    </n-space>
    <router-view />
</template>