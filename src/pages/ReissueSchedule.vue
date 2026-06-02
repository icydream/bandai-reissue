<script setup>
import { ref, h, watch } from 'vue';
import { NDataTable, NSpace, NImage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useParamStore } from '@/stores/param';
import categoryData from '@/assets/data/category.json';

const route = useRoute();
const paramStroe = useParamStore();
const loading = ref(false);
const data = ref([]);
const pageData = ref([]);
const columns = [
    {
        title: '盒繪',
        width: 180,
        fixed: 'left',
        render(row) {
            return h(NImage, {
                src: row.cover,
                'img-props': {
                    width: '100%'
                }
            });
        }
    },
    {
        title: '品名',
        key: 'title',
        minWidth: 120
    },
    {
        title: '類別',
        key: 'category',
        minWidth: 80
    },
    {
        title: '售價',
        minWidth: 200,
        render(row) {
            let price = row.price;
            
            if(!!price) {
                price = `${Number(row.price).toLocaleString('ja-JP')} 円`;
            } else {
                price = '-';
            }

            return price;
        }
    }
];
const pagination = ref({
    page: 1,
    pageSize: 20,
    itemCount: 0,
    showSizePicker: false,
    prefix({ itemCount }) {
        return `共 ${itemCount} 筆資料`
    }
});
const handlePageChange = page => {
    pagination.value.page = page;
    pageData.value = data.value.filter((_, i) => {
        const startIndex = pagination.value.pageSize * (page - 1);
        const endIndex = pagination.value.pageSize * page - 1;

        return startIndex <= i && i <= endIndex;
    });
}

watch(
    [
        () => route.params.period,
        () => route.query.category
    ],
    async ([period, category]) => {
        loading.value = true;

        const jsonData = await import(`@/assets/data/${period}.json`);

        paramStroe.period = period;
        data.value = jsonData.default.map(data => {
            const result = categoryData.find(c => data.title.indexOf(c.key) !== -1);
            let category = '-';

            if(!!result) {
                category = result.category;
            }

            data.category = category;

            return data;
        })
        .filter(data => {
            if(!!category) {
                return data.category === category;
            }

            return true;
        });

        pagination.value.itemCount = data.value.length;
        handlePageChange(1);
        loading.value = false;
    },
    { immediate: true }
);
</script>
<template>
    <n-space item-style="width: 100%;" vertical>
        <n-data-table
            remote
            :loading="loading"
            :columns="columns"
            :data="pageData"
            :pagination="pagination"
            :scroll-x="800"
            @update:page="handlePageChange"
        />
  </n-space>
</template>