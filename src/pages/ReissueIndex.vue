<script setup>
import category from '@/assets/data/category.json';
import { NSpace } from 'naive-ui';
import { useParamStore } from '@/stores/param';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const paramStroe = useParamStore();
const { period } = storeToRefs(paramStroe);

watch(
    () => period.value,
    newValue => {
        const year = newValue.substring(0, 4);
        const sm = newValue.substring(4, 6);
        const em = newValue.substring(6, 8);

        document.title = `${year}年${sm}-${em}月再販發售表`;
    }
);
</script>
<template>
    <n-space>
        <a :href="period">All</a>|
        <template
            v-for="c in category"
            :key="c.key"
        >
            <a :href="`${period}?category=${c.key}`">{{ c.category }}</a>|
        </template>
        <a :href="`${period}?category=-`">Other</a>|
    </n-space>
    <router-view />
</template>